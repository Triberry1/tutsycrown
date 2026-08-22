import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'
import { v2 as cloudinary } from 'cloudinary'
import Replicate from 'replicate'
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import axios from 'axios'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is required to seed product images')
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
})

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Initialize Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

// Helper: delay for rate limiting
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Generate a prompt based on product data
function generatePrompt(product: { name: string; description?: string | null; category?: { name: string } | null }) {
  const categoryName = product.category?.name || 'fashion'
  const desc = product.description || `${product.name} – stylish and modern`
  return `A professional e-commerce product photo of a "${product.name}" (${categoryName}). The item is isolated on a clean white background, studio lighting, product photography style, no person, no face, no text, no watermark, high resolution, 4K, photorealistic. The item should be the main focus, with a minimalist and clean composition.`
}

// Generate image via Replicate (Stable Diffusion)
async function generateImageWithReplicate(prompt: string): Promise<string> {
  try {
    // Using stable-diffusion-3.5 for high quality
    const output = await replicate.run(
      "stability-ai/stable-diffusion-3.5-large",
      {
        input: {
          prompt: prompt,
          negative_prompt: "people, faces, person, human, text, watermark, logo, signature, low quality, blurry, deformed, distorted",
          width: 1024,
          height: 1024,
          num_outputs: 1,
          scheduler: "DPMSolverMultistep",
          guidance_scale: 7.5,
          num_inference_steps: 30,
        }
      }
    )
    // Output is an array of URLs
    if (Array.isArray(output) && output.length > 0) {
      return output[0]
    }
    throw new Error('No image generated')
  } catch (error) {
    console.error('Replicate generation failed:', error)
    throw error
  }
}

// Upload image to Cloudinary
async function uploadToCloudinary(imageUrl: string, productId: string): Promise<{ url: string; publicId: string }> {
  // Download the image to a temporary file
  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })
  const tempDir = path.join(__dirname, 'temp')
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)
  const tempFile = path.join(tempDir, `${productId}.jpg`)
  fs.writeFileSync(tempFile, response.data)

  // Upload to Cloudinary
  const result = await cloudinary.uploader.upload(tempFile, {
    folder: 'tutsy-crown/products',
    public_id: `product_${productId}_${Date.now()}`,
    overwrite: false,
  })

  // Clean up temp file
  fs.unlinkSync(tempFile)

  return {
    url: result.secure_url,
    publicId: result.public_id,
  }
}

// Main seeding function
async function seedProductImages() {
  console.log('🌱 Starting AI product image seeding...')

  // Fetch products that don't have images yet
  const products = await prisma.product.findMany({
    where: {
      images: {
        none: {}, // no images yet
      },
    },
    include: {
      category: true,
    },
    take: 20, // limit per run to control costs
  })

  if (products.length === 0) {
    console.log('✅ All products already have images.')
    return
  }

  console.log(`📦 Found ${products.length} products without images.`)

  for (const product of products) {
    try {
      console.log(`🖼️ Generating image for: ${product.name}`)

      // 1. Generate the prompt
      const prompt = generatePrompt(product)

      // 2. Generate image (choose one method)
      // Using Replicate (uncomment if using OpenAI)
      const imageUrl = await generateImageWithReplicate(prompt)
      // const imageUrl = await generateImageWithOpenAI(prompt)

      // 3. Upload to Cloudinary
      const { url, publicId } = await uploadToCloudinary(imageUrl, product.id)

      // 4. Save to database
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url,
          publicId,
          isPrimary: true,
          order: 0,
          altText: product.name,
        },
      })

      console.log(`✅ Uploaded image for ${product.name}`)

      // Rate limiting: wait 1 second between requests
      await sleep(1000)

    } catch (error) {
      console.error(`❌ Failed to process product ${product.id} (${product.name}):`, error)
      // Optionally, skip or mark as failed
    }
  }

  console.log('🎉 Seeding completed!')
}

// Run the script
seedProductImages()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })