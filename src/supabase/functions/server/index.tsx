import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

// Initialize sample data on startup
async function initializeData() {
  console.log('Initializing sample data...');
  
  // Check if data already exists
  const existingProducts = await kv.get('products_initialized');
  if (existingProducts) {
    console.log('Data already initialized');
    return;
  }

  // Product master data with 20+ products across 5 categories
  const products = [
    // Home & Kitchen
    {
      id: 'prod_001',
      name: 'Rice Cooker',
      category: 'home-kitchen',
      specs: [
        { key: 'brand', label: 'Brand', type: 'text' },
        { key: 'capacity', label: 'Capacity', type: 'select', options: ['1L', '1.8L', '2.2L'] },
        { key: 'color', label: 'Color', type: 'color' },
      ],
    },
    {
      id: 'prod_002',
      name: 'Mixer Grinder',
      category: 'home-kitchen',
      specs: [
        { key: 'brand', label: 'Brand', type: 'text' },
        { key: 'wattage', label: 'Wattage', type: 'select', options: ['500W', '750W', '1000W'] },
        { key: 'jars', label: 'Number of Jars', type: 'select', options: ['2', '3', '4'] },
        { key: 'color', label: 'Color', type: 'color' },
      ],
    },
    {
      id: 'prod_003',
      name: 'Pressure Cooker',
      category: 'home-kitchen',
      specs: [
        { key: 'brand', label: 'Brand', type: 'text' },
        { key: 'capacity', label: 'Capacity', type: 'select', options: ['3L', '5L', '7L'] },
        { key: 'material', label: 'Material', type: 'select', options: ['Aluminum', 'Stainless Steel'] },
      ],
    },
    {
      id: 'prod_004',
      name: 'Induction Cooktop',
      category: 'home-kitchen',
      specs: [
        { key: 'brand', label: 'Brand', type: 'text' },
        { key: 'wattage', label: 'Wattage', type: 'select', options: ['1200W', '1800W', '2000W'] },
        { key: 'burners', label: 'Burners', type: 'select', options: ['1', '2'] },
        { key: 'color', label: 'Color', type: 'color' },
      ],
    },
    {
      id: 'prod_005',
      name: 'Electric Kettle',
      category: 'home-kitchen',
      specs: [
        { key: 'brand', label: 'Brand', type: 'text' },
        { key: 'capacity', label: 'Capacity', type: 'select', options: ['1L', '1.5L', '2L'] },
        { key: 'color', label: 'Color', type: 'color' },
      ],
    },

    // Hardware & Tools
    {
      id: 'prod_006',
      name: 'Angle Grinder',
      category: 'hardware-tools',
      specs: [
        { key: 'brand', label: 'Brand', type: 'text' },
        { key: 'wattage', label: 'Wattage', type: 'select', options: ['850W', '1050W', '1400W'] },
        { key: 'rpm', label: 'RPM', type: 'select', options: ['10000', '11000', '12000'] },
        { key: 'disc_size', label: 'Disc Size', type: 'select', options: ['4 inch', '5 inch', '6 inch'] },
      ],
    },
    {
      id: 'prod_007',
      name: 'Drill Machine',
      category: 'hardware-tools',
      specs: [
        { key: 'brand', label: 'Brand', type: 'text' },
        { key: 'wattage', label: 'Wattage', type: 'select', options: ['500W', '650W', '850W'] },
        { key: 'chuck_size', label: 'Chuck Size', type: 'select', options: ['10mm', '13mm'] },
        { key: 'type', label: 'Type', type: 'select', options: ['Corded', 'Cordless'] },
      ],
    },
    {
      id: 'prod_008',
      name: 'Circular Saw',
      category: 'hardware-tools',
      specs: [
        { key: 'brand', label: 'Brand', type: 'text' },
        { key: 'wattage', label: 'Wattage', type: 'select', options: ['1200W', '1400W', '1600W'] },
        { key: 'blade_size', label: 'Blade Size', type: 'select', options: ['7 inch', '9 inch'] },
      ],
    },
    {
      id: 'prod_009',
      name: 'Wrench Set',
      category: 'hardware-tools',
      specs: [
        { key: 'brand', label: 'Brand', type: 'text' },
        { key: 'pieces', label: 'Number of Pieces', type: 'select', options: ['6', '12', '24'] },
        { key: 'material', label: 'Material', type: 'select', options: ['Chrome Vanadium', 'Carbon Steel'] },
      ],
    },

    // Electrical & Plumbing
    {
      id: 'prod_010',
      name: 'LED Bulb',
      category: 'electrical-plumbing',
      specs: [
        { key: 'brand', label: 'Brand', type: 'text' },
        { key: 'wattage', label: 'Wattage', type: 'select', options: ['5W', '9W', '12W', '15W'] },
        { key: 'base_type', label: 'Base Type', type: 'select', options: ['B22', 'E27'] },
        { key: 'color_temp', label: 'Color Temperature', type: 'select', options: ['Warm White', 'Cool White', 'Daylight'] },
      ],
    },
    {
      id: 'prod_011',
      name: 'Ceiling Fan',
      category: 'electrical-plumbing',
      specs: [
        { key: 'brand', label: 'Brand', type: 'text' },
        { key: 'sweep', label: 'Sweep Size', type: 'select', options: ['1200mm', '1400mm'] },
        { key: 'color', label: 'Color', type: 'color' },
        { key: 'speed', label: 'Speed Settings', type: 'select', options: ['3 Speed', '4 Speed'] },
      ],
    },
    {
      id: 'prod_012',
      name: 'Water Heater',
      category: 'electrical-plumbing',
      specs: [
        { key: 'brand', label: 'Brand', type: 'text' },
        { key: 'capacity', label: 'Capacity', type: 'select', options: ['10L', '15L', '25L'] },
        { key: 'type', label: 'Type', type: 'select', options: ['Instant', 'Storage'] },
      ],
    },
    {
      id: 'prod_013',
      name: 'Kitchen Sink',
      category: 'electrical-plumbing',
      specs: [
        { key: 'brand', label: 'Brand', type: 'text' },
        { key: 'material', label: 'Material', type: 'select', options: ['Stainless Steel', 'Granite'] },
        { key: 'bowl', label: 'Bowl Type', type: 'select', options: ['Single Bowl', 'Double Bowl'] },
        { key: 'size', label: 'Size', type: 'select', options: ['24 inch', '30 inch', '36 inch'] },
      ],
    },
    {
      id: 'prod_014',
      name: 'PVC Pipe',
      category: 'electrical-plumbing',
      specs: [
        { key: 'brand', label: 'Brand', type: 'text' },
        { key: 'diameter', label: 'Diameter', type: 'select', options: ['1/2 inch', '3/4 inch', '1 inch', '2 inch'] },
        { key: 'length', label: 'Length', type: 'select', options: ['10 feet', '20 feet'] },
      ],
    },

    // Mobile Accessories
    {
      id: 'prod_015',
      name: 'Mobile Charger',
      category: 'mobile-accessories',
      specs: [
        { key: 'brand', label: 'Brand', type: 'text' },
        { key: 'output_power', label: 'Output Power', type: 'select', options: ['10W', '20W', '33W', '65W'] },
        { key: 'type', label: 'Type', type: 'select', options: ['Type-C', 'Type-C PD', 'Dual Port'] },
        { key: 'cable_included', label: 'Cable Included', type: 'select', options: ['Yes', 'No'] },
      ],
    },
    {
      id: 'prod_016',
      name: 'Phone Case',
      category: 'mobile-accessories',
      specs: [
        { key: 'brand', label: 'Brand', type: 'text' },
        { key: 'phone_model', label: 'Phone Model', type: 'text' },
        { key: 'material', label: 'Material', type: 'select', options: ['Silicone', 'Hard Plastic', 'Leather'] },
        { key: 'color', label: 'Color', type: 'color' },
      ],
    },
    {
      id: 'prod_017',
      name: 'Screen Protector',
      category: 'mobile-accessories',
      specs: [
        { key: 'brand', label: 'Brand', type: 'text' },
        { key: 'phone_model', label: 'Phone Model', type: 'text' },
        { key: 'type', label: 'Type', type: 'select', options: ['Tempered Glass', 'Hydrogel', 'Privacy'] },
      ],
    },
    {
      id: 'prod_018',
      name: 'Power Bank',
      category: 'mobile-accessories',
      specs: [
        { key: 'brand', label: 'Brand', type: 'text' },
        { key: 'capacity', label: 'Capacity', type: 'select', options: ['10000mAh', '20000mAh', '30000mAh'] },
        { key: 'fast_charging', label: 'Fast Charging', type: 'select', options: ['Yes', 'No'] },
        { key: 'color', label: 'Color', type: 'color' },
      ],
    },

    // Apparel & Footwear
    {
      id: 'prod_019',
      name: "Men's Shirt",
      category: 'apparel-footwear',
      specs: [
        { key: 'brand', label: 'Brand', type: 'text' },
        { key: 'size', label: 'Size', type: 'select', options: ['S', 'M', 'L', 'XL', 'XXL'] },
        { key: 'color', label: 'Color', type: 'color' },
        { key: 'fabric', label: 'Fabric', type: 'select', options: ['Cotton', 'Linen', 'Polyester'] },
        { key: 'fit', label: 'Fit', type: 'select', options: ['Slim Fit', 'Regular Fit', 'Relaxed Fit'] },
      ],
    },
    {
      id: 'prod_020',
      name: "Women's Jeans",
      category: 'apparel-footwear',
      specs: [
        { key: 'brand', label: 'Brand', type: 'text' },
        { key: 'size', label: 'Size', type: 'select', options: ['28', '30', '32', '34', '36'] },
        { key: 'color', label: 'Color', type: 'color' },
        { key: 'fit', label: 'Fit', type: 'select', options: ['Skinny', 'Straight', 'Bootcut'] },
      ],
    },
    {
      id: 'prod_021',
      name: 'Running Shoes',
      category: 'apparel-footwear',
      specs: [
        { key: 'brand', label: 'Brand', type: 'text' },
        { key: 'size', label: 'Size', type: 'select', options: ['7', '8', '9', '10', '11'] },
        { key: 'color', label: 'Color', type: 'color' },
        { key: 'gender', label: 'Gender', type: 'select', options: ['Men', 'Women', 'Unisex'] },
      ],
    },
    {
      id: 'prod_022',
      name: 'T-Shirt',
      category: 'apparel-footwear',
      specs: [
        { key: 'brand', label: 'Brand', type: 'text' },
        { key: 'size', label: 'Size', type: 'select', options: ['S', 'M', 'L', 'XL', 'XXL'] },
        { key: 'color', label: 'Color', type: 'color' },
        { key: 'neck', label: 'Neck Type', type: 'select', options: ['Round Neck', 'V-Neck', 'Polo'] },
      ],
    },
  ];

  // Store all products
  for (const product of products) {
    await kv.set(`product:${product.id}`, JSON.stringify(product));
  }

  // Create category indexes
  const categoryIndex: Record<string, string[]> = {};
  products.forEach(product => {
    if (!categoryIndex[product.category]) {
      categoryIndex[product.category] = [];
    }
    categoryIndex[product.category].push(product.id);
  });

  for (const [category, productIds] of Object.entries(categoryIndex)) {
    await kv.set(`category_index:${category}`, JSON.stringify(productIds));
  }

  // Sample stores data
  const stores = [
    // Home & Kitchen stores
    {
      id: 'store_001',
      name: 'Kitchen World',
      category: 'home-kitchen',
      address: '123 Main Street, Downtown',
      distance: '0.5 km',
      phone: '+91 98765 43210',
    },
    {
      id: 'store_002',
      name: 'Home Appliances Hub',
      category: 'home-kitchen',
      address: '456 Market Road, Central',
      distance: '1.2 km',
      phone: '+91 98765 43211',
    },
    {
      id: 'store_003',
      name: 'Kitchen Paradise',
      category: 'home-kitchen',
      address: '789 Park Avenue, North',
      distance: '2.3 km',
      phone: '+91 98765 43212',
    },

    // Hardware & Tools stores
    {
      id: 'store_004',
      name: 'Power Tools Pro',
      category: 'hardware-tools',
      address: '321 Industrial Area, East',
      distance: '1.0 km',
      phone: '+91 98765 43213',
    },
    {
      id: 'store_005',
      name: 'Hardware Central',
      category: 'hardware-tools',
      address: '654 Construction Lane, West',
      distance: '1.8 km',
      phone: '+91 98765 43214',
    },

    // Electrical & Plumbing stores
    {
      id: 'store_006',
      name: 'Bright Lights Electrical',
      category: 'electrical-plumbing',
      address: '987 Electric Street, South',
      distance: '0.8 km',
      phone: '+91 98765 43215',
    },
    {
      id: 'store_007',
      name: 'Plumber\'s Choice',
      category: 'electrical-plumbing',
      address: '147 Water Works Road, East',
      distance: '1.5 km',
      phone: '+91 98765 43216',
    },

    // Mobile Accessories stores
    {
      id: 'store_008',
      name: 'Mobile Zone',
      category: 'mobile-accessories',
      address: '258 Tech Plaza, Downtown',
      distance: '0.3 km',
      phone: '+91 98765 43217',
    },
    {
      id: 'store_009',
      name: 'Gadget Hub',
      category: 'mobile-accessories',
      address: '369 Smart Street, Central',
      distance: '0.9 km',
      phone: '+91 98765 43218',
    },
    {
      id: 'store_010',
      name: 'Phone Accessories Plus',
      category: 'mobile-accessories',
      address: '741 Digital Avenue, North',
      distance: '1.7 km',
      phone: '+91 98765 43219',
    },

    // Apparel & Footwear stores
    {
      id: 'store_011',
      name: 'Fashion Street',
      category: 'apparel-footwear',
      address: '852 Style Boulevard, West',
      distance: '0.6 km',
      phone: '+91 98765 43220',
    },
    {
      id: 'store_012',
      name: 'Trendy Wear',
      category: 'apparel-footwear',
      address: '963 Fashion District, South',
      distance: '1.1 km',
      phone: '+91 98765 43221',
    },
  ];

  // Store all stores
  for (const store of stores) {
    await kv.set(`store:${store.id}`, JSON.stringify(store));
  }

  // Create store category indexes
  const storeCategoryIndex: Record<string, string[]> = {};
  stores.forEach(store => {
    if (!storeCategoryIndex[store.category]) {
      storeCategoryIndex[store.category] = [];
    }
    storeCategoryIndex[store.category].push(store.id);
  });

  for (const [category, storeIds] of Object.entries(storeCategoryIndex)) {
    await kv.set(`store_category_index:${category}`, JSON.stringify(storeIds));
  }

  await kv.set('products_initialized', 'true');
  console.log('Sample data initialized successfully');
}

// Initialize data on startup
initializeData().catch(console.error);

// Search products by category and query
app.get('/make-server-85dc2195/search-products', async (c) => {
  try {
    const category = c.req.query('category');
    const query = c.req.query('query');

    if (!category || !query) {
      return c.json({ error: 'Missing parameters' }, 400);
    }

    // Get product IDs for this category
    const categoryIndexJson = await kv.get(`category_index:${category}`);
    if (!categoryIndexJson) {
      return c.json({ products: [] });
    }

    const productIds = JSON.parse(categoryIndexJson);
    
    // Fetch all products in this category
    const products = [];
    for (const productId of productIds) {
      const productJson = await kv.get(`product:${productId}`);
      if (productJson) {
        const product = JSON.parse(productJson);
        // Filter by search query
        if (product.name.toLowerCase().includes(query.toLowerCase())) {
          products.push(product);
        }
      }
    }

    return c.json({ products });
  } catch (error) {
    console.error('Search products error:', error);
    return c.json({ error: 'Failed to search products' }, 500);
  }
});

// Get stores by category
app.get('/make-server-85dc2195/stores', async (c) => {
  try {
    const category = c.req.query('category');

    if (!category) {
      return c.json({ error: 'Missing category' }, 400);
    }

    // Get store IDs for this category
    const storeCategoryIndexJson = await kv.get(`store_category_index:${category}`);
    if (!storeCategoryIndexJson) {
      return c.json({ stores: [] });
    }

    const storeIds = JSON.parse(storeCategoryIndexJson);
    
    // Fetch all stores in this category
    const stores = [];
    for (const storeId of storeIds) {
      const storeJson = await kv.get(`store:${storeId}`);
      if (storeJson) {
        stores.push(JSON.parse(storeJson));
      }
    }

    return c.json({ stores });
  } catch (error) {
    console.error('Get stores error:', error);
    return c.json({ error: 'Failed to get stores' }, 500);
  }
});

// Send request to store
app.post('/make-server-85dc2195/send-request', async (c) => {
  try {
    const body = await c.req.json();
    const { storeId, productName, specs, customerLocation } = body;

    if (!storeId || !productName || !specs || !customerLocation) {
      return c.json({ error: 'Missing parameters' }, 400);
    }

    // Generate request ID
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Build WhatsApp message
    const specsText = Object.entries(specs)
      .map(([key, value]) => `${key.replace(/_/g, ' ')}: ${value}`)
      .join('\n');

    const whatsappMessage = `Product Inquiry

Product: ${productName}
${specsText}

Customer Location: ${customerLocation}

Please reply:
1 - Available
2 - Not Available
3 - Similar Option`;

    // Get store details
    const storeJson = await kv.get(`store:${storeId}`);
    if (!storeJson) {
      return c.json({ error: 'Store not found' }, 404);
    }
    const store = JSON.parse(storeJson);

    // Store request with pending status
    const request = {
      id: requestId,
      storeId,
      storeName: store.name,
      storePhone: store.phone,
      productName,
      specs,
      customerLocation,
      message: whatsappMessage,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`request:${requestId}`, JSON.stringify(request));

    console.log(`Request ${requestId} created for store ${store.name}`);
    console.log(`WhatsApp message:\n${whatsappMessage}`);

    // In a real application, this would send the message via WhatsApp API
    // For now, we'll simulate a response after a delay (for demo purposes)
    // In production, the store would reply via WhatsApp and update the status

    return c.json({ 
      requestId,
      message: 'Request sent successfully',
      whatsappMessage,
      storePhone: store.phone,
    });
  } catch (error) {
    console.error('Send request error:', error);
    return c.json({ error: 'Failed to send request' }, 500);
  }
});

// Get request status
app.get('/make-server-85dc2195/request-status', async (c) => {
  try {
    const requestId = c.req.query('requestId');

    if (!requestId) {
      return c.json({ error: 'Missing requestId' }, 400);
    }

    const requestJson = await kv.get(`request:${requestId}`);
    if (!requestJson) {
      return c.json({ error: 'Request not found' }, 404);
    }

    const request = JSON.parse(requestJson);

    // For demo purposes, simulate a response after 10 seconds
    const createdAt = new Date(request.createdAt).getTime();
    const now = Date.now();
    const elapsed = now - createdAt;

    if (elapsed > 10000 && request.status === 'pending') {
      // Simulate random response
      const responses = ['available', 'not_available', 'similar'];
      const randomStatus = responses[Math.floor(Math.random() * responses.length)];
      
      request.status = randomStatus;
      request.updatedAt = new Date().toISOString();
      await kv.set(`request:${requestId}`, JSON.stringify(request));
      
      console.log(`Request ${requestId} status updated to: ${randomStatus}`);
    }

    return c.json({ status: request.status });
  } catch (error) {
    console.error('Get request status error:', error);
    return c.json({ error: 'Failed to get request status' }, 500);
  }
});

// Update request status (for store responses)
app.post('/make-server-85dc2195/update-request-status', async (c) => {
  try {
    const body = await c.req.json();
    const { requestId, status } = body;

    if (!requestId || !status) {
      return c.json({ error: 'Missing parameters' }, 400);
    }

    const requestJson = await kv.get(`request:${requestId}`);
    if (!requestJson) {
      return c.json({ error: 'Request not found' }, 404);
    }

    const request = JSON.parse(requestJson);
    request.status = status;
    request.updatedAt = new Date().toISOString();

    await kv.set(`request:${requestId}`, JSON.stringify(request));

    return c.json({ success: true });
  } catch (error) {
    console.error('Update request status error:', error);
    return c.json({ error: 'Failed to update status' }, 500);
  }
});

Deno.serve(app.fetch);
