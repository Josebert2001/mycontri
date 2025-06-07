import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import Header from '@/components/Header';
import GoalCard from '@/components/GoalCard';
import { useSupabase } from '@/hooks/useSupabase';

export default function GoalsScreen() {
  const router = useRouter();
  const { goals, loading } = useSupabase();
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredGoals = goals.filter(goal => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return goal.saved_amount < goal.target_amount;
    if (activeFilter === 'completed') return goal.saved_amount >= goal.target_amount;
    return true;
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Savings Goals" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading goals...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Savings Goals" />
      
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, activeFilter === 'all' && styles.activeFilter]} 
          onPress={() => setActiveFilter('all')}
        >
          <Text style={[styles.filterText, activeFilter === 'all' && styles.activeFilterText]}>
            All ({goals.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, activeFilter === 'active' && styles.activeFilter]} 
          onPress={() => setActiveFilter('active')}
        >
          <Text style={[styles.filterText, activeFilter === 'active' && styles.activeFilterText]}>
            Active ({goals.filter(g => g.saved_amount < g.target_amount).length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, activeFilter === 'completed' && styles.activeFilter]} 
          onPress={() => setActiveFilter('completed')}
        >
          <Text style={[styles.filterText, activeFilter === 'completed' && styles.activeFilterText]}>
            Completed ({goals.filter(g => g.saved_amount >= g.target_amount).length})
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/goals/new')}
          >
            <Plus size={20} color={Colors.white} />
            <Text style={styles.addButtonText}>Add New Goal</Text>
          </TouchableOpacity>
        </View>
        
        {filteredGoals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {activeFilter === 'all' 
                ? 'No savings goals yet. Create your first goal to start saving!' 
                : activeFilter === 'active'
                  ? 'No active goals. All your goals are completed!'
                  : 'No completed goals yet. Keep saving to reach your targets!'
              }
            </Text>
            {activeFilter === 'all' && (
              <TouchableOpacity 
                style={styles.createFirstButton}
                onPress={() => router.push('/goals/new')}
              >
                <Text style={styles.createFirstButtonText}>Create Your First Goal</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.goalsContainer}>
            {filteredGoals.map((goal) => (
              <GoalCard 
                key={goal.id} 
                goal={{
                  id: goal.id,
                  goalName: goal.name,
                  targetAmount: goal.target_amount,
                  savedAmount: goal.saved_amount,
                  targetDate: new Date(goal.target_date || ''),
                }}
                onPress={() => router.push(`/goals/${goal.id}`)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: Colors.primaryLight,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  activeFilterText: {
    color: Colors.primary,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  actionsContainer: {
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    marginLeft: 8,
  },
  goalsContainer: {
    gap: 16,
  },
  emptyState: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginTop: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  createFirstButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createFirstButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});