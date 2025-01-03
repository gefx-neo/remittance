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
  console.log("Decrypted Data:", plaintext);
  return plaintext;
}

const SECRET_KEY = "afsdg"; // Use a secure key

// Encrypt data
export const encryptQueryParams = (data) => {
  const stringifiedData = JSON.stringify(data);
  return CryptoJS.AES.encrypt(stringifiedData, SECRET_KEY).toString();
};

// Decrypt data
export const decryptQueryParams = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error("Failed to decrypt query parameters:", error);
    return null; // Handle decryption failures gracefully
  }
};
