// Cloudflare Worker - Save and retrieve video data
// Deploy this as a Worker on Cloudflare

const KV_NAMESPACE = 'VIDEO_DATA'; // Create this KV namespace in Cloudflare

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const method = request.method;
    
    // Handle CORS
    if (method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // GET - Retrieve all videos
    if (method === 'GET') {
      try {
        const data = await env.VIDEO_DATA.get('videos', 'json');
        return new Response(JSON.stringify({ 
          items: data || [] 
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({ 
          error: 'Failed to retrieve data' 
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }

    // PUT - Save all videos
    if (method === 'PUT') {
      try {
        const body = await request.json();
        if (!body.items || !Array.isArray(body.items)) {
          return new Response(JSON.stringify({ 
            error: 'Invalid data format. Expected { items: [...] }' 
          }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }
        
        await env.VIDEO_DATA.put('videos', JSON.stringify(body.items));
        
        return new Response(JSON.stringify({ 
          message: 'Data saved successfully',
          count: body.items.length
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({ 
          error: 'Failed to save data' 
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }

    return new Response(JSON.stringify({ 
      error: 'Method not allowed' 
    }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  },
};
