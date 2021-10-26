import { PrismaModuleOptions } from './prisma.providers';
import { PrismaClient } from '@prisma/client'
import { createPrismaQueryEventHandler } from 'prisma-query-log'

import logger from 'pino-http'

export class PrismaRepository extends PrismaClient {
  constructor() {
    super({
      errorFormat: 'minimal',
      log: [{
              level: 'query',
              emit: 'event'
          }]
    })
  }
}

