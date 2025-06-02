export type UserType = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type GoalType = {
  id: string;
  goalName: string;
  targetAmount: number;
  savedAmount: number;
  targetDate: Date;
};

export type GroupMemberType = {
  name: string;
  hasContributed: boolean;
};

export type GroupType = {
  id: string;
  groupName: string;
  cycleAmount: number;
  frequency: string;
  memberLimit: number;
  members: GroupMemberType[];
  nextPayoutDate: Date;
  inviteCode: string;
};

export type ContributionType = {
  goalId: string;
  amount: number;
  date: Date;
};