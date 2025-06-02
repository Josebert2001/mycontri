import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CalendarDays } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { GroupType } from '@/types';

type GroupCardProps = {
  group: GroupType;
  onPress?: () => void;
};

export default function GroupCard({ group, onPress }: GroupCardProps) {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{group.groupName}</Text>
        <View style={styles.cycleBadge}>
          <Text style={styles.cycleText}>{group.frequency}</Text>
        </View>
      </View>
      
      <Text style={styles.amount}>{formatCurrency(group.cycleAmount)} per {group.frequency.toLowerCase()}</Text>
      
      <View style={styles.footer}>
        <View style={styles.infoItem}>
          <CalendarDays size={16} color={Colors.textSecondary} />
          <Text style={styles.infoText}>Next payout: {formatDate(group.nextPayoutDate)}</Text>
        </View>
        
        <Text style={styles.memberCount}>
          {group.members.length}/{group.memberLimit} members
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  cycleBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  cycleText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.primary,
  },
  amount: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  memberCount: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.textSecondary,
  },
});