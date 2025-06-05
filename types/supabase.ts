export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          name: string
          target_amount: number
          saved_amount: number
          target_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          target_amount: number
          saved_amount?: number
          target_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          target_amount?: number
          saved_amount?: number
          target_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      groups: {
        Row: {
          id: string
          name: string
          cycle_amount: number
          frequency: string
          member_limit: number
          invite_code: string
          next_payout_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          cycle_amount: number
          frequency: string
          member_limit: number
          invite_code: string
          next_payout_date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          cycle_amount?: number
          frequency?: string
          member_limit?: number
          invite_code?: string
          next_payout_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      group_members: {
        Row: {
          group_id: string
          user_id: string
          has_contributed: boolean
          payout_order: number
          created_at: string
        }
        Insert: {
          group_id: string
          user_id: string
          has_contributed?: boolean
          payout_order: number
          created_at?: string
        }
        Update: {
          group_id?: string
          user_id?: string
          has_contributed?: boolean
          payout_order?: number
          created_at?: string
        }
      }
      contributions: {
        Row: {
          id: string
          user_id: string
          goal_id: string
          amount: number
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          goal_id: string
          amount: number
          date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          goal_id?: string
          amount?: number
          date?: string
          created_at?: string
        }
      }
    }
  }
}