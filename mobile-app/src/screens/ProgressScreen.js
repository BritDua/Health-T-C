import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const COLORS = {
  red: '#CE1126',
  green: '#006B3F',
  gold: '#FCD116',
  lightGray: '#F8F9FA',
  white: '#FFFFFF'
};

export default function ProgressScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Progress</Text>
          <Text style={styles.subtitle}>Week 1 of 4</Text>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.cardTitle}>🍽️ Meals Completed</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '85%' }]} />
          </View>
          <Text style={styles.progressText}>18/21 meals this week</Text>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.cardTitle}>💪 Workouts Completed</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '67%' }]} />
          </View>
          <Text style={styles.progressText}>2/3 workouts this week</Text>
        </View>

        <View style={styles.achievementsCard}>
          <Text style={styles.cardTitle}>🏆 Achievements</Text>
          <View style={styles.achievement}>
            <Text style={styles.achievementEarned}>✅ First Week Warrior</Text>
          </View>
          <View style={styles.achievement}>
            <Text style={styles.achievementEarned}>✅ Meal Prep Master</Text>
          </View>
          <View style={styles.achievement}>
            <Text style={styles.achievementLocked}>🔒 Consistency Champion</Text>
          </View>
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
  header: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.red,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  progressCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.red,
    marginBottom: 12,
  },
  progressBar: {
    backgroundColor: COLORS.lightGray,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    backgroundColor: COLORS.green,
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  achievementsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
  },
  achievement: {
    paddingVertical: 8,
  },
  achievementEarned: {
    fontSize: 16,
    color: COLORS.green,
  },
  achievementLocked: {
    fontSize: 16,
    color: '#999',
  },
});