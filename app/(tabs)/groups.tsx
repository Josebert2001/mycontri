import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, UserPlus } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import Header from '@/components/Header';
import GroupCard from '@/components/GroupCard';
import { useMockData } from '@/hooks/useMockData';

export default function GroupsScreen() {
  const router = useRouter();
  const { groups } = useMockData();

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
              No groups yet. Create a new group or join an existing one!
            </Text>
          </View>
        ) : (
          <View style={styles.groupsContainer}>
            {groups.map((group) => (
              <GroupCard 
                key={group.id} 
                group={group} 
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
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.white,
    marginLeft: 8,
  },
  joinButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
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
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});