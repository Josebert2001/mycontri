import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Copy, CalendarDays, Check, Clock, Settings } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useMockData } from '@/hooks/useMockData';

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getGroupById } = useMockData();
  const group = getGroupById(id);
  
  if (!group) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Group Not Found',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <ChevronLeft size={24} color={Colors.text} />
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Group not found</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const copyInviteCode = () => {
    // In a real app, this would copy to clipboard
    alert(`Invite code ${group.inviteCode} copied to clipboard!`);
  };
  
  const markContribution = () => {
    // In a real app, this would update the database
    alert('Contribution marked as complete!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: group.groupName,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity>
              <Settings size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.groupCard}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupTitle}>{group.groupName}</Text>
            <Text style={styles.groupDetails}>
              {formatCurrency(group.cycleAmount)} • {group.frequency}
            </Text>
          </View>
          
          <View style={styles.inviteSection}>
            <Text style={styles.inviteLabel}>Invite Code:</Text>
            <View style={styles.inviteCodeContainer}>
              <Text style={styles.inviteCode}>{group.inviteCode}</Text>
              <TouchableOpacity onPress={copyInviteCode}>
                <Copy size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <CalendarDays size={20} color={Colors.text} />
              <Text style={styles.infoText}>Next Payout: {formatDate(group.nextPayoutDate)}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Clock size={20} color={Colors.text} />
              <Text style={styles.infoText}>
                {group.members.length} of {group.memberLimit} members
              </Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.contributeButton}
          onPress={markContribution}
        >
          <Check size={20} color={Colors.white} />
          <Text style={styles.contributeButtonText}>Mark My Contribution as Complete</Text>
        </TouchableOpacity>
        
        <View style={styles.membersSection}>
          <Text style={styles.sectionTitle}>Members</Text>
          
          <View style={styles.membersList}>
            {group.members.map((member, index) => (
              <View key={index} style={styles.memberItem}>
                <Text style={styles.memberName}>{member.name}</Text>
                {member.hasContributed ? (
                  <View style={styles.contributedBadge}>
                    <Text style={styles.contributedText}>Paid</Text>
                  </View>
                ) : (
                  <View style={styles.pendingBadge}>
                    <Text style={styles.pendingText}>Pending</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.scheduleSection}>
          <Text style={styles.sectionTitle}>Payout Schedule</Text>
          
          <View style={styles.scheduleList}>
            {group.members.map((member, index) => (
              <View key={index} style={styles.scheduleItem}>
                <Text style={styles.scheduleTurn}>Turn {index + 1}</Text>
                <Text style={styles.scheduleName}>{member.name}</Text>
                <Text style={styles.scheduleDate}>
                  {formatDate(new Date(new Date().setDate(new Date().getDate() + index * 7)))}
                </Text>
              </View>
            ))}
          </View>
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
  groupCard: {
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
  groupHeader: {
    marginBottom: 16,
  },
  groupTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.text,
    marginBottom: 4,
  },
  groupDetails: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  inviteSection: {
    marginBottom: 16,
  },
  inviteLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  inviteCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  inviteCode: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.text,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
  },
  contributeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  contributeButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.white,
    marginLeft: 8,
  },
  membersSection: {
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
  membersList: {
    gap: 12,
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  memberName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text,
  },
  contributedBadge: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  contributedText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.success,
  },
  pendingBadge: {
    backgroundColor: Colors.warningLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  pendingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.warning,
  },
  scheduleSection: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  scheduleList: {
    gap: 12,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  scheduleTurn: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: Colors.primary,
    width: 60,
  },
  scheduleName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  scheduleDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
});