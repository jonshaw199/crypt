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
import { fromDir } from "./util.js";

const DEFAULT_ALGO = "aes-256-cbc";
const ENCRYPTED_EXTENSION = ".encrypted";

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
  const str = decryptText(
    fs.readFileSync(inputFilePath, "utf8"),
    key,
    iv,
    algorithm
  );
  fs.writeFileSync(outputFilePath, str);
  return str;
}

export function encryptFilesRegex(startPath, regex, key, iv, algorithm) {
  return fromDir(startPath, regex, (filePath) => {
    try {
      return (
        !filePath.includes(ENCRYPTED_EXTENSION) &&
        encryptFile(
          filePath,
          `${filePath}${ENCRYPTED_EXTENSION}`,
          key,
          iv,
          algorithm
        )
      );
    } catch (e) {
      console.error(`Failed to encrypt ${filePath}: ${e}`);
    }
  });
}

export function decryptFilesRegex(startPath, regex, key, iv, algorithm) {
  return fromDir(startPath, regex, (filePath) => {
    try {
      return decryptFile(
        filePath,
        filePath.substr(0, filePath.indexOf(ENCRYPTED_EXTENSION)),
        key,
        iv,
        algorithm
      );
    } catch (e) {
      console.error(`Failed to decrypt ${filePath}: ${e}`);
    }
  });
}

// CLI
// Example: node index.js -e ./ .env abc 123
const args = process.argv;
if (args.length > 6) {
  const flags = args[2];
  const encrypt = flags.includes("e");
  const startPath = args[3];
  const regex = new RegExp(args[4]);
  const key = args[5].padEnd(32).substr(0, 32);
  const iv = args[6].padEnd(16).substr(0, 16);
  const func = encrypt ? encryptFilesRegex : decryptFilesRegex;
  // Use aes-256-cbc, even if DEFAULT_ALGO changes, because key and iv are sized for aes-256-cbc
  const resultFiles = func(startPath, regex, key, iv, "aes-256-cbc");
  console.log("Files processed:");
  console.log(resultFiles);
}
