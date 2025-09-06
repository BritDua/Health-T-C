import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const COLORS = {
  red: '#CE1126',
  green: '#006B3F',
  lightGray: '#F8F9FA',
  white: '#FFFFFF'
};

export default function WorkoutsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.workoutCard}>
          <Text style={styles.workoutTitle}>Day 1 - Upper Body Power</Text>
          <Text style={styles.workoutSubtitle}>25 minutes • Foundation Building</Text>
          
          <View style={styles.exerciseList}>
            <View style={styles.exercise}>
              <Text style={styles.exerciseName}>Push-ups</Text>
              <Text style={styles.exerciseReps}>3 × 8-12</Text>
            </View>
            <View style={styles.exercise}>
              <Text style={styles.exerciseName}>Pike Push-ups</Text>
              <Text style={styles.exerciseReps}>3 × 6-10</Text>
            </View>
            <View style={styles.exercise}>
              <Text style={styles.exerciseName}>Plank Hold</Text>
              <Text style={styles.exerciseReps}>3 × 30-45s</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Start Workout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  content: {
    padding: 15,
  },
  workoutCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.red,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.red,
    marginBottom: 5,
  },
  workoutSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  exerciseList: {
    marginBottom: 20,
  },
  exercise: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
  },
  exerciseReps: {
    fontSize: 16,
    color: '#666',
  },
  startButton: {
    backgroundColor: COLORS.red,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
});