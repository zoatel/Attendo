const express = require("express");
const admin = require("firebase-admin");
const mqtt = require("mqtt");
const bodyParser = require("body-parser");
const cors = require("cors"); // Added CORS package

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from your frontend origin
    methods: ["GET", "POST"], // Specify allowed methods
    credentials: true, // Allow cookies to be sent if needed
  })
);

// Initialize Firebase Admin SDK
// Note: You need to provide your own serviceAccount.json file
// or use environment variables for authentication
admin.initializeApp({
  credential: admin.credential.cert(require("./serviceAccountKey.json")),
});

const db = admin.firestore();

// MQTT Configuration
const mqtt_server = "broker.emqx.io";
const mqtt_port = 1883;
const mqtt_username = "yaseen";
const mqtt_password = "1234";

// Connect to MQTT broker
const mqttClient = mqtt.connect(`mqtt://${mqtt_server}:${mqtt_port}`, {
  username: mqtt_username,
  password: mqtt_password,
});

// MQTT Topics
const CONTROL_TOPIC = "iot/sessions/control";
const DATA_TOPIC = "iot/sessions/data";

// MQTT connection event handlers
mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");

  // Subscribe to data topic for attendance records
  mqttClient.subscribe(DATA_TOPIC, { qos: 1 }, (err) => {
    if (err) {
      console.error("Error subscribing to data topic:", err);
    } else {
      console.log(`Subscribed to ${DATA_TOPIC}`);
    }
  });
});

mqttClient.on("error", (error) => {
  console.error("MQTT connection error:", error);
});

// Process incoming attendance data messages
mqttClient.on("message", async (topic, message) => {
  if (topic === DATA_TOPIC) {
    try {
      const payload = JSON.parse(message.toString());
      console.log("Received attendance data:", payload);

      // Extract and validate required information
      const { sessionId, card, attendance } = payload;

      if (!sessionId || !card || attendance !== true) {
        console.error("Invalid attendance payload:", payload);
        return;
      }

      // Iterate through all courses to find the session
      let foundSession = false;
      const coursesSnapshot = await db.collection("courses").get();

      for (const courseDoc of coursesSnapshot.docs) {
        const courseID = courseDoc.id;
        const sessionDoc = await db
          .collection("courses")
          .doc(courseID)
          .collection("sessions")
          .doc(sessionId)
          .get();

        if (sessionDoc.exists) {
          // Found the session - create attendance record with recordedAt
          await db
            .collection("courses")
            .doc(courseID)
            .collection("sessions")
            .doc(sessionId)
            .collection("attendees")
            .doc(card)
            .set({
              recordedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

          console.log(
            `Attendance recorded for card ${card} in session ${sessionId} (course: ${courseID})`
          );
          foundSession = true;
          break;
        }
      }

      if (!foundSession) {
        console.error(`Session with ID ${sessionId} not found in any course`);
      }
    } catch (error) {
      console.error("Error processing attendance data:", error);
    }
  }
});

// POST /createSession endpoint
app.post("/createSession", async (req, res) => {
  try {
    // Validate request body
    const { batchID, classroomID, courseID, sessionName } = req.body;

    if (!batchID || !classroomID || !courseID || !sessionName) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // Step 1: Get the nodeID from the classroom document
    const classroomDoc = await db
      .collection("classrooms")
      .doc(classroomID)
      .get();

    if (!classroomDoc.exists) {
      return res.status(404).json({ error: "Classroom not found" });
    }

    const nodeID = classroomDoc.data().nodeID;

    if (!nodeID) {
      return res
        .status(500)
        .json({ error: "NodeID not found in classroom document" });
    }

    // Step 2: Get verified students from the batch
    const studentsSnapshot = await db
      .collection("batches")
      .doc(batchID)
      .collection("students")
      .where("verifiedState", "==", true)
      .get();

    if (studentsSnapshot.empty) {
      return res
        .status(404)
        .json({ error: "No verified students found in this batch" });
    }

    // Create a map of UID:MAC pairs for verified students
    const studentData = {};
    studentsSnapshot.forEach((doc) => {
      const uid = doc.id;
      const mac = doc.data().MAC;

      if (mac) {
        studentData[uid] = mac;
      }
    });

    // Step 3: Add a new session document to Firestore first
    const sessionRef = await db
      .collection("courses")
      .doc(courseID)
      .collection("sessions")
      .add({
        title: sessionName,
        active: true,
        courseID: courseID,
        sessionId: null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    const sessionId = sessionRef.id;

    // Update the document to include its own ID for easier lookup
    await sessionRef.update({ sessionId: sessionId });

    // Step 4: Format and publish MQTT message with the sessionId
    const mqttMessage = {
      node: nodeID,
      session: sessionName,
      sessionId: sessionId,
      data: studentData,
      state: true,
    };

    if (!mqttClient.connected) {
      return res.status(500).json({ error: "MQTT broker not connected" });
    }

    mqttClient.publish(
      CONTROL_TOPIC,
      JSON.stringify(mqttMessage),
      { qos: 1 },
      (err) => {
        if (err) {
          console.error("MQTT publish error:", err);
        }
      }
    );

    // Return success response
    return res.status(201).json({
      success: true,
      message: "Session created successfully",
      sessionId: sessionRef.id,
    });
  } catch (error) {
    console.error("Error creating session:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// POST /endSession endpoint
app.post("/endSession", async (req, res) => {
  try {
    // Validate request body
    const { sessionId, nodeID } = req.body;
    if (!sessionId || !nodeID) {
      return res
        .status(400)
        .json({ error: "Missing sessionId or nodeID parameter" });
    }

    // Step 1: Find the session document by iterating through courses
    let foundSession = false;
    let courseID, sessionData;

    const coursesSnapshot = await db.collection("courses").get();
    for (const courseDoc of coursesSnapshot.docs) {
      const sessionDoc = await db
        .collection("courses")
        .doc(courseDoc.id)
        .collection("sessions")
        .doc(sessionId)
        .get();

      if (sessionDoc.exists) {
        courseID = courseDoc.id;
        sessionData = sessionDoc.data();
        foundSession = true;
        break;
      }
    }

    if (!foundSession) {
      return res
        .status(404)
        .json({ error: `Session with ID ${sessionId} not found` });
    }

    const { title, active } = sessionData;

    // Check if session is already inactive
    if (!active) {
      return res.status(400).json({ error: "Session is already inactive" });
    }

    // Step 2: Publish MQTT message to end session
    const mqttMessage = {
      node: nodeID,
      session: title,
      sessionId: sessionId,
      state: false,
    };

    if (!mqttClient.connected) {
      return res.status(500).json({ error: "MQTT broker not connected" });
    }

    mqttClient.publish(
      CONTROL_TOPIC,
      JSON.stringify(mqttMessage),
      { qos: 1 },
      (err) => {
        if (err) {
          console.error("MQTT publish error:", err);
        }
      }
    );

    // Step 3: Update session in Firestore to mark as inactive
    await db
      .collection("courses")
      .doc(courseID)
      .collection("sessions")
      .doc(sessionId)
      .update({
        active: false,
        endedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    return res.status(200).json({
      success: true,
      message: "Session ended successfully",
      sessionId,
    });
  } catch (error) {
    console.error("Error ending session:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
