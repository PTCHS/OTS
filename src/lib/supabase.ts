import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pxkimhsxnxvnwozsrque.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4a2ltaHN4bnh2bndvenNycXVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDEwNjMsImV4cCI6MjA3MzM3NzA2M30.atjE5UaaB3g9rN-WGv6FuuIZDR5NXLlS61OMDtM_GEk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  user_id: string
  display_name: string
  password_hash: string
  congregation_id?: string
  is_active: boolean
  role: 'user' | 'admin'
  last_login_at?: string
  created_at: string
  updated_at: string
}

export interface Schedule {
  id: string
  date: string
  time: string
  description: string
  location?: string
  leader?: string
  participants?: number
  registered_users?: string[]
  detail_info?: string
  color?: string
  created_at: string
  created_by?: string
  updated_at: string
  updated_by?: string
}

export interface CongregationRequest {
  id: string
  name: string
  congregation_number: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

export interface PasswordResetRequest {
  id: string
  user_id: string
  status: string
  requested_at: string
  processed_at?: string
  processed_by?: string
}

