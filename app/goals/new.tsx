import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function NewGoalScreen() {
  const router = useRouter();
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  
  const handleCreateGoal = () => {
    // Validate inputs
    if (!goalName.trim()) {
      alert('Please enter a goal name');
      return;
    }
    
    if (!targetAmount || isNaN(Number(targetAmount)) || Number(targetAmount) <= 0) {
      alert('Please enter a valid target amount');
      return;
    }
    
    // In a real app, this would add to the database
    alert('Goal created successfully!');
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Create New Goal',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Goal Name</Text>
            <TextInput
              style={styles.input}
              value={goalName}
              onChangeText={setGoalName}
              placeholder="E.g., New Phone, School Fees"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Target Amount (₦)</Text>
            <TextInput
              style={styles.input}
              value={targetAmount}
              onChangeText={setTargetAmount}
              placeholder="E.g., 50000"
              keyboardType="numeric"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Target Date (Optional)</Text>
            <TextInput
              style={styles.input}
              value={targetDate}
              onChangeText={setTargetDate}
              placeholder="DD/MM/YYYY"
              placeholderTextColor={Colors.textSecondary}
            />
            <Text style={styles.helpText}>When do you want to reach this goal?</Text>
          </View>
          
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateGoal}
          >
            <Text style={styles.createButtonText}>Create Goal</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: Colors.white,
  },
  helpText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  createButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  createButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.white,
  },
});