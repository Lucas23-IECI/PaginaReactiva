const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Configure better-sqlite3 adapter for Prisma v7
// Database is created at the root folder in Prisma v7 due to prisma.config.ts resolution
const dbPath = path.join(__dirname, '../dev.db');
console.log(`Connecting database at path: ${dbPath}`);

const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database with Reactiva products...');
  
  // Load products from products.json
  const productsPath = path.join(__dirname, '../src/data/products.json');
  if (!fs.existsSync(productsPath)) {
    throw new Error(`Products JSON file not found at: ${productsPath}`);
  }
  
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  console.log(`Found ${products.length} products to seed.`);

  // Clean existing products
  await prisma.product.deleteMany({});
  console.log('Cleaned existing product records.');

  // Insert products
  let count = 0;
  for (const p of products) {
    await prisma.product.create({
      data: {
        sku: p.sku,
        name: p.name,
        category: p.category,
        description: p.description,
        priceUnit: p.priceUnit,
        priceBox: p.priceBox,
        imageUrl: p.imageUrl,
        available: p.available ?? true,
      }
    });
    count++;
  }
  console.log(`Seeded ${count} products successfully.`);

  // Create default admin user
  const adminUsername = 'admin';
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { username: adminUsername }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('reactiva2026', 10);
    await prisma.adminUser.create({
      data: {
        username: adminUsername,
        password: hashedPassword
      }
    });
    console.log('Created default admin user: "admin" with password: "reactiva2026"');
  } else {
    console.log('Admin user "admin" already exists.');
  }
}

main()
  .catch((e) => {
    console.error('Seed process failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
