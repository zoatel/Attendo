// src/screens/AttendanceDetailsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { db } from '../services/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';

const AttendanceDetailsScreen = ({ route }) => {
  const { courseId, classroomId, studentId } = route.params;
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseDetails, setCourseDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get course details
        const courseRef = doc(db, 'courses', courseId);
        const courseSnap = await getDoc(courseRef);
        if (courseSnap.exists()) {
          setCourseDetails(courseSnap.data());
        }

        // Get attendance sessions for this student in this classroom
        const sessionsQuery = query(
          collection(db, 'batches', '1IHvJu19GCNsUvMKugog', 'attendance'),
          where('classroomId', '==', classroomId),
          where('studentId', '==', studentId)
        );

        const sessionsSnap = await getDocs(sessionsQuery);
        const sessionsData = sessionsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setSessions(sessionsData);
      } catch (error) {
        console.error('Error fetching attendance details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, classroomId, studentId]);

  const renderSessionItem = ({ item }) => (
    <View style={styles.sessionItem}>
      <Text style={styles.sessionDate}>{new Date(item.date?.seconds * 1000).toLocaleDateString()}</Text>
      <Text style={item.present ? styles.present : styles.absent}>
        {item.present ? 'Present' : 'Absent'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {courseDetails && (
        <View style={styles.courseHeader}>
          <Text style={styles.courseTitle}>{courseDetails.title}</Text>
          <Text style={styles.courseCode}>{courseDetails.code}</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Attendance Sessions</Text>
      
      {sessions.length > 0 ? (
        <FlatList
          data={sessions}
          renderItem={renderSessionItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.noSessions}>No attendance records found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  courseHeader: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  courseTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  courseCode: {
    fontSize: 16,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  list: {
    paddingBottom: 20,
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sessionDate: {
    fontSize: 16,
  },
  present: {
    color: 'green',
    fontWeight: 'bold',
  },
  absent: {
    color: 'red',
    fontWeight: 'bold',
  },
  noSessions: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 50,
  },
});

export default AttendanceDetailsScreen;