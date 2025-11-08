// DATABASE DISABLED - Using hardcoded default loads
// import pool from '../../../lib/db';

// Default hardcoded loads with images from public folder
const getDefaultLoads = () => {
  const now = new Date();
  return [
    {
      id: 1,
      imageUrl: JSON.stringify(['/steelcoin.png', '/steelcoil2.png', '/steelcoin3.png']),
      title: 'Steel Coil',
      description: 'Steel Coil Transport\n\nWeight: 25,000 kg (25 tonnes)\nDimensions: 2.5m x 2.5m x 1.8m\n\nSpecial Instructions:\n- Handle with extreme care - heavy load\n- Secure with proper chains and binders\n- Do not stack other items on top\n- Requires flatbed truck with adequate weight capacity\n- Ensure proper weight distribution\n- Check load securement at every stop',
      pickup: 'Berlin, Germany',
      delivery: 'Paris, France',
      pay: '2500.00',
      created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
    },
    {
      id: 2,
      imageUrl: JSON.stringify(['/ferrari.png', '/ferrari2.png', '/ferrari3.png']),
      title: 'Ferrari',
      description: 'Luxury Vehicle Transport - Ferrari\n\nWeight: 1,500 kg\nDimensions: 4.6m x 1.94m x 1.27m (L x W x H)\n\nSpecial Instructions:\n- High-value luxury vehicle - handle with extreme care\n- Use enclosed car carrier or covered trailer\n- No damage tolerance - inspect before and after loading\n- Secure all doors and ensure parking brake is engaged\n- Do not exceed 80 km/h during transport\n- Climate-controlled environment recommended\n- Full insurance coverage required\n- Document vehicle condition with photos before transport',
      pickup: 'Milan, Italy',
      delivery: 'Munich, Germany',
      pay: '5000.00',
      created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    },
    {
      id: 3,
      imageUrl: JSON.stringify(['/woodlogs.png', '/woodlogs2.png', '/woodlogs3.png']),
      title: 'Wood Logs',
      description: 'Wood Logs Transport\n\nWeight: 18,000 kg (18 tonnes)\nDimensions: 6m x 2.4m x 2.5m\n\nSpecial Instructions:\n- Natural wood product - protect from moisture\n- Secure with chains and tarps\n- Check for loose logs before transport\n- Ensure proper stacking to prevent shifting\n- Handle carefully to avoid damage to logs\n- Provide tarpaulin coverage if weather conditions require\n- Verify load securement straps are tight',
      pickup: 'Barcelona, Spain',
      delivery: 'Paris, France',
      pay: '1800.00',
      created_at: now.toISOString() // today
    }
  ];
};

export async function GET() {
  try {
    // Return hardcoded loads instead of database query
    // const [rows] = await pool.query('SELECT * FROM loads');
    const defaultLoads = getDefaultLoads();
    return new Response(JSON.stringify({ loads: defaultLoads }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function POST(request) {
  // DATABASE DISABLED - POST requests not supported without database
  // const data = await request.json();
  // const { imageUrl, title, description, pickup, delivery, pay } = data;
  // try {
  //   const [result] = await pool.query(
  //     'INSERT INTO loads (imageUrl, title, description, pickup, delivery, pay) VALUES (?, ?, ?, ?, ?, ?)',
  //     [imageUrl, title, description, pickup, delivery, pay]
  //   );
  //   return new Response(JSON.stringify({ id: result.insertId }), {
  //     status: 200,
  //     headers: { "Content-Type": "application/json" }
  //   });
  // } catch (error) {
  //   return new Response(JSON.stringify({ error: error.message }), {
  //     status: 500,
  //     headers: { "Content-Type": "application/json" }
  //   });
  // }
  return new Response(JSON.stringify({ error: 'Database disabled - POST not available' }), {
    status: 503,
    headers: { "Content-Type": "application/json" }
  });
}

export async function PUT(request) {
  // DATABASE DISABLED - PUT requests not supported without database
  // try {
  //   const body = await request.json();
  //   const { id, imageUrl, title, description, pickup, delivery, pay } = body;
  //   await pool.query(
  //     'UPDATE loads SET imageUrl = ?, title = ?, description = ?, pickup = ?, delivery = ?, pay = ? WHERE id = ?',
  //     [imageUrl, title, description, pickup, delivery, pay, id]
  //   );
  //   return new Response(JSON.stringify({ message: 'Load updated successfully' }), {
  //     status: 200,
  //     headers: { "Content-Type": "application/json" }
  //   });
  // } catch (err) {
  //   return new Response(JSON.stringify({ error: err.message }), {
  //     status: 500,
  //     headers: { "Content-Type": "application/json" }
  //   });
  // }
  return new Response(JSON.stringify({ error: 'Database disabled - PUT not available' }), {
    status: 503,
    headers: { "Content-Type": "application/json" }
  });
}

export async function DELETE(request) {
  // DATABASE DISABLED - DELETE requests not supported without database
  // try {
  //   const { searchParams } = new URL(request.url);
  //   const id = searchParams.get('id');
  //   if (!id) {
  //     return new Response(JSON.stringify({ error: 'Missing id' }), {
  //       status: 400,
  //       headers: { "Content-Type": "application/json" }
  //     });
  //   }
  //   await pool.query('DELETE FROM loads WHERE id = ?', [id]);
  //   return new Response(JSON.stringify({ message: 'Load deleted successfully' }), {
  //     status: 200,
  //     headers: { "Content-Type": "application/json" }
  //   });
  // } catch (err) {
  //   return new Response(JSON.stringify({ error: err.message }), {
  //     status: 500,
  //     headers: { "Content-Type": "application/json" }
  //   });
  // }
  return new Response(JSON.stringify({ error: 'Database disabled - DELETE not available' }), {
    status: 503,
    headers: { "Content-Type": "application/json" }
  });
}
