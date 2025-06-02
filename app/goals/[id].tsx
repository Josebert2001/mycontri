import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Plus, CreditCard as Edit2, Trash2 } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import ProgressBar from '@/components/ProgressBar';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useMockData } from '@/hooks/useMockData';

export default function GoalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getGoalById, contributions } = useMockData();
  const goal = getGoalById(id);
  
  const [showAddContribution, setShowAddContribution] = useState(false);
  const [amount, setAmount] = useState('');
  
  if (!goal) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Goal Not Found',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <ChevronLeft size={24} color={Colors.text} />
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Goal not found</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const progress = (goal.savedAmount / goal.targetAmount) * 100;
  const goalContributions = contributions.filter(c => c.goalId === goal.id);
  
  const handleAddContribution = () => {
    if (amount) {
      // In a real app, this would add to the database
      alert(`Added ₦${amount} to your goal!`);
      setAmount('');
      setShowAddContribution(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: goal.goalName,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Edit2 size={20} color={Colors.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Trash2 size={20} color={Colors.error} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalTitle}>{goal.goalName}</Text>
            {goal.targetDate && (
              <Text style={styles.goalDate}>Target: {formatDate(goal.targetDate)}</Text>
            )}
          </View>
          
          <View style={styles.amountsContainer}>
            <View style={styles.amountColumn}>
              <Text style={styles.amountLabel}>Target</Text>
              <Text style={styles.amountValue}>{formatCurrency(goal.targetAmount)}</Text>
            </View>
            <View style={styles.amountColumn}>
              <Text style={styles.amountLabel}>Saved</Text>
              <Text style={styles.amountValue}>{formatCurrency(goal.savedAmount)}</Text>
            </View>
            <View style={styles.amountColumn}>
              <Text style={styles.amountLabel}>Remaining</Text>
              <Text style={styles.amountValue}>{formatCurrency(goal.targetAmount - goal.savedAmount)}</Text>
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <ProgressBar progress={progress} />
            <Text style={styles.progressText}>{progress.toFixed(0)}% Complete</Text>
          </View>
        </View>
        
        {!showAddContribution ? (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddContribution(true)}
          >
            <Plus size={20} color={Colors.white} />
            <Text style={styles.addButtonText}>Add Contribution</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.contributionForm}>
            <Text style={styles.formLabel}>Enter Amount</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount (₦)"
              keyboardType="numeric"
              placeholderTextColor={Colors.textSecondary}
            />
            <View style={styles.formButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setShowAddContribution(false);
                  setAmount('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleAddContribution}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        <View style={styles.contributionsSection}>
          <Text style={styles.sectionTitle}>Contribution History</Text>
          
          {goalContributions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No contributions yet</Text>
            </View>
          ) : (
            <View style={styles.contributionsList}>
              {goalContributions.map((contribution, index) => (
                <View key={index} style={styles.contributionItem}>
                  <View>
                    <Text style={styles.contributionAmount}>
                      {formatCurrency(contribution.amount)}
                    </Text>
                    <Text style={styles.contributionDate}>
                      {formatDate(contribution.date)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
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
    padding: 16,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 16,
  },
  goalCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  goalHeader: {
    marginBottom: 16,
  },
  goalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.text,
    marginBottom: 4,
  },
  goalDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  amountsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  amountColumn: {
    alignItems: 'center',
  },
  amountLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  amountValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.text,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary,
    marginTop: 8,
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  addButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.white,
    marginLeft: 8,
  },
  contributionForm: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  formLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 8,
  },
  amountInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  cancelButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textSecondary,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.white,
  },
  contributionsSection: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
  },
  contributionsList: {
    gap: 12,
  },
  contributionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  contributionAmount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.text,
  },
  contributionDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});