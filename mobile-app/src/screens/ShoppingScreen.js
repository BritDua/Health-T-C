import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const COLORS = {
  red: '#CE1126',
  green: '#006B3F',
  gold: '#FCD116',
  lightGray: '#F8F9FA',
  white: '#FFFFFF'
};

export default function ShoppingScreen() {
  const [checkedItems, setCheckedItems] = useState({});

  const toggleItem = (item) => {
    setCheckedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const ShoppingItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.shoppingItem}
      onPress={() => toggleItem(item)}
    >
      <View style={[styles.checkbox, checkedItems[item] && styles.checkboxChecked]}>
        {checkedItems[item] && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={[styles.itemText, checkedItems[item] && styles.itemTextChecked]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Week 1 Shopping List</Text>
          <Text style={styles.subtitle}>Estimated: ₵210-310</Text>
        </View>

        <View style={styles.category}>
          <Text style={styles.categoryTitle}>🐟 Proteins</Text>
          <ShoppingItem item="Tilapia fillets (1 lb)" />
          <ShoppingItem item="Chicken breast (1.5 lbs)" />
          <ShoppingItem item="Eggs (1 dozen)" />
          <ShoppingItem item="Black-eyed peas (2 cups)" />
        </View>

        <View style={styles.category}>
          <Text style={styles.categoryTitle}>🥬 Vegetables</Text>
          <ShoppingItem item="Kontomire (2 bunches)" />
          <ShoppingItem item="Spinach (2 bunches)" />
          <ShoppingItem item="Sweet potatoes (3-4 medium)" />
          <ShoppingItem item="Tomatoes (2 lbs)" />
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
  category: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.green,
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gold,
  },
  shoppingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: COLORS.green,
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.green,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemText: {
    fontSize: 16,
    flex: 1,
  },
  itemTextChecked: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
});