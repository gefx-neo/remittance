import CryptoJS from "crypto-js";

// Function to parse hexadecimal keys and IVs
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

export default {
  // Set a regular cookie
  setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; Secure";
  },

  // Get a regular cookie
  getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  // Erase a cookie
  eraseCookie(name) {
    document.cookie = name + "=; Max-Age=-99999999;";
  },

  // Set a complex cookie with encryption
  setComplexCookie(name, valueObj, days, key, iv) {
    const value = JSON.stringify(valueObj);
    const { parsedKey, parsedIv } = parseHexKeyIv(key, iv); // Parse dynamic key and IV

    const encryptedValue = CryptoJS.AES.encrypt(value, parsedKey, {
      iv: parsedIv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();

    this.setCookie(name, encryptedValue, days);

    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    console.log(
      `Cookie set: ${name}
       Value: ${value}
       Encrypted value: ${encryptedValue}
       Expires: ${date.toUTCString()}`
    );
  },

  // Get and decrypt a complex cookie
  getComplexCookie(name) {
    const value = this.getCookie(name);
    if (value) {
      try {
        const key = localStorage.getItem("sessionKey");
        const iv = localStorage.getItem("sessionIv");

        if (!key || !iv) {
          console.error("Key or IV is missing");
          return null;
        }

        const { parsedKey, parsedIv } = parseHexKeyIv(key, iv);

        const bytes = CryptoJS.AES.decrypt(value, parsedKey, {
          iv: parsedIv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        });
        const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedValue);
      } catch (e) {
        console.error("Error decrypting cookie:", e);
        return null;
      }
    }
    return null;
  },
};

// Function to encrypt data
function encryptData(plaintext, key, iv) {
  const { parsedKey, parsedIv } = parseHexKeyIv(key, iv); // Parse key and IV

  const encrypted = CryptoJS.AES.encrypt(plaintext, parsedKey, {
    iv: parsedIv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();

  console.log("Encrypted Data:", encrypted);
  return encrypted;
}

// Function to decrypt data
function decryptData(encryptedText, key, iv) {
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

// Example usage
const key = "a1c91b5f95d37b3c48f59861c21156e31e1176f7c5ec3c5512dfb63a70c8ffbd"; // 64-character hex key
const iv = "51d94482ec57e7b0fde837dbf1380eeb"; // 32-character hex IV

const plaintext = "Sensitive data";

// Encrypt the data
const encryptedText = encryptData(plaintext, key, iv);

// Decrypt the data
const decryptedText = decryptData(encryptedText, key, iv);
