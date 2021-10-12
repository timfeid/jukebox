import Netgear from 'netgear'
const router = new Netgear()

let devices: Netgear.Device[] = []
let lastRefresh: number | null = null

const options = {
  password: process.env.NETGEAR_PASSWORD,
  host: process.env.NETGEAR_GATEWAY,
  port: parseInt(process.env.NETGEAR_PORT, 10) || 80,
}

function login () {
  return router.login(options)
}

let retries = 0
async function refreshDevices () {
  try {
    devices = await router.getAttachedDevices()
    lastRefresh = new Date().getTime()
    console.log('Retreived devices!')
    retries = 0
  } catch (e) {
    if (retries++ < 1) {
      try {
        await login()
        await refreshDevices()
      } catch (e) {
        console.log(e)
      }
    }
  }
}

function findDeviceByIp(ip: string) {
  return devices.find(device => device.IP === ip)
}

function needsRefreshing() {
  return lastRefresh === null || lastRefresh < (new Date().getTime() - 30000)
}

const convertIp = (ip: string) => {
  if (ip.startsWith('::ffff:')) {
    return ip.substr(7)
  }
  return ip.startsWith('::') ? '10.30.0.18' : ip
}

export async function getDeviceByIp(ip: string) : Promise<Netgear.Device | null> {
  console.log(ip)
  ip = convertIp(ip)
  console.log(ip)
  const device = findDeviceByIp(ip)
  if (!device && needsRefreshing()) {
    console.log('Needs a refresh...')
    await refreshDevices()
    return await getDeviceByIp(ip)
  }

  return device
}
