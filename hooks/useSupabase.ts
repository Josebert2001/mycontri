import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { useAuth } from './useAuth';

type Tables = Database['public']['Tables'];
type Profile = Tables['profiles']['Row'];
type Goal = Tables['goals']['Row'];
type Group = Tables['groups']['Row'];
type GroupMember = Tables['group_members']['Row'];
type Contribution = Tables['contributions']['Row'];

export function useSupabase() {
  const { session } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
      fetchGoals();
      fetchGroups();
    }
  }, [session]);

  async function fetchProfile() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      setError(error.message);
    }
  }

  async function fetchGoals() {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data);
    } catch (error: any) {
      setError(error.message);
    }
  }

  async function fetchGroups() {
    try {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          group_members!inner(*)
        `)
        .eq('group_members.user_id', session?.user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGroups(data);
    } catch (error: any) {
      setError(error.message);
    }
  }

  async function createGoal(goal: Omit<Tables['goals']['Insert'], 'id' | 'user_id'>) {
    try {
      const { data, error } = await supabase
        .from('goals')
        .insert([
          {
            ...goal,
            user_id: session?.user?.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setGoals([data, ...goals]);
      return data;
    } catch (error: any) {
      setError(error.message);
      return null;
    }
  }

  async function createGroup(group: Omit<Tables['groups']['Insert'], 'id'>) {
    try {
      const { data, error } = await supabase
        .from('groups')
        .insert([group])
        .select()
        .single();

      if (error) throw error;

      // Add creator as first member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert([
          {
            group_id: data.id,
            user_id: session?.user?.id,
            payout_order: 1,
          },
        ]);

      if (memberError) throw memberError;

      setGroups([data, ...groups]);
      return data;
    } catch (error: any) {
      setError(error.message);
      return null;
    }
  }

  async function addContribution(contribution: Omit<Tables['contributions']['Insert'], 'id' | 'user_id'>) {
    try {
      const { data, error } = await supabase
        .from('contributions')
        .insert([
          {
            ...contribution,
            user_id: session?.user?.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      
      // Refresh goals to get updated saved_amount
      await fetchGoals();
      return data;
    } catch (error: any) {
      setError(error.message);
      return null;
    }
  }

  return {
    profile,
    goals,
    groups,
    loading,
    error,
    createGoal,
    createGroup,
    addContribution,
    refreshData: async () => {
      await Promise.all([fetchProfile(), fetchGoals(), fetchGroups()]);
    },
  };
}