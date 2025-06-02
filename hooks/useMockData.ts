import { useState } from 'react';
import { GoalType, GroupType, ContributionType, UserType } from '@/types';

export function useMockData() {
  const [user] = useState<UserType>({
    id: '1',
    name: 'Tunde Okon',
    email: 'tunde@example.com',
    phone: '08123456789',
  });

  const [goals] = useState<GoalType[]>([
    {
      id: '1',
      goalName: 'New Laptop',
      targetAmount: 250000,
      savedAmount: 150000,
      targetDate: new Date('2025-09-15'),
    },
    {
      id: '2',
      goalName: 'School Fees',
      targetAmount: 120000,
      savedAmount: 30000,
      targetDate: new Date('2025-08-30'),
    },
    {
      id: '3',
      goalName: 'Phone Upgrade',
      targetAmount: 80000,
      savedAmount: 80000,
      targetDate: new Date('2025-04-10'),
    },
  ]);

  const [groups] = useState<GroupType[]>([
    {
      id: '1',
      groupName: 'Market Women Savings',
      cycleAmount: 1000,
      frequency: 'Daily',
      memberLimit: 5,
      members: [
        { name: 'Tunde Okon', hasContributed: true },
        { name: 'Ada Nwosu', hasContributed: true },
        { name: 'Blessing Eze', hasContributed: false },
        { name: 'Emeka Obi', hasContributed: true },
      ],
      nextPayoutDate: new Date('2025-06-15'),
      inviteCode: 'MWS123',
    },
    {
      id: '2',
      groupName: 'Family Contri',
      cycleAmount: 5000,
      frequency: 'Weekly',
      memberLimit: 8,
      members: [
        { name: 'Tunde Okon', hasContributed: true },
        { name: 'Chioma Okon', hasContributed: true },
        { name: 'Dayo Okon', hasContributed: false },
      ],
      nextPayoutDate: new Date('2025-06-20'),
      inviteCode: 'FAM456',
    },
  ]);

  const [contributions] = useState<ContributionType[]>([
    {
      goalId: '1',
      amount: 30000,
      date: new Date('2025-05-15'),
    },
    {
      goalId: '1',
      amount: 50000,
      date: new Date('2025-05-08'),
    },
    {
      goalId: '1',
      amount: 70000,
      date: new Date('2025-04-28'),
    },
    {
      goalId: '2',
      amount: 30000,
      date: new Date('2025-05-10'),
    },
  ]);

  const totalSavings = goals.reduce((sum, goal) => sum + goal.savedAmount, 0);

  const getGoalById = (id: string) => {
    return goals.find(goal => goal.id === id);
  };

  const getGroupById = (id: string) => {
    return groups.find(group => group.id === id);
  };

  return {
    user,
    goals,
    groups,
    contributions,
    totalSavings,
    getGoalById,
    getGroupById,
  };
}