import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import Header from '@/components/Header';
import GoalCard from '@/components/GoalCard';
import GroupCard from '@/components/GroupCard';
import { useSupabase } from '@/hooks/useSupabase';

export default function HomeScreen() {
  const router = useRouter();
  const { profile, goals, groups, loading, error } = useSupabase();
  const totalSavings = goals.reduce((sum, goal) => sum + goal.saved_amount, 0);

  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="MyContri" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="MyContri" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title={`Welcome, ${profile?.name?.split(' ')[0] || 'User'}!`} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Savings</Text>
          <Text style={styles.summaryAmount}>{formatCurrency(totalSavings)}</Text>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Savings Goals</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push('/goals/new')}
            >
              <Plus size={20} color={Colors.white} />
              <Text style={styles.addButtonText}>Add Goal</Text>
            </TouchableOpacity>
          </View>
          
          {goals.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No savings goals yet. Create your first goal to start saving!</Text>
              <TouchableOpacity 
                style={styles.createFirstButton}
                onPress={() => router.push('/goals/new')}
              >
                <Text style={styles.createFirstButtonText}>Create Your First Goal</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.cardContainer}>
              {goals.slice(0, 2).map((goal) => (
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
              {goals.length > 2 && (
                <TouchableOpacity 
                  style={styles.viewAllButton}
                  onPress={() => router.push('/goals')}
                >
                  <Text style={styles.viewAllText}>View All Goals ({goals.length})</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Contribution Groups</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push('/groups/new')}
            >
              <Plus size={20} color={Colors.white} />
              <Text style={styles.addButtonText}>Create</Text>
            </TouchableOpacity>
          </View>
          
          {groups.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No groups yet. Create or join a group to start contributing together!</Text>
              <View style={styles.groupActions}>
                <TouchableOpacity 
                  style={styles.createFirstButton}
                  onPress={() => router.push('/groups/new')}
                >
                  <Text style={styles.createFirstButtonText}>Create a Group</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.joinButton}
                  onPress={() => router.push('/groups/join')}
                >
                  <Text style={styles.joinButtonText}>Join a Group</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.cardContainer}>
              {groups.slice(0, 2).map((group) => (
                <GroupCard 
                  key={group.id} 
                  group={{
                    id: group.id,
                    groupName: group.name,
                    cycleAmount: group.cycle_amount,
                    frequency: group.frequency,
                    memberLimit: group.member_limit,
                    members: [],
                    nextPayoutDate: new Date(group.next_payout_date),
                    inviteCode: group.invite_code,
                  }}
                  onPress={() => router.push(`/groups/${group.id}`)}
                />
              ))}
              {groups.length > 2 && (
                <TouchableOpacity 
                  style={styles.viewAllButton}
                  onPress={() => router.push('/groups')}
                >
                  <Text style={styles.viewAllText}>View All Groups ({groups.length})</Text>
                </TouchableOpacity>
              )}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.error,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.white,
    opacity: 0.9,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.white,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
    marginLeft: 4,
  },
  cardContainer: {
    gap: 12,
  },
  emptyState: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
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
  groupActions: {
    flexDirection: 'row',
    gap: 12,
  },
  joinButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  viewAllButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
});