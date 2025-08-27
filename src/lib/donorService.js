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

  // Calculate distance between two coordinates
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
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

    // Search by detailed address if provided
    if (filters.searchArea) {
      query = query.or(`detailed_address.ilike.%${filters.searchArea}%,address.ilike.%${filters.searchArea}%,upazila.ilike.%${filters.searchArea}%`)
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    
    let results = data || [];
    
    // Apply distance filter if location and radius are provided
    if (filters.location && filters.location.lat && filters.location.lng && filters.location.radius) {
      results = results.filter(donor => {
        if (!donor.latitude || !donor.longitude) return true; // Include donors without GPS
        const distance = this.calculateDistance(
          filters.location.lat,
          filters.location.lng,
          donor.latitude,
          donor.longitude
        );
        return distance <= filters.location.radius;
      });
    }
    
    console.log('Search results:', results)
    return results
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
        latitude: donorData.latitude || null,
        longitude: donorData.longitude || null,
        detailed_address: donorData.address,
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

  // Get donor by email with impact data
  async getDonorByEmail(email) {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .eq('email', email)
      .maybeSingle()

    if (error) throw error
    
    if (data) {
      // Get impact metrics
      const impact = await this.getDonorImpact(data.id)
      return { ...data, ...impact }
    }
    
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

  // Update donor location
  async updateDonorLocation(donorId, locationData) {
    const { data, error } = await supabase
      .from('donors')
      .update({
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        updated_at: new Date().toISOString()
      })
      .eq('id', donorId)
      .select()

    if (error) throw error
    return data[0]
  },

  // Add donation record
  async addDonation(donorId, donationData) {
    try {
      // Add to donations table
      const { error: donationError } = await supabase
        .from('donations')
        .insert({
          donor_id: donorId,
          donation_date: donationData.date,
          hospital_name: donationData.hospital,
          amount_ml: donationData.amount || 450,
          created_at: new Date().toISOString()
        })

      if (donationError) throw donationError

      // Get current donation count from donations table
      const { data: donationCount } = await supabase
        .from('donations')
        .select('id')
        .eq('donor_id', donorId)

      const totalDonations = donationCount?.length || 0

      // Update donor's total donations count
      const { data, error } = await supabase
        .from('donors')
        .update({
          total_donations: totalDonations,
          last_donation_date: donationData.date,
          last_active: new Date().toISOString()
        })
        .eq('id', donorId)
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error adding donation:', error)
      throw error
    }
  },

  // Update donor rating
  async updateDonorRating(donorId, rating) {
    const { data, error } = await supabase
      .from('donors')
      .update({ rating: rating })
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
  },

  // Add rating for donor
  async addRating(ratingData) {
    try {
      // Add to ratings table
      const { error: ratingError } = await supabase
        .from('ratings')
        .insert({
          donor_id: ratingData.donorId,
          reviewer_id: ratingData.reviewerId,
          reviewer_name: ratingData.reviewerName,
          rating: ratingData.rating,
          comment: ratingData.comment,
          created_at: new Date().toISOString()
        })

      if (ratingError) throw ratingError

      // Calculate new average rating
      const { data: ratings } = await supabase
        .from('ratings')
        .select('rating')
        .eq('donor_id', ratingData.donorId)

      const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length

      // Update donor's rating
      const { error: updateError } = await supabase
        .from('donors')
        .update({ rating: avgRating.toFixed(1) })
        .eq('id', ratingData.donorId)

      if (updateError) throw updateError

      return { success: true, newRating: avgRating.toFixed(1) }
    } catch (error) {
      console.error('Error adding rating:', error)
      throw error
    }
  },

  // Get ratings for donor
  async getDonorRatings(donorId) {
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('donor_id', donorId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Check if user already rated donor
  async hasUserRated(donorId, userId) {
    const { data, error } = await supabase
      .from('ratings')
      .select('id')
      .eq('donor_id', donorId)
      .eq('reviewer_id', userId)
      .maybeSingle()

    if (error) throw error
    return !!data
  },

  // Get donor impact metrics
  async getDonorImpact(donorId) {
    try {
      // Get donor data
      const { data: donor, error: donorError } = await supabase
        .from('donors')
        .select('*')
        .eq('id', donorId)
        .single()

      if (donorError) throw donorError

      // Get donation count from donations table
      const { data: donations, error: donationsError } = await supabase
        .from('donations')
        .select('*')
        .eq('donor_id', donorId)
        .order('donation_date', { ascending: false })

      if (donationsError) throw donationsError

      const totalDonations = donations?.length || donor.total_donations || 0
      const livesSaved = totalDonations * 3 // Each donation can save up to 3 lives
      
      // Calculate next donation eligibility
      const lastDonationDate = donations?.[0]?.donation_date || donor.last_donation_date
      let nextDonationDays = 0
      
      if (lastDonationDate) {
        const lastDate = new Date(lastDonationDate)
        const today = new Date()
        const daysSinceLastDonation = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24))
        nextDonationDays = Math.max(0, 90 - daysSinceLastDonation)
      }

      // Get community ranking in district
      const { data: districtDonors, error: rankError } = await supabase
        .from('donors')
        .select('id, total_donations')
        .eq('district', donor.district)
        .eq('is_verified', true)
        .order('total_donations', { ascending: false })

      if (rankError) throw rankError

      const communityRank = districtDonors.findIndex(d => d.id === donorId) + 1

      return {
        livesSaved,
        totalDonations,
        communityRank: communityRank || 0,
        nextDonationDays,
        lastDonationDate,
        donations: donations || []
      }
    } catch (error) {
      console.error('Error getting donor impact:', error)
      return {
        livesSaved: 0,
        totalDonations: 0,
        communityRank: 0,
        nextDonationDays: 90,
        lastDonationDate: null,
        donations: []
      }
    }
  }
}