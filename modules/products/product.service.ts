import { prisma } from '../../config/prisma'
import { NotFoundError } from '../../utils/errors'
import { CreateProductInput, UpdateProductInput } from './product.types'

export class ProductService {
  static async getAllProducts(page = 1, limit = 20, filters?: any) {
    const skip = (page - 1) * limit
    const where = {
      isActive: true,
      ...(filters?.categoryId && { categoryId: filters.categoryId }),
      ...(filters?.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' as const } },
          { description: { contains: filters.search, mode: 'insensitive' as const } },
        ],
      }),
      ...(filters?.minPrice && { price: { gte: filters.minPrice } }),
      ...(filters?.maxPrice && { price: { lte: filters.maxPrice } }),
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: true,
          category: true,
          variants: true,
          reviews: {
            where: { status: 'APPROVED' },
            select: {
              rating: true,
              comment: true,
              createdAt: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          collections: {
            include: {
              collection: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ])

    return {
      data: products,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  static async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        category: true,
        variants: true,
        reviews: {
          where: { status: 'APPROVED' },
          select: {
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        collections: {
          include: {
            collection: true,
          },
        },
        discounts: {
          include: {
            discount: true,
          },
        },
      },
    })

    if (!product) {
      throw new NotFoundError('Product not found')
    }

    // Calculate average rating
    const reviews = product.reviews
    const avgRating = reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0

    return {
      ...product,
      avgRating: Number(avgRating.toFixed(1)),
      reviewCount: reviews.length,
    }
  }

  static async getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: true,
        category: true,
        variants: true,
        reviews: {
          where: { status: 'APPROVED' },
          select: {
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        collections: {
          include: {
            collection: true,
          },
        },
        discounts: {
          include: {
            discount: true,
          },
        },
      },
    })

    if (!product) {
      throw new NotFoundError('Product not found')
    }

    return product
  }

  static async createProduct(data: CreateProductInput) {
    const { images, variants, collections, ...productData } = data

    return prisma.product.create({
      data: {
        ...productData,
        slug: productData.name.toLowerCase().replace(/ /g, '-'),
        images: images ? {
          create: images,
        } : undefined,
        variants: variants ? {
          create: variants,
        } : undefined,
        collections: collections ? {
          create: collections.map(collectionId => ({
            collectionId,
          })),
        } : undefined,
      },
      include: {
        images: true,
        variants: true,
        collections: true,
      },
    })
  }

  static async updateProduct(id: string, data: UpdateProductInput) {
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) {
      throw new NotFoundError('Product not found')
    }

    const { images, variants, collections, ...updateData } = data

    return prisma.product.update({
      where: { id },
      data: {
        ...updateData,
        ...(updateData.name && {
          slug: updateData.name.toLowerCase().replace(/ /g, '-'),
        }),
        images: images ? {
          deleteMany: {},
          create: images,
        } : undefined,
        variants: variants ? {
          deleteMany: {},
          create: variants,
        } : undefined,
        collections: collections ? {
          deleteMany: {},
          create: collections.map(collectionId => ({
            collectionId,
          })),
        } : undefined,
      },
      include: {
        images: true,
        variants: true,
        collections: true,
        category: true,
      },
    })
  }

  static async deleteProduct(id: string) {
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) {
      throw new NotFoundError('Product not found')
    }

    return prisma.product.update({
      where: { id },
      data: { isActive: false },
    })
  }

  static async getRelatedProducts(productId: string, limit = 4) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { categoryId: true },
    })

    if (!product) {
      throw new NotFoundError('Product not found')
    }

    return prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: productId },
        isActive: true,
      },
      include: {
        images: true,
      },
      take: limit,
    })
  }
}