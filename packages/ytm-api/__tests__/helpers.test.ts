import { gql } from 'apollo-server-core'
import {expect} from 'chai'
import * as helpers from '../src/helpers'

describe("helpers", () => {
  it('generates authorization token', async () => {
    expect(helpers.generateAuthToken("VISITOR_INFO1_LIVE=4jUYwR8uNcA; LOGIN_INFO=AFmmF2swRQIgXf1i7nU-fbutwSRe0SpnUiz9DS90f0YpJp7hnSr4cC0CIQC41w3YjZMM5VZx53Y7nI8yZXLvMxnzpuG892JWhJusyQ:QUQ3MjNmeExqTEhfRnhlM0FxSlk5X1QtRERZRlYyU1hoTnl6M2FscWhwenZfWVJjRXlhQjVINXZFNmRBTFd1WW44TUV6Qkpya2dZc3JOTE5KdnlUUHV5dk9KMzZwWEJaaWE2em9TX2JPVWJpMk5VczRIZGJ0TC1vam1UUVlxUGV2Z285QmZZNWF5SDFSNDBZN24ydTV6UUItcnp4MnFYOEI4WDBmNHlISWw3ZWZ5UXozb0xSS1Aw; PREF=f6=480&volume=100&tz=America.New_York&location_based_recommendations=2&al=en&f4=4000000; YSC=liHrUeZ2h1M; wide=0; SID=9Qc3XybL5esFT6FvssgQAf9AJA_hbr74pz_TZ1qFj6aMwUzEkJZ8kcBnzAP0fRdJ8oUGhg.; __Secure-3PSID=9Qc3XybL5esFT6FvssgQAf9AJA_hbr74pz_TZ1qFj6aMwUzE_wyBJYShp28wuJ_6HwpsrA.; HSID=Ay9CX0b1h8S7x44En; SSID=APp9459gopjycWw_u; APISID=gXD2ulRSB4Tq4EbD/AQZn0g_3L-iFFqyFN; SAPISID=mFFa3QFWerAnttvl/AvcRRKE9yBalMQGab; __Secure-3PAPISID=mFFa3QFWerAnttvl/AvcRRKE9yBalMQGab; SIDCC=AJi4QfGmp50jE0vCMsgwXxlMHlwd_X3LUrvx70bsRZDZo1MNMOzH3TlzYt10Q0vdvBCqf6bRJAY; __Secure-3PSIDCC=AJi4QfGphyNB0-EpoP5oMJmA-DwLYSjqk9XmqNZ2D0XD5rYv9ELyFKa4h5dayLD2-COguOWAxhWE")).to.be.string
  })
})
