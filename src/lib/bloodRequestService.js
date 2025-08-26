import { supabase } from './supabase'

export const bloodRequestService = {
  // Get all active blood requests with pagination
  async getActiveRequests(filters = {}, page = 1, limit = 10) {
    // First get count for pagination
    let countQuery = supabase
      .from('blood_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    // Apply same filters to count query
    if (filters.bloodGroups?.length > 0) {
      countQuery = countQuery.in('blood_group', filters.bloodGroups)
    }
    if (filters.urgencyLevels?.length > 0) {
      countQuery = countQuery.in('urgency_level', filters.urgencyLevels)
    }
    if (filters.locations?.length > 0) {
      const conditions = filters.locations.map(loc => 
        `location.ilike.%${loc}%,district.ilike.%${loc}%`
      ).join(',')
      countQuery = countQuery.or(conditions)
    }
    if (filters.verifiedOnly) {
      countQuery = countQuery.eq('verified', true)
    }
    if (filters.unitsNeeded) {
      switch (filters.unitsNeeded) {
        case '1':
          countQuery = countQuery.eq('units_needed', 1)
          break
        case '2-3':
          countQuery = countQuery.gte('units_needed', 2).lte('units_needed', 3)
          break
        case '4+':
          countQuery = countQuery.gte('units_needed', 4)
          break
      }
    }
    if (filters.timeRange) {
      const now = new Date()
      let endTime
      switch (filters.timeRange) {
        case '24h':
          endTime = new Date(now.getTime() + 24 * 60 * 60 * 1000)
          break
        case '48h':
          endTime = new Date(now.getTime() + 48 * 60 * 60 * 1000)
          break
        case '1w':
          endTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
          break
      }
      if (endTime) {
        countQuery = countQuery.lte('required_by', endTime.toISOString())
      }
    }

    const { count } = await countQuery

    // Now get actual data with pagination
    let query = supabase
      .from('blood_requests')
      .select('*')
      .eq('status', 'active')

    // Apply filters
    if (filters.bloodGroups?.length > 0) {
      query = query.in('blood_group', filters.bloodGroups)
    }

    if (filters.urgencyLevels?.length > 0) {
      query = query.in('urgency_level', filters.urgencyLevels)
    }

    if (filters.locations?.length > 0) {
      // Search in both location and district fields
      const conditions = filters.locations.map(loc => 
        `location.ilike.%${loc}%,district.ilike.%${loc}%`
      ).join(',')
      query = query.or(conditions)
    }

    if (filters.verifiedOnly) {
      query = query.eq('verified', true)
    }

    if (filters.unitsNeeded) {
      switch (filters.unitsNeeded) {
        case '1':
          query = query.eq('units_needed', 1)
          break
        case '2-3':
          query = query.gte('units_needed', 2).lte('units_needed', 3)
          break
        case '4+':
          query = query.gte('units_needed', 4)
          break
      }
    }

    if (filters.timeRange) {
      const now = new Date()
      let endTime
      
      switch (filters.timeRange) {
        case '24h':
          endTime = new Date(now.getTime() + 24 * 60 * 60 * 1000)
          break
        case '48h':
          endTime = new Date(now.getTime() + 48 * 60 * 60 * 1000)
          break
        case '1w':
          endTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
          break
      }
      
      if (endTime) {
        query = query.lte('required_by', endTime.toISOString())
      }
    }

    const { data, error } = await query
      .order('urgency_level')
      .order('required_by')
      .range((page - 1) * limit, (page * limit) - 1)

    if (error) throw error
    return { data: data || [], count: count || 0 }
  },

  // Create new blood request
  async createRequest(requestData) {
    // Extract district from location (e.g., "ধানমন্ডি, ঢাকা" -> "ঢাকা")
    const extractDistrict = (location) => {
      const districts = ['ঢাকা', 'চট্টগ্রাম', 'সিলেট', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'রংপুর', 'ময়মনসিংহ'];
      const foundDistrict = districts.find(district => location.includes(district));
      return foundDistrict || location.split(',').pop()?.trim() || location;
    };

    const transformedData = {
      patient_name: requestData.patientName,
      blood_group: requestData.bloodGroup,
      units_needed: parseInt(requestData.unitsNeeded),
      hospital: requestData.hospital,
      location: requestData.location,
      district: extractDistrict(requestData.location),
      contact_person: requestData.contactPerson,
      contact_phone: requestData.contactPhone,
      urgency_level: requestData.urgencyLevel,
      required_by: new Date(requestData.requiredBy).toISOString(),
      additional_info: requestData.additionalInfo || null
    }

    const { data, error } = await supabase
      .from('blood_requests')
      .insert([transformedData])
      .select()

    if (error) throw error
    return data[0]
  },

  // Get request statistics
  async getRequestStats() {
    const { data, error } = await supabase
      .from('blood_requests')
      .select('id, status, urgency_level, created_at')

    if (error) throw error

    const total = data.length
    const active = data.filter(r => r.status === 'active').length
    const emergency = data.filter(r => r.urgency_level === 'emergency').length
    const fulfilled = data.filter(r => r.status === 'fulfilled').length

    return { total, active, emergency, fulfilled }
  },

  // Cancel blood request
  async cancelRequest(requestId) {
    console.log('Deleting request with ID:', requestId);
    
    // First check if record exists
    const { data: existingData, error: checkError } = await supabase
      .from('blood_requests')
      .select('id')
      .eq('id', requestId)
    
    console.log('Record exists check:', { existingData, checkError });
    
    if (!existingData || existingData.length === 0) {
      throw new Error('Record not found in database');
    }
    
    const { data, error } = await supabase
      .from('blood_requests')
      .delete()
      .eq('id', requestId)
      .select()

    console.log('Delete result:', { data, error });
    if (error) {
      console.error('Delete error:', error);
      throw error;
    }
    return data;
  }
}

export const donationService = {
  // Get donor's donation history
  async getDonorHistory(donorId) {
    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        blood_requests (
          patient_name,
          hospital,
          blood_group
        )
      `)
      .eq('donor_id', donorId)
      .order('donation_date', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Record new donation
  async recordDonation(donationData) {
    const { data, error } = await supabase
      .from('donations')
      .insert([donationData])
      .select()

    if (error) throw error
    return data[0]
  },

  // Get donation statistics
  async getDonationStats() {
    const { data, error } = await supabase
      .from('donations')
      .select('id, donation_date, amount_ml')

    if (error) throw error

    const total = data.length
    const totalAmount = data.reduce((sum, d) => sum + (d.amount_ml || 450), 0)
    const today = new Date().toDateString()
    const todayDonations = data.filter(d => 
      new Date(d.donation_date).toDateString() === today
    ).length

    return { total, totalAmount, todayDonations }
  }
}

export const successStoryService = {
  // Get success stories
  async getSuccessStories(limit = 10) {
    const { data, error } = await supabase
      .from('success_stories')
      .select('*')
      .order('completed_date', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  },

  // Add success story
  async addSuccessStory(storyData) {
    const { data, error } = await supabase
      .from('success_stories')
      .insert([storyData])
      .select()

    if (error) throw error
    return data[0]
  }
}