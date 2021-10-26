import { PrismaRepository } from './../../commons/prisma/prisma.repository';

export class OrderRepository {
  prisma = new PrismaRepository()

  findUnique = this.prisma.order.findUnique
  findMany = this.prisma.order.findMany
  create = this.prisma.order.create
  update = this.prisma.order.update
  count = this.prisma.order.count
}
