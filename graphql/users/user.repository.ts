import { PrismaRepository } from './../../commons/prisma/prisma.repository';

export class UserRepository {
  prisma = new PrismaRepository()

  findMany = this.prisma.user.findMany
  findUnique = this.prisma.user.findUnique
  create = this.prisma.user.create
  update = this.prisma.user.update
  count = this.prisma.user.count
}
