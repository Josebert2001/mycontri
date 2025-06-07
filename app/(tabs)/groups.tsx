import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, UserPlus } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import Header from '@/components/Header';
import GroupCard from '@/components/GroupCard';
import { useSupabase } from '@/hooks/useSupabase';

export default function GroupsScreen() {
  const router = useRouter();
  const { groups, loading } = useSupabase();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Contribution Groups" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading groups...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Contribution Groups" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => router.push('/groups/new')}
          >
            <Plus size={20} color={Colors.white} />
            <Text style={styles.buttonText}>Create Group</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.joinButton}
            onPress={() => router.push('/groups/join')}
          >
            <UserPlus size={20} color={Colors.primary} />
            <Text style={styles.joinButtonText}>Join Group</Text>
          </TouchableOpacity>
        </View>
        
        {groups.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No groups yet. Create a new group or join an existing one to start contributing together!
            </Text>
            <View style={styles.emptyActions}>
              <TouchableOpacity 
                style={styles.createFirstButton}
                onPress={() => router.push('/groups/new')}
              >
                <Text style={styles.createFirstButtonText}>Create Your First Group</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.groupsContainer}>
            {groups.map((group) => (
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
  scrollView: {
    flex: 1,
    padding: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  createButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
  },
  joinButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    marginLeft: 8,
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 8,
  },
  groupsContainer: {
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
  emptyActions: {
    alignItems: 'center',
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