import { supabase } from './supabase'

export const donorService = {
  // Get all donors
  async getAllDonors() {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .eq('is_verified', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Search donors by blood group and location
  async searchDonors(filters = {}) {
    let query = supabase
      .from('donors')
      .select('*')
      .eq('is_verified', true)

    if (filters.bloodGroup) {
      query = query.eq('blood_group', filters.bloodGroup)
    }

    if (filters.district) {
      query = query.eq('district', filters.district)
    }

    if (filters.availability) {
      query = query.eq('availability', filters.availability)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Create new donor
  async createDonor(donorData) {
    const { data, error } = await supabase
      .from('donors')
      .insert([{
        full_name: donorData.fullName,
        age: parseInt(donorData.age),
        gender: donorData.gender,
        district: donorData.district,
        upazila: donorData.upazila,
        address: donorData.address,
        blood_group: donorData.bloodGroup,
        availability: donorData.availability,
        mobile: donorData.mobile,
        email: donorData.email,
        emergency_contact: donorData.emergencyContact,
        sms_notifications: donorData.smsNotifications,
        phone_calls_allowed: donorData.phoneCallsAllowed,
        whatsapp_allowed: donorData.whatsappAllowed,
        emergency_contact_allowed: donorData.emergencyContactAllowed,
        is_verified: false,
        created_at: new Date().toISOString()
      }])
      .select()

    if (error) throw error
    return data[0]
  },

  // Get donor by mobile
  async getDonorByMobile(mobile) {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .eq('mobile', mobile)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  // Update donor verification status
  async verifyDonor(donorId) {
    const { data, error } = await supabase
      .from('donors')
      .update({ is_verified: true, verified_at: new Date().toISOString() })
      .eq('id', donorId)
      .select()

    if (error) throw error
    return data[0]
  },

  // Get donor statistics
  async getDonorStats() {
    const { data, error } = await supabase
      .from('donors')
      .select('id, is_verified, availability, created_at')

    if (error) throw error

    const total = data.length
    const verified = data.filter(d => d.is_verified).length
    const available = data.filter(d => d.availability === 'available').length
    const today = new Date().toDateString()
    const todayRegistrations = data.filter(d => 
      new Date(d.created_at).toDateString() === today
    ).length

    return {
      total,
      verified,
      available,
      todayRegistrations,
      pending: total - verified
    }
  }
}