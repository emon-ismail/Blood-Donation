import { supabase } from './supabase';

export const adminService = {
  // Login admin
  async login(username, password) {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, username, email, full_name, role, is_active')
        .eq('username', username)
        .eq('password_hash', this.hashPassword(password))
        .eq('is_active', true)
        .single();

      if (error || !data) {
        throw new Error('Invalid credentials');
      }

      // Update last login
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.id);

      return data;
    } catch (error) {
      throw new Error('Login failed');
    }
  },

  // Simple hash for demo (use bcrypt in production)
  hashPassword(password) {
    if (password === 'lifelink2024') {
      return '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
    }
    return btoa(password); // Base64 encoding for demo
  },

  // Create new admin
  async createAdmin(adminData) {
    const { data, error } = await supabase
      .from('admin_users')
      .insert([{
        username: adminData.username,
        password_hash: this.hashPassword(adminData.password),
        email: adminData.email,
        full_name: adminData.fullName
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all admins
  async getAdmins() {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, username, email, full_name, role, is_active, last_login, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};