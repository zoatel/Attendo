import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { db } from "../services/firestore";
import { collection, getDocs, query, where } from "firebase/firestore";

const UIDInputScreen = ({ navigation }) => {
  const [uid, setUid] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheckUID = async () => {
    const cleanUID = uid.trim().toUpperCase();

    if (!cleanUID) {
      Alert.alert("Error", "Please enter your UID");
      return;
    }

    setLoading(true);

    try {
      // Get all batches
      const batchesRef = collection(db, "batches");
      const batchesSnapshot = await getDocs(batchesRef);

      let studentFound = false;
      let studentData = null;
      let batchId = null;

      // Search through each batch
      for (const batchDoc of batchesSnapshot.docs) {
        const studentsRef = collection(db, "batches", batchDoc.id, "students");
        const studentQuery = query(
          studentsRef,
          where("__name__", "==", cleanUID)
        );
        const studentSnapshot = await getDocs(studentQuery);

        if (!studentSnapshot.empty) {
          studentFound = true;
          studentData = studentSnapshot.docs[0].data();
          batchId = batchDoc.id;
          break;
        }
      }

      if (studentFound) {
        navigation.navigate(
          studentData.verifiedState ? "Courses" : "MACAddress",
          {
            studentId: cleanUID,
            batchId: batchId,
          }
        );
      } else {
        Alert.alert("Not Found", `UID ${cleanUID} not found in any batch.`, [
          { text: "OK" },
        ]);
      }
    } catch (error) {
      console.error("Firestore error:", error);
      Alert.alert("Error", "Database connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Your UID</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., F6468E02"
        value={uid}
        onChangeText={setUid}
        autoCapitalize="characters"
        autoCorrect={false}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#FFA500" />
      ) : (
        <Button
          title="Continue"
          onPress={handleCheckUID}
          color="#FFA500"
          disabled={loading}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 18,
  },
});

export default UIDInputScreen;
