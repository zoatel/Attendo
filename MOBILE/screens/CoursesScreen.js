// src/screens/CoursesScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { db } from '../services/firestore';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

const CoursesScreen = ({ route, navigation }) => {
  const { studentId } = route.params;
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // First get the batch ID from the student document
        const studentRef = doc(db, 'batches', '1IHvJu19GCNsUvMKugog', 'students', studentId);
        const studentSnap = await getDoc(studentRef);
        
        if (studentSnap.exists()) {
          const studentData = studentSnap.data();
          const batchId = studentData.batchId; // Assuming this field exists
          
          // Then get all classrooms for this batch
          const classroomsQuery = query(
            collection(db, 'classrooms'),
            where('batchId', '==', batchId)
          );
          
          const classroomsSnap = await getDocs(classroomsQuery);
          const classroomsData = classroomsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          // Then get courses for these classrooms
          const coursesPromises = classroomsData.map(async classroom => {
            const courseRef = doc(db, 'courses', classroom.courseId);
            const courseSnap = await getDoc(courseRef);
            return {
              id: courseSnap.id,
              ...courseSnap.data(),
              classroomId: classroom.id
            };
          });
          
          const coursesData = await Promise.all(coursesPromises);
          setCourses(coursesData);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        Alert.alert('Error', 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [studentId]);

  const renderCourseCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('AttendanceDetails', { 
        courseId: item.id,
        classroomId: item.classroomId,
        studentId 
      })}
    >
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardCode}>{item.code}</Text>
    </TouchableOpacity>
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
      <Text style={styles.title}>Your Courses</Text>
      {courses.length > 0 ? (
        <FlatList
          data={courses}
          renderItem={renderCourseCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.noCourses}>No courses found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardCode: {
    fontSize: 14,
    color: '#666',
  },
  noCourses: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 50,
  },
});

export default CoursesScreen;