// src/components/Logo.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Logo = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Attendo</Text>
      <Text style={styles.dot}>.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  dot: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFA500',
  },
});

export default Logo;