/*
Modified from https://www.tutorialspoint.com/encrypt-and-decrypt-data-in-nodejs

NodeJS provides inbuilt library crypto to encrypt and decrypt data in NodeJS. 
We can use this library to encrypt data of any type. You can do the cryptographic 
operations on a string, buffer, and even a stream of data. The crypto also holds 
multiple crypto algorithms for encryption. Please check the official resources 
for the same. In this article, we will use the most popular AES (Advanced 
Encryption Standard) for encryption.
*/

import crypto from "crypto";
import fs from "fs";

const DEFAULT_ALGO = "aes-256-cbc";

export function encryptText(text, key, iv, algorithm = DEFAULT_ALGO) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString("hex");
}

export function decryptText(
  encryptedHexText,
  key,
  iv,
  algorithm = DEFAULT_ALGO
) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(Buffer.from(encryptedHexText, "hex"));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

export function encryptFile(inputFilePath, outputFilePath, key, iv, algorithm) {
  const str = encryptText(fs.readFileSync(inputFilePath), key, iv, algorithm);
  fs.writeFileSync(outputFilePath, str);
  return str;
}

export function decryptFile(inputFilePath, outputFilePath, key, iv, algorithm) {
  const inputStr = fs.readFileSync(inputFilePath, "utf8");
  const str = decryptText(inputStr, key, iv, algorithm);
  fs.writeFileSync(outputFilePath, str);
  return str;
}

// CLI
const args = process.argv;
if (args.length > 5) {
  const flags = args[2];
  const encrypt = flags.includes("e");
  const inputFilePath = args[3];
  const outputFilePath = args[4];
  const key = args[5];
  const iv = args[6];
  const algorithm = args.length > 6 ? args[7] : null;
  const func = encrypt ? encryptFile : decryptFile;
  try {
    const result = func(inputFilePath, outputFilePath, key, iv, algorithm);
    console.log("result:\n" + result);
  } catch (e) {
    console.error(`Failed to ${encrypt ? "encrypt" : "decrypt"}; ${e}`);
  }
}
