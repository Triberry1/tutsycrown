import { prisma } from '../../config/prisma'
import { NotFoundError, ConflictError } from '../../utils/errors'
import { CreateUserInput, UpdateUserInput } from './user.types'

export class UserService {
  static async listUsers() {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        clerkUserId: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    })
  }

  static async getUserByClerkId(clerkUserId: string) {
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      include: {
        addresses: true,
        orders: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!user) {
      throw new NotFoundError('User not found')
    }

    return user
  }

  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
      },
    })

    if (!user) {
      throw new NotFoundError('User not found')
    }

    return user
  }

  static async createUser(data: CreateUserInput & { clerkUserId: string }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      throw new ConflictError('User with this email already exists')
    }

    return prisma.user.create({
      data: {
        clerkUserId: data.clerkUserId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      },
    })
  }

  static async updateUser(id: string, data: UpdateUserInput) {
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) {
      throw new NotFoundError('User not found')
    }

    return prisma.user.update({
      where: { id },
      data,
    })
  }

  static async syncClerkUser(clerkUserId: string, email: string, data?: Partial<CreateUserInput>) {
    const existingUser = await prisma.user.findUnique({
      where: { clerkUserId },
    })

    if (existingUser) {
      return prisma.user.update({
        where: { clerkUserId },
        data: {
          email,
          ...data,
        },
      })
    }

    return prisma.user.create({
      data: {
        clerkUserId,
        email,
        ...data,
      },
    })
  }

  static async getUserAddresses(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        addresses: true,
      },
    })

    if (!user) {
      throw new NotFoundError('User not found')
    }

    return user.addresses
  }

  static async addAddress(userId: string, addressData: any) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new NotFoundError('User not found')
    }

    return prisma.address.create({
      data: {
        ...addressData,
        userId,
      },
    })
  }
}