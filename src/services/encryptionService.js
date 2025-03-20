import CryptoJS from "crypto-js";

// Function to parse Hex key and IV
function parseHexKeyIv(key, iv) {
  if (!key || !iv) {
    throw new Error(
      "Key or IV is undefined. Cannot proceed with encryption/decryption."
    );
  }
  return {
    parsedKey: CryptoJS.enc.Hex.parse(key),
    parsedIv: CryptoJS.enc.Hex.parse(iv),
  };
}

// Function to encrypt data
export function encryptData(plaintext, key, iv) {
  const { parsedKey, parsedIv } = parseHexKeyIv(key, iv); // Parse key and IV

  const encrypted = CryptoJS.AES.encrypt(plaintext, parsedKey, {
    iv: parsedIv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();

  return encrypted;
}

// Function to decrypt data
export function decryptData(encryptedText, key, iv) {
  const { parsedKey, parsedIv } = parseHexKeyIv(key, iv); // Parse key and IV

  const decrypted = CryptoJS.AES.decrypt(encryptedText, parsedKey, {
    iv: parsedIv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
  return plaintext;
}
