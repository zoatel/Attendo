// src/screens/MACAddressScreen.js
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
import { doc, updateDoc } from "firebase/firestore";

const MACAddressScreen = ({ route, navigation }) => {
  const { studentId, batchId } = route.params;
  const [macAddress, setMacAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const validateMACAddress = (mac) => {
    // Allow both colon and hyphen separators
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    return macRegex.test(mac);
  };

  const formatMACAddress = (mac) => {
    // Remove any existing separators and convert to uppercase
    const cleanMac = mac.replace(/[:-]/g, "").toUpperCase();
    // Add colons every 2 characters
    return cleanMac.match(/.{1,2}/g).join(":");
  };

  const handleSubmitMAC = async () => {
    const formattedMAC = formatMACAddress(macAddress);

    if (!validateMACAddress(formattedMAC)) {
      Alert.alert(
        "Invalid MAC Address",
        "Please enter a valid MAC address in the format XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX"
      );
      return;
    }

    setLoading(true);
    try {
      const studentRef = doc(db, "batches", batchId, "students", studentId);
      await updateDoc(studentRef, {
        MAC: formattedMAC,
        verifiedState: true,
        lastVerified: new Date().toISOString(),
      });

      setLoading(false); // Stop loading before showing alert

      // Show success message and then navigate
      Alert.alert(
        "Success",
        "Your device has been verified successfully! You can now access your courses.",
        [
          {
            text: "Go to Courses",
            onPress: () => {
              // Ensure we're not in a loading state when navigating
              setLoading(false);
              navigation.reset({
                index: 0,
                routes: [{ name: "Courses", params: { studentId, batchId } }],
              });
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Error updating MAC address:", error);
      Alert.alert("Error", "Failed to update MAC address. Please try again.");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Device</Text>
      <Text style={styles.subtitle}>
        Please enter your device's MAC address
      </Text>
      <Text style={styles.note}>
        Format: XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX
      </Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 94:35:0A:3B:1D:88"
        value={macAddress}
        onChangeText={setMacAddress}
        autoCapitalize="characters"
        autoCorrect={false}
        maxLength={17} // Maximum length for MAC address with separators
      />
      {loading ? (
        <ActivityIndicator size="large" color="#FFA500" />
      ) : (
        <Button
          title="Verify Device"
          onPress={handleSubmitMAC}
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
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
    color: "#666",
  },
  note: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
    color: "#888",
    fontStyle: "italic",
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 16,
  },
});

export default MACAddressScreen;
