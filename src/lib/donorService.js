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

  // Get recent donors with pagination
  async getRecentDonors(page = 1, limit = 6) {
    const offset = (page - 1) * limit
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .eq('is_verified', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data || []
  },

  // Search donors by blood group and location
  async searchDonors(filters = {}) {
    console.log('Search filters:', filters)
    
    let query = supabase
      .from('donors')
      .select('*')
      .eq('is_verified', true)

    if (filters.bloodGroup) {
      console.log('Filtering by blood group:', filters.bloodGroup)
      query = query.eq('blood_group', filters.bloodGroup)
    }

    if (filters.district) {
      console.log('Filtering by district:', filters.district)
      query = query.eq('district', filters.district)
    }

    if (filters.upazila) {
      console.log('Filtering by upazila:', filters.upazila)
      query = query.eq('upazila', filters.upazila)
    }

    if (filters.availability && filters.availability !== 'all') {
      console.log('Filtering by availability:', filters.availability)
      query = query.eq('availability', filters.availability)
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    
    console.log('Search results:', data)
    console.log('Sample donor districts:', data?.slice(0, 3)?.map(d => ({ name: d.full_name, district: d.district, upazila: d.upazila })))

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
        is_verified: true,
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
      .maybeSingle()

    if (error) throw error
    return data
  },

  // Get donor by email
  async getDonorByEmail(email) {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .eq('email', email)
      .maybeSingle()

    if (error) throw error
    return data
  },

  // Get donor by email or mobile
  async getDonorByEmailOrMobile(identifier) {
    try {
      console.log('Searching for donor with identifier:', identifier)
      
      // First try to find by email
      const { data: emailData, error: emailError } = await supabase
        .from('donors')
        .select('*')
        .eq('email', identifier)
        .maybeSingle()

      console.log('Email search result:', emailData, 'Error:', emailError)
      
      if (emailData) {
        return emailData
      }

      // If not found by email, try by mobile
      const { data: mobileData, error: mobileError } = await supabase
        .from('donors')
        .select('*')
        .eq('mobile', identifier)
        .maybeSingle()

      console.log('Mobile search result:', mobileData, 'Error:', mobileError)
      
      if (mobileData) {
        return mobileData
      }

      // Let's also try a broader search to see what's in the database
      const { data: allDonors, error: allError } = await supabase
        .from('donors')
        .select('mobile, email, full_name')
        .limit(5)
      
      console.log('Sample donors in database:', allDonors)

      // If neither found, return null
      return null
    } catch (error) {
      console.error('Error in getDonorByEmailOrMobile:', error)
      throw error
    }
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