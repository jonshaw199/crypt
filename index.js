/*
https://www.tutorialspoint.com/encrypt-and-decrypt-data-in-nodejs

NodeJS provides inbuilt library crypto to encrypt and decrypt data in NodeJS. 
We can use this library to encrypt data of any type. You can do the cryptographic 
operations on a string, buffer, and even a stream of data. The crypto also holds 
multiple crypto algorithms for encryption. Please check the official resources 
for the same. In this article, we will use the most popular AES (Advanced 
Encryption Standard) for encryption.
*/

import crypto from "crypto";

const algorithm = "aes-256-cbc"; //Using AES encryption
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

//Encrypting text
function encrypt(text) {
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}

// Decrypting text
function decrypt(text) {
  let iv = Buffer.from(text.iv, "hex");
  let encryptedText = Buffer.from(text.encryptedData, "hex");
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Text send to encrypt function
var hw = encrypt("Welcome to Tutorials Point...");
console.log(hw);
console.log(decrypt(hw));
