import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, UserRole } from '../generated/prisma/client'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is required to seed the database')
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
})

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tutsycrown.com' },
    update: {},
    create: {
      clerkUserId: 'placeholder_clerk_admin',
      email: 'admin@tutsycrown.com',
      firstName: 'Admin',
      lastName: 'Tutsy',
      role: UserRole.ADMIN,
    },
  })
  console.log(`✅ Created admin user: ${admin.email}`)

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Gadgets, phones, laptops, and tech accessories',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Clothing, shoes, and accessories',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Home & Living',
        slug: 'home-living',
        description: 'Furniture, decor, and kitchenware',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Beauty & Personal Care',
        slug: 'beauty-care',
        description: 'Skincare, makeup, and personal care products',
      },
    }),
  ])
  console.log(`✅ Created ${categories.length} categories`)

  // Create sample products
  const electronics = categories.find(c => c.slug === 'electronics')
  
  if (electronics) {
    const product = await prisma.product.create({
      data: {
        name: 'Premium Smartphone X',
        slug: 'premium-smartphone-x',
        description: 'Latest generation smartphone with 5G, 128GB storage, 8GB RAM, and 6.7" OLED display. Features a powerful processor and advanced camera system.',
        price: 499.99,
        comparePrice: 599.99,
        sku: 'PHONE-X-001',
        stock: 50,
        categoryId: electronics.id,
        images: {
          create: [
            {
              url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
              publicId: 'sample',
              isPrimary: true,
              order: 0,
            },
          ],
        },
        variants: {
          create: [
            {
              attributes: { color: 'Black', storage: '128GB' },
              sku: 'PHONE-X-001-BLK-128',
              stock: 25,
            },
            {
              attributes: { color: 'White', storage: '128GB' },
              sku: 'PHONE-X-001-WHT-128',
              stock: 25,
            },
          ],
        },
      },
    })
    console.log(`✅ Created product: ${product.name}`)
  }

  // Create shipping methods
  const shippingMethods = await Promise.all([
    prisma.shippingMethod.create({
      data: {
        name: 'Standard Delivery',
        description: 'Delivered within 3-5 business days',
        cost: 5.99,
        estimatedDays: 5,
        isActive: true,
      },
    }),
    prisma.shippingMethod.create({
      data: {
        name: 'Express Delivery',
        description: 'Delivered within 1-2 business days',
        cost: 12.99,
        estimatedDays: 2,
        isActive: true,
      },
    }),
    prisma.shippingMethod.create({
      data: {
        name: 'Next Day Delivery',
        description: 'Delivered by next business day',
        cost: 19.99,
        estimatedDays: 1,
        isActive: true,
      },
    }),
  ])
  console.log(`✅ Created ${shippingMethods.length} shipping methods`)

  // Create a product collection
  const collection = await prisma.productCollection.create({
    data: {
      name: 'Best Sellers',
      slug: 'best-sellers',
      description: 'Our most popular products',
      isActive: true,
    },
  })
  console.log(`✅ Created collection: ${collection.name}`)

  console.log('🌱 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })