import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import Header from '@/components/Header';
import GoalCard from '@/components/GoalCard';
import { useMockData } from '@/hooks/useMockData';

export default function GoalsScreen() {
  const router = useRouter();
  const { goals } = useMockData();
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredGoals = goals.filter(goal => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return goal.savedAmount < goal.targetAmount;
    if (activeFilter === 'completed') return goal.savedAmount >= goal.targetAmount;
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Savings Goals" />
      
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, activeFilter === 'all' && styles.activeFilter]} 
          onPress={() => setActiveFilter('all')}
        >
          <Text style={[styles.filterText, activeFilter === 'all' && styles.activeFilterText]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, activeFilter === 'active' && styles.activeFilter]} 
          onPress={() => setActiveFilter('active')}
        >
          <Text style={[styles.filterText, activeFilter === 'active' && styles.activeFilterText]}>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, activeFilter === 'completed' && styles.activeFilter]} 
          onPress={() => setActiveFilter('completed')}
        >
          <Text style={[styles.filterText, activeFilter === 'completed' && styles.activeFilterText]}>
            Completed
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
                ? 'No savings goals yet. Add your first goal!' 
                : activeFilter === 'active'
                  ? 'No active goals. Add a new goal to start saving!'
                  : 'No completed goals yet. Keep saving!'
              }
            </Text>
          </View>
        ) : (
          <View style={styles.goalsContainer}>
            {filteredGoals.map((goal) => (
              <GoalCard 
                key={goal.id} 
                goal={goal} 
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
    fontFamily: 'Inter-Medium',
    fontSize: 14,
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
    fontFamily: 'Inter-Medium',
    fontSize: 16,
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
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});