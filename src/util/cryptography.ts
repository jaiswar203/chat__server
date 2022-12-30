import CryptoJS from "crypto-js"
import dotenv from "dotenv"
dotenv.config()

const SECRET=process.env.SECURE_KEY

export function encrypt(message: string):string {
  const cipher=CryptoJS.AES.encrypt(message,SECRET).toString()
  return cipher
}

export function decrypt(data:string):string {
  const bytes=CryptoJS.AES.decrypt(data,SECRET)
  const text=bytes.toString(CryptoJS.enc.Utf8)

  return text
}