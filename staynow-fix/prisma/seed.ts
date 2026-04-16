/**
 * StayNow - Prisma Seed Script Fix Template
 * ==========================================
 * 
 * Common TypeScript errors in Prisma seed scripts:
 * 
 * 1. "Cannot use import statement outside a module"
 *    → Use dynamic import() or ensure tsconfig "module" is "esnext"
 * 
 * 2. "Property 'xxx' does not exist on type 'xxx'"
 *    → Make sure @prisma/client is regenerated: npx prisma generate
 * 
 * 3. "Cannot find module '@/lib/prisma'"
 *    → Use relative paths in seed scripts, not path aliases
 * 
 * Below is a corrected template. Replace field names with your actual schema.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data (optional - removes all data first)
  // await prisma.reservation.deleteMany();
  // await prisma.lodge.deleteMany();
  // await prisma.user.deleteMany();

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@staynow.co.zm" },
    update: {},
    create: {
      email: "admin@staynow.co.zm",
      name: "StayNow Admin",
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  // Create sample lodges
  const lodges = [
    {
      name: "Lusaka City Lodge",
      description: "Modern lodge in the heart of Lusaka with free WiFi and breakfast.",
      location: "Lusaka, Zambia",
      price: 450,
      amenities: "WiFi, Breakfast, Parking, Pool",
      contactPhone: "+260977123456",
      imageUrl: "/lodges/lusaka-city.jpg",
      roomsAvailable: 12,
    },
    {
      name: "Copperbelt Rest House",
      description: "Comfortable rest house in Kitwe, perfect for business travelers.",
      location: "Kitwe, Zambia",
      price: 350,
      amenities: "WiFi, Parking, Restaurant",
      contactPhone: "+260977654321",
      imageUrl: "/lodges/copperbelt.jpg",
      roomsAvailable: 8,
    },
    {
      name: "Victoria Falls Guest House",
      description: "Stunning views near Victoria Falls with outdoor pool and bar.",
      location: "Livingstone, Zambia",
      price: 600,
      amenities: "WiFi, Breakfast, Pool, Bar, Tours",
      contactPhone: "+260977987654",
      imageUrl: "/lodges/vic-falls.jpg",
      roomsAvailable: 6,
    },
  ];

  for (const lodge of lodges) {
    const created = await prisma.lodge.create({
      data: lodge,
    });
    console.log(`✅ Lodge created: ${created.name}`);
  }

  console.log("🎉 Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
