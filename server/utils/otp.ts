import { config } from 'dotenv'
import { generateCode, sendMail } from './lib'
import { prisma } from './prisma'

config()
export async function sendOTP(email: string) {
  const otp = process.env.MODE == 'DEV' ? '000000' : generateCode(6)

  if (process.env.MODE == 'DEV') {
    console.log('OTP: ', otp)
  } else {
    await sendMail({
      email: email,
      subject: 'OTP Verification',
      html: `Your OTP is ${otp}`,
    })
  }

  return otp
}

export async function verifyOTP(email: string, code: string) {
  const account = await prisma.account.findUnique({
    where: {
      email: email.trim().toLowerCase(),
    },
  })

  if (!account) {
    return false
  }
  if (account.code !== code) {
    return false
  }
  if (!account.codeExpiry || account.codeExpiry < new Date()) {
    return false
  }
  return true
}
