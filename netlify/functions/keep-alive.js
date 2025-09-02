const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          success: false, 
          error: 'Supabase environment variables not configured',
          timestamp: new Date().toISOString()
        })
      };
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Simple ping query to keep database active
    const { data, error } = await supabase
      .from('donors')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Supabase ping error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          success: false, 
          error: error.message,
          timestamp: new Date().toISOString()
        })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Supabase keep-alive ping successful',
        timestamp: new Date().toISOString(),
        recordCount: data?.length || 0
      })
    };

  } catch (error) {
    console.error('Keep-alive function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};