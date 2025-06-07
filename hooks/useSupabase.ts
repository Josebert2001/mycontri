import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { useAuth } from './useAuth';

type Tables = Database['public']['Tables'];
type Profile = Tables['profiles']['Row'];
type Goal = Tables['goals']['Row'];
type Group = Tables['groups']['Row'];

export function useSupabase() {
  const { session } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetchData();
    } else {
      // Reset data when user logs out
      setProfile(null);
      setGoals([]);
      setGroups([]);
      setLoading(false);
    }
  }, [session]);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);
      
      await Promise.all([
        fetchProfile(),
        fetchGoals(),
        fetchGroups(),
      ]);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProfile() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session?.user?.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }
    
    setProfile(data);
  }

  async function fetchGoals() {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', session?.user?.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    setGoals(data || []);
  }

  async function fetchGroups() {
    const { data, error } = await supabase
      .from('groups')
      .select(`
        *,
        group_members!inner(*)
      `)
      .eq('group_members.user_id', session?.user?.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    setGroups(data || []);
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
    refreshData: fetchData,
  };
}