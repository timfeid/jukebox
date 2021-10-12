import { Service } from 'typedi'
import { prisma } from '../prisma-client'
import { getDeviceByIp } from '../router'

@Service()
export class UserService {
  async getUser(ip: string) {
    const device = await getDeviceByIp(ip)
    if (device) {
      return await prisma.user.upsert({
        where: {
          mac: device.MAC,
        },
        create: {
          mac: device.MAC,
          name: device.Name,
        },
        update: {},
      })
    }
  }
}
