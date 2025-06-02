import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function NewGroupScreen() {
  const router = useRouter();
  const [groupName, setGroupName] = useState('');
  const [cycleAmount, setCycleAmount] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [memberLimit, setMemberLimit] = useState('5');
  
  const handleCreateGroup = () => {
    // Validate inputs
    if (!groupName.trim()) {
      alert('Please enter a group name');
      return;
    }
    
    if (!cycleAmount || isNaN(Number(cycleAmount)) || Number(cycleAmount) <= 0) {
      alert('Please enter a valid cycle amount');
      return;
    }
    
    if (!memberLimit || isNaN(Number(memberLimit)) || Number(memberLimit) <= 1) {
      alert('Please enter a valid member limit (at least 2)');
      return;
    }
    
    // In a real app, this would add to the database
    alert('Group created successfully! Share the invite code with others to join.');
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Create New Group',
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
            <Text style={styles.label}>Group Name</Text>
            <TextInput
              style={styles.input}
              value={groupName}
              onChangeText={setGroupName}
              placeholder="E.g., Market Women Savings"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Cycle Amount (₦)</Text>
            <TextInput
              style={styles.input}
              value={cycleAmount}
              onChangeText={setCycleAmount}
              placeholder="E.g., 1000"
              keyboardType="numeric"
              placeholderTextColor={Colors.textSecondary}
            />
            <Text style={styles.helpText}>Amount each member contributes per cycle</Text>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Frequency</Text>
            <View style={styles.frequencyContainer}>
              <TouchableOpacity
                style={[
                  styles.frequencyButton,
                  frequency === 'Daily' && styles.frequencyButtonActive
                ]}
                onPress={() => setFrequency('Daily')}
              >
                <Text style={[
                  styles.frequencyButtonText,
                  frequency === 'Daily' && styles.frequencyButtonTextActive
                ]}>
                  Daily
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.frequencyButton,
                  frequency === 'Weekly' && styles.frequencyButtonActive
                ]}
                onPress={() => setFrequency('Weekly')}
              >
                <Text style={[
                  styles.frequencyButtonText,
                  frequency === 'Weekly' && styles.frequencyButtonTextActive
                ]}>
                  Weekly
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.frequencyButton,
                  frequency === 'Monthly' && styles.frequencyButtonActive
                ]}
                onPress={() => setFrequency('Monthly')}
              >
                <Text style={[
                  styles.frequencyButtonText,
                  frequency === 'Monthly' && styles.frequencyButtonTextActive
                ]}>
                  Monthly
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Member Limit</Text>
            <TextInput
              style={styles.input}
              value={memberLimit}
              onChangeText={setMemberLimit}
              placeholder="E.g., 5"
              keyboardType="numeric"
              placeholderTextColor={Colors.textSecondary}
            />
            <Text style={styles.helpText}>Maximum number of members in this group</Text>
          </View>
          
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateGroup}
          >
            <Text style={styles.createButtonText}>Create Group</Text>
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
  frequencyContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    alignItems: 'center',
  },
  frequencyButtonActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  frequencyButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text,
  },
  frequencyButtonTextActive: {
    color: Colors.primary,
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