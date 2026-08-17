// Cloudflare Worker - Playlist and Chapter Management
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

    // GET - Retrieve all playlists
    if (method === 'GET') {
      try {
        const data = await env.VIDEO_DATA.get('playlists', 'json');
        return new Response(JSON.stringify({ 
          playlists: data || [] 
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

    // PUT - Save all playlists
    if (method === 'PUT') {
      try {
        const body = await request.json();
        if (!body.playlists || !Array.isArray(body.playlists)) {
          return new Response(JSON.stringify({ 
            error: 'Invalid data format. Expected { playlists: [...] }' 
          }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }
        
        await env.VIDEO_DATA.put('playlists', JSON.stringify(body.playlists));
        
        return new Response(JSON.stringify({ 
          message: 'Data saved successfully',
          count: body.playlists.length
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
