import { UpdateUserRole } from './interface/update-user-role';
import { Prisma } from '@prisma/client'
import { UserRepository } from './user.repository'

export class UserService {
  private repository = new UserRepository()

  async create(data: Prisma.UserCreateInput) {
    return this.repository.create({ data })
  }

  async findAllUsers() {
    return this.repository.findMany()
  }

  async findUserByUnique(username: string, email: string) {
    return this.repository.findUnique({
      where: {
        username: username,
        email: email
      }
    })
  }

  async findUserById(id: string) {
    return this.repository.findUnique({
      where: {
        id: id
      },
      include: {
        orderHistory: true
      }
    })
  }

  async findUserByUniqueEmail(email: string) {
    return this.repository.findUnique({
      where: {
        email: email
      }
    })
  }

  async updateUserRole(data: UpdateUserRole) {
    return await this.repository.update({
      where: {
        id: data.userId
      },
      data: {
        role: data.role
      }
    })
  }

  async usersCount() {
    return await this.repository.count()
  }
}
