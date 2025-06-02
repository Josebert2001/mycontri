import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import ProgressBar from './ProgressBar';
import { formatCurrency } from '@/utils/formatters';
import { GoalType } from '@/types';

type GoalCardProps = {
  goal: GoalType;
  onPress?: () => void;
};

export default function GoalCard({ goal, onPress }: GoalCardProps) {
  const progress = (goal.savedAmount / goal.targetAmount) * 100;
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{goal.goalName}</Text>
        <Text style={styles.amount}>{formatCurrency(goal.savedAmount)} / {formatCurrency(goal.targetAmount)}</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <ProgressBar progress={progress} />
        <Text style={styles.progressText}>{progress.toFixed(0)}%</Text>
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
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.text,
  },
  amount: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary,
    width: 40,
    textAlign: 'right',
  },
});