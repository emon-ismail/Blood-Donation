import { supabase } from './supabase'

export const requestService = {
  async getAllRequests() {
    const { data, error } = await supabase
      .from('blood_requests')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getRequestStats() {
    const { data, error } = await supabase
      .from('blood_requests')
      .select('status, urgency, created_at')

    if (error) throw error

    const total = data.length
    const active = data.filter(r => r.status === 'active').length
    const urgent = data.filter(r => r.urgency === 'urgent' && r.status === 'active').length

    return { total, active, urgent, todayRequests: 0, fulfilled: 0 }
  }
}