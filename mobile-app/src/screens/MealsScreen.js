import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal
} from 'react-native';

const COLORS = {
  red: '#CE1126',
  gold: '#FCD116',
  green: '#006B3F',
  darkGray: '#212529',
  lightGray: '#F8F9FA',
  white: '#FFFFFF'
};

const mealData = {
  1: {
    breakfast: {
      name: "Kontomire & Egg Scramble",
      time: "15 mins",
      calories: 320,
      protein: "22g",
      ingredients: ["2 cups kontomire", "2 eggs", "1 tomato", "1 onion"]
    },
    lunch: {
      name: "Grilled Tilapia with Sweet Potato",
      time: "25 mins",
      calories: 450,
      protein: "35g",
      ingredients: ["6 oz tilapia fillet", "1 sweet potato", "2 cups spinach"]
    },
    snack: {
      name: "Tiger Nut & Coconut Mix",
      time: "5 mins",
      calories: 180,
      protein: "6g",
      ingredients: ["1/4 cup tiger nuts", "2 tbsp coconut flakes"]
    }
  }
};

export default function MealsScreen() {
  const [selectedDay, setSelectedDay] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const days = [1, 2, 3];

  const showRecipe = (mealType) => {
    setSelectedMeal(mealData[selectedDay][mealType]);
    setModalVisible(true);
  };

  const MealCard = ({ meal, mealType, emoji }) => (
    <View style={styles.mealCard}>
      <View style={styles.mealHeader}>
        <Text style={styles.mealTitle}>{emoji} {mealType}</Text>
        <Text style={styles.mealTime}>{meal.time}</Text>
      </View>
      <Text style={styles.mealName}>{meal.name}</Text>
      <View style={styles.mealStats}>
        <Text style={styles.statText}>{meal.calories} cal</Text>
        <Text style={styles.statText}>{meal.protein} protein</Text>
      </View>
      <TouchableOpacity 
        style={styles.recipeButton}
        onPress={() => showRecipe(mealType)}
      >
        <Text style={styles.recipeButtonText}>View Recipe</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelector}>
        {days.map(day => (
          <TouchableOpacity
            key={day}
            style={[styles.dayButton, selectedDay === day && styles.dayButtonActive]}
            onPress={() => setSelectedDay(day)}
          >
            <Text style={[styles.dayButtonText, selectedDay === day && styles.dayButtonTextActive]}>
              Day {day}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.mealsContainer}>
        {mealData[selectedDay] && (
          <>
            <MealCard meal={mealData[selectedDay].breakfast} mealType="Breakfast" emoji="🌅" />
            <MealCard meal={mealData[selectedDay].lunch} mealType="Lunch" emoji="🍽️" />
            <MealCard meal={mealData[selectedDay].snack} mealType="Snack" emoji="🥜" />
          </>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            
            {selectedMeal && (
              <>
                <Text style={styles.modalTitle}>{selectedMeal.name}</Text>
                <Text style={styles.modalStats}>
                  ⏱️ {selectedMeal.time} • 🔥 {selectedMeal.calories} cal
                </Text>
                
                <Text style={styles.sectionTitle}>🛒 Ingredients</Text>
                {selectedMeal.ingredients.map((ingredient, index) => (
                  <Text key={index} style={styles.ingredientText}>• {ingredient}</Text>
                ))}
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  daySelector: {
    backgroundColor: COLORS.white,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  dayButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.green,
    backgroundColor: COLORS.white,
  },
  dayButtonActive: {
    backgroundColor: COLORS.green,
  },
  dayButtonText: {
    color: COLORS.green,
    fontWeight: '600',
  },
  dayButtonTextActive: {
    color: COLORS.white,
  },
  mealsContainer: {
    flex: 1,
    padding: 15,
  },
  mealCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.gold,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.red,
  },
  mealTime: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  mealStats: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statText: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    marginRight: 8,
  },
  recipeButton: {
    backgroundColor: COLORS.green,
    paddingVertical: 10,
    borderRadius: 8,
  },
  recipeButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.red,
    marginBottom: 10,
    marginTop: 10,
  },
  modalStats: {
    fontSize: 14,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.green,
    marginBottom: 10,
  },
  ingredientText: {
    fontSize: 14,
    marginBottom: 5,
  },
});