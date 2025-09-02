import { supabase } from '../lib/supabase';

class KeepAliveService {
  constructor() {
    this.intervalId = null;
    this.isActive = false;
    // Ping every 6 hours (21600000 ms)
    this.pingInterval = 6 * 60 * 60 * 1000;
  }

  async pingSupabase() {
    try {
      console.log('🔄 Pinging Supabase to keep alive...');
      
      // Simple query to keep connection active
      const { data, error } = await supabase
        .from('donors')
        .select('id')
        .limit(1);

      if (error) {
        console.error('❌ Supabase ping failed:', error);
        return false;
      }

      console.log('✅ Supabase ping successful');
      return true;
    } catch (error) {
      console.error('❌ Keep-alive ping error:', error);
      return false;
    }
  }

  async pingNetlifyFunction() {
    try {
      const response = await fetch('/.netlify/functions/keep-alive');
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Netlify function ping successful');
        return true;
      } else {
        console.error('❌ Netlify function ping failed:', result);
        return false;
      }
    } catch (error) {
      console.error('❌ Netlify function ping error:', error);
      return false;
    }
  }

  start() {
    if (this.isActive) return;

    console.log('🚀 Starting keep-alive service...');
    this.isActive = true;

    // Initial ping
    this.pingSupabase();

    // Set up interval
    this.intervalId = setInterval(async () => {
      await this.pingSupabase();
      await this.pingNetlifyFunction();
    }, this.pingInterval);

    console.log(`⏰ Keep-alive service started (ping every ${this.pingInterval / 1000 / 60 / 60} hours)`);
  }

  stop() {
    if (!this.isActive) return;

    console.log('🛑 Stopping keep-alive service...');
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.isActive = false;
  }

  // Manual ping for testing
  async ping() {
    console.log('🔧 Manual keep-alive ping...');
    const supabaseResult = await this.pingSupabase();
    const netlifyResult = await this.pingNetlifyFunction();
    
    return {
      supabase: supabaseResult,
      netlify: netlifyResult,
      timestamp: new Date().toISOString()
    };
  }
}

// Create singleton instance
export const keepAliveService = new KeepAliveService();

// Auto-start in production
if (process.env.NODE_ENV === 'production') {
  keepAliveService.start();
}

export default keepAliveService;