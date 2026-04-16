import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const AMENITIES = {
  wifi: 'WiFi',
  parking: 'Parking',
  pool: 'Pool',
  restaurant: 'Restaurant',
  ac: 'AC',
  bar: 'Bar',
};

const lodgeData = [
  {
    name: 'Riverside Lodge Lusaka',
    description: 'A beautiful lodge along the banks of the Zambezi River with stunning views and modern amenities. Perfect for business travelers and tourists alike. Our lodge offers comfortable rooms, a swimming pool, and an on-site restaurant serving both local and international cuisine.',
    location: 'Lusaka',
    address: '42 Cairo Road, Lusaka, Zambia',
    phone: '+260 211 251 123',
    price: 450,
    priceUnit: 'night',
    latitude: -15.3875,
    longitude: 28.3228,
    amenities: JSON.stringify(['WiFi', 'Parking', 'Pool', 'Restaurant', 'AC']),
    rating: 4.5,
    totalRooms: 24,
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    name: 'Victoria Falls Retreat',
    description: 'Located just minutes from the magnificent Victoria Falls, our retreat offers an unforgettable experience. Enjoy the sound of the falls from your private balcony, take guided tours, or relax by our infinity pool. Breakfast included with every stay.',
    location: 'Livingstone',
    address: '18 Mosi-oa-Tunya Road, Livingstone, Zambia',
    phone: '+260 213 320 456',
    price: 780,
    priceUnit: 'night',
    latitude: -17.8450,
    longitude: 25.8583,
    amenities: JSON.stringify(['WiFi', 'Parking', 'Pool', 'Restaurant', 'AC', 'Bar']),
    rating: 4.8,
    totalRooms: 18,
    gradient: 'from-emerald-400 to-teal-500',
  },
  {
    name: 'Copperbelt Suites',
    description: 'Modern and affordable suites in the heart of the Copperbelt. Ideal for business travelers visiting mining operations or attending conferences. High-speed WiFi, 24/7 security, and a fully equipped business center available for all guests.',
    location: 'Kitwe',
    address: '7 Obote Avenue, Kitwe, Zambia',
    phone: '+260 212 223 789',
    price: 320,
    priceUnit: 'night',
    latitude: -12.8024,
    longitude: 28.2135,
    amenities: JSON.stringify(['WiFi', 'Parking', 'AC']),
    rating: 4.2,
    totalRooms: 30,
    gradient: 'from-sky-400 to-blue-500',
  },
  {
    name: 'Ndola Garden Hotel',
    description: 'Set amidst lush tropical gardens, this charming hotel offers a peaceful retreat from the bustling city. Our spacious rooms feature traditional Zambian decor with modern comforts. Enjoy our outdoor dining area under the stars.',
    location: 'Ndola',
    address: '15 Bwana Mkubwa Road, Ndola, Zambia',
    phone: '+260 212 617 234',
    price: 380,
    priceUnit: 'night',
    latitude: -12.9583,
    longitude: 28.6367,
    amenities: JSON.stringify(['WiFi', 'Parking', 'Restaurant', 'AC']),
    rating: 4.3,
    totalRooms: 22,
    gradient: 'from-rose-400 to-pink-500',
  },
  {
    name: 'Lake Kariba Inn',
    description: 'Wake up to breathtaking views of Lake Kariba. Our lakeside inn offers fishing trips, boat cruises, and spectacular sunsets. The perfect getaway for nature lovers and those seeking tranquility. Fresh fish from the lake served daily.',
    location: 'Siavonga',
    address: '3 Lake Drive, Siavonga, Zambia',
    phone: '+260 216 240 567',
    price: 520,
    priceUnit: 'night',
    latitude: -16.5311,
    longitude: 28.7044,
    amenities: JSON.stringify(['WiFi', 'Parking', 'Restaurant', 'Bar']),
    rating: 4.6,
    totalRooms: 16,
    gradient: 'from-cyan-400 to-blue-600',
  },
  {
    name: 'Chipata Gateway Lodge',
    description: 'Your gateway to the Eastern Province and South Luangwa National Park. Comfortable rooms, friendly staff, and expert safari guides. We arrange game drives and cultural tours to nearby villages. A truly authentic Zambian experience.',
    location: 'Chipata',
    address: '22 Mpezeni Way, Chipata, Zambia',
    phone: '+260 216 222 890',
    price: 290,
    priceUnit: 'night',
    latitude: -13.6327,
    longitude: 32.6492,
    amenities: JSON.stringify(['WiFi', 'Parking', 'Restaurant']),
    rating: 4.1,
    totalRooms: 20,
    gradient: 'from-violet-400 to-purple-500',
  },
  {
    name: 'Lusaka Premier Lodge',
    description: 'The premier choice for luxury accommodation in Lusaka. Elegant suites with king-size beds, marble bathrooms, and panoramic city views. Our rooftop bar and restaurant are the perfect places to unwind after a busy day. Airport transfers available.',
    location: 'Lusaka',
    address: '88 Great East Road, Lusaka, Zambia',
    phone: '+260 211 845 321',
    price: 950,
    priceUnit: 'night',
    latitude: -15.4033,
    longitude: 28.3428,
    amenities: JSON.stringify(['WiFi', 'Parking', 'Pool', 'Restaurant', 'AC', 'Bar']),
    rating: 4.9,
    totalRooms: 12,
    gradient: 'from-amber-500 to-red-500',
  },
  {
    name: 'Mosi Cultural Village Lodge',
    description: 'Experience authentic Zambian hospitality at our cultural village lodge. Traditional roundavels with modern amenities, live cultural performances, and hands-on craft workshops. A unique stay that connects you with local traditions and community.',
    location: 'Livingstone',
    address: '55 Mukuni Road, Livingstone, Zambia',
    phone: '+260 213 455 678',
    price: 350,
    priceUnit: 'night',
    latitude: -17.8320,
    longitude: 25.8610,
    amenities: JSON.stringify(['WiFi', 'Parking', 'Restaurant']),
    rating: 4.4,
    totalRooms: 8,
    gradient: 'from-lime-400 to-green-600',
  },
  {
    name: 'Kitwe Business Park',
    description: 'A modern business hotel with state-of-the-art conference facilities. Spacious rooms with dedicated work desks, high-speed internet, and 24/7 room service. Perfect for corporate events, meetings, and extended business stays.',
    location: 'Kitwe',
    address: '31 Independence Avenue, Kitwe, Zambia',
    phone: '+260 212 334 901',
    price: 410,
    priceUnit: 'night',
    latitude: -12.7960,
    longitude: 28.2080,
    amenities: JSON.stringify(['WiFi', 'Parking', 'Restaurant', 'AC', 'Bar']),
    rating: 4.3,
    totalRooms: 36,
    gradient: 'from-orange-400 to-amber-600',
  },
  {
    name: 'Ndola Comfort Inn',
    description: 'Affordable comfort in the heart of Ndola. Clean, well-maintained rooms with friendly service. Located near shopping centers and restaurants. Free breakfast and airport shuttle service included. Great value for money.',
    location: 'Ndola',
    address: '9 Zambia Way, Ndola, Zambia',
    phone: '+260 212 728 345',
    price: 260,
    priceUnit: 'night',
    latitude: -12.9630,
    longitude: 28.6410,
    amenities: JSON.stringify(['WiFi', 'Parking', 'AC']),
    rating: 4.0,
    totalRooms: 28,
    gradient: 'from-teal-400 to-emerald-600',
  },
  {
    name: 'Siavonga Beach Resort',
    description: 'Zambia\'s best-kept secret - a beach resort on the shores of Lake Kariba. White sandy beaches, crystal-clear waters, and endless sunshine. Water sports, fishing, and sunset cruises available. The perfect family holiday destination.',
    location: 'Siavonga',
    address: '1 Lakeshore Boulevard, Siavonga, Zambia',
    phone: '+260 216 243 789',
    price: 650,
    priceUnit: 'night',
    latitude: -16.5430,
    longitude: 28.7180,
    amenities: JSON.stringify(['WiFi', 'Parking', 'Pool', 'Restaurant', 'AC', 'Bar']),
    rating: 4.7,
    totalRooms: 14,
    gradient: 'from-blue-400 to-indigo-500',
  },
  {
    name: 'Eastern Valley Lodge',
    description: 'Nestled in the scenic Eastern Province valley, this lodge offers stunning mountain views and fresh mountain air. Ideal for hikers, bird watchers, and those seeking a peaceful escape. Home-cooked meals using fresh local ingredients.',
    location: 'Chipata',
    address: '45 Valley Road, Chipata, Zambia',
    phone: '+260 216 225 012',
    price: 220,
    priceUnit: 'night',
    latitude: -13.6450,
    longitude: 32.6350,
    amenities: JSON.stringify(['WiFi', 'Parking', 'Restaurant']),
    rating: 3.9,
    totalRooms: 10,
    gradient: 'from-yellow-400 to-orange-500',
  },
];

async function main() {
  console.log('🌱 Seeding StayNow database...');

  // Create admin user
  const admin = await db.user.create({
    data: {
      name: 'StayNow Admin',
      contact: 'admin@staynow.co',
    },
  });
  console.log(`✅ Created admin user: ${admin.id}`);

  // Create sample user
  const sampleUser = await db.user.create({
    data: {
      name: 'John Banda',
      contact: '+260 977 123 456',
    },
  });
  console.log(`✅ Created sample user: ${sampleUser.id}`);

  // Create lodges
  const createdLodges = [];
  for (const lodge of lodgeData) {
    const created = await db.lodge.create({
      data: {
        name: lodge.name,
        description: lodge.description,
        location: lodge.location,
        address: lodge.address,
        phone: lodge.phone,
        price: lodge.price,
        priceUnit: lodge.priceUnit,
        latitude: lodge.latitude,
        longitude: lodge.longitude,
        amenities: lodge.amenities,
        rating: lodge.rating,
        totalRooms: lodge.totalRooms,
      },
    });
    createdLodges.push(created);
    console.log(`✅ Created lodge: ${lodge.name}`);
  }

  // Create some sample reservations
  const statuses = ['PENDING', 'CONFIRMED', 'REJECTED'];
  for (let i = 0; i < 5; i++) {
    const lodgeIdx = i % createdLodges.length;
    const status = statuses[i % statuses.length];
    const expiresAt = new Date(Date.now() + (i < 2 ? 45 * 60 * 1000 : -30 * 60 * 1000)); // some expired

    await db.reservation.create({
      data: {
        userId: sampleUser.id,
        lodgeId: createdLodges[lodgeIdx].id,
        userName: 'John Banda',
        userContact: '+260 977 123 456',
        status,
        expiresAt,
      },
    });
    console.log(`✅ Created sample reservation #${i + 1} (${status})`);
  }

  console.log('\n🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
