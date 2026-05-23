require('dotenv').config();
const connectDB  = require('./db');
const MenuItem   = require('./models/MenuItem');
const Room       = require('./models/Room');
const Table      = require('./models/Table');

const menuItems = [
  // Food
  { name: 'Grilled Tilapia', category: 'food', price: 18000, description: 'Fresh tilapia grilled with local spices, served with ugali and vegetables', is_available: true, image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400' },
  { name: 'Nyama Choma', category: 'food', price: 25000, description: 'Slow roasted beef with kachumbari and chips', is_available: true, image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400' },
  { name: 'Chicken Biryani', category: 'food', price: 15000, description: 'Aromatic rice cooked with tender chicken and spices', is_available: true, image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400' },
  { name: 'Vegetable Curry', category: 'food', price: 10000, description: 'Mixed vegetables in a rich curry sauce served with rice', is_available: true, image_url: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400' },
  { name: 'Chips Mayai', category: 'food', price: 8000, description: 'Tanzanian omelette with crispy chips', is_available: true, image_url: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400' },
  { name: 'Grilled Chicken', category: 'food', price: 16000, description: 'Half chicken grilled to perfection with garlic sauce', is_available: true, image_url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c7?w=400' },
  { name: 'Beef Steak', category: 'food', price: 28000, description: 'Tender beef steak with mushroom sauce and mashed potatoes', is_available: true, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400' },
  { name: 'Prawn Skewers', category: 'food', price: 22000, description: 'Juicy prawns on skewers with lemon butter sauce', is_available: false, image_url: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400' },

  // Drinks
  { name: 'Fresh Mango Juice', category: 'drink', price: 4000, description: 'Freshly squeezed Tanzanian mangoes', is_available: true, image_url: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400' },
  { name: 'Passion Fruit Juice', category: 'drink', price: 4000, description: 'Fresh passion fruit blended with a hint of sugar', is_available: true, image_url: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400' },
  { name: 'Coconut Water', category: 'drink', price: 3500, description: 'Fresh cold coconut water straight from the coconut', is_available: true, image_url: 'https://images.unsplash.com/photo-1560023907-5f339617ea30?w=400' },
  { name: 'Tamarind Juice', category: 'drink', price: 3500, description: 'Traditional tangy tamarind drink', is_available: true, image_url: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=400' },
  { name: 'Coca Cola', category: 'drink', price: 2500, description: '350ml chilled bottle', is_available: true, image_url: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400' },
  { name: 'Mineral Water', category: 'drink', price: 1500, description: '500ml chilled mineral water', is_available: true, image_url: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400' },
  { name: 'Avocado Smoothie', category: 'drink', price: 5000, description: 'Creamy avocado blended with milk and honey', is_available: true, image_url: 'https://images.unsplash.com/photo-1638176066959-1bb3a25c12b4?w=400' },
  { name: 'Ginger Lemonade', category: 'drink', price: 4500, description: 'Fresh lemon with ginger and mint leaves', is_available: false, image_url: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400' },

  // Liquor
  { name: 'Safari Lager Beer', category: 'liquor', price: 5000, description: "Tanzania's favourite cold beer 500ml", is_available: true, image_url: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400' },
  { name: 'Konyagi', category: 'liquor', price: 4500, description: "Tanzania's iconic spirit, served with mixer", is_available: true, image_url: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400' },
  { name: 'Amarula', category: 'liquor', price: 12000, description: 'South African cream liqueur on the rocks', is_available: true, image_url: 'https://images.unsplash.com/photo-1470338745628-171cf53de3a8?w=400' },
  { name: 'Gin & Tonic', category: 'liquor', price: 10000, description: 'Premium gin with tonic water and lime', is_available: true, image_url: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400' },
  { name: 'Red Wine (Glass)', category: 'liquor', price: 14000, description: 'House red wine, smooth and full bodied', is_available: true, image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400' },
  { name: 'White Wine (Glass)', category: 'liquor', price: 14000, description: 'Chilled house white wine', is_available: true, image_url: 'https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?w=400' },
  { name: 'Whisky on the Rocks', category: 'liquor', price: 16000, description: 'Premium blended Scotch whisky', is_available: true, image_url: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400' },
  { name: 'Vodka Sunrise', category: 'liquor', price: 12000, description: 'Vodka with orange juice and grenadine', is_available: false, image_url: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400' },
];

const rooms = [
  { room_number: '101', type: 'single', price_per_night: 45000, description: 'Cozy single room with lake view, air conditioning and free WiFi', is_available: true, image_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400' },
  { room_number: '102', type: 'single', price_per_night: 45000, description: 'Comfortable single room with garden view and en-suite bathroom', is_available: true, image_url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400' },
  { room_number: '201', type: 'double', price_per_night: 80000, description: 'Spacious double room with king size bed and lake view balcony', is_available: true, image_url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400' },
  { room_number: '202', type: 'double', price_per_night: 80000, description: 'Elegant double room with queen size bed and mountain view', is_available: false, image_url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400' },
  { room_number: '203', type: 'double', price_per_night: 85000, description: 'Deluxe double room with private balcony and sunset view', is_available: true, image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400' },
  { room_number: '301', type: 'suite', price_per_night: 150000, description: 'Luxury suite with separate living room, jacuzzi and panoramic lake view', is_available: true, image_url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400' },
  { room_number: '302', type: 'suite', price_per_night: 165000, description: 'Presidential suite with private terrace, mini bar and butler service', is_available: true, image_url: 'https://images.unsplash.com/photo-1609949279531-cf48d64bed89?w=400' },
  { room_number: '401', type: 'family', price_per_night: 120000, description: 'Large family room with two bedrooms, kitchenette and children play area', is_available: true, image_url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400' },
  { room_number: '402', type: 'family', price_per_night: 120000, description: 'Family suite with bunk beds, private bathroom and garden access', is_available: false, image_url: 'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=400' },
];

const tables = [
  { table_number: '1', capacity: 2, status: 'available' },
  { table_number: '2', capacity: 2, status: 'available' },
  { table_number: '3', capacity: 4, status: 'available' },
  { table_number: '4', capacity: 4, status: 'available' },
  { table_number: '5', capacity: 4, status: 'available' },
  { table_number: '6', capacity: 6, status: 'available' },
  { table_number: '7', capacity: 6, status: 'available' },
  { table_number: '8', capacity: 8, status: 'available' },
];

const seedDB = async () => {
  try {
    await connectDB();
    console.log('Connected to database...');
    await MenuItem.deleteMany({});
    await Room.deleteMany({});
    await Table.deleteMany({});
    console.log('Cleared existing data...');
    await MenuItem.insertMany(menuItems);
    console.log(`✅ Added ${menuItems.length} menu items with photos`);
    await Room.insertMany(rooms);
    console.log(`✅ Added ${rooms.length} rooms with photos`);
    await Table.insertMany(tables);
    console.log(`✅ Added ${tables.length} tables`);
    console.log('');
    console.log('🎉 Karibu System database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
};

seedDB();