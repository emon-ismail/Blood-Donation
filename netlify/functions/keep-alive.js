const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  try {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    );

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