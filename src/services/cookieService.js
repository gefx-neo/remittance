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
    const ca = document.cookie.split("; ");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  // Erase a cookie
  eraseCookie(name) {
    document.cookie = name + "=; Max-Age=-99999999; path=/;";
  },

  // Set a complex cookie with encryption (using the provided hex and iv)
  setComplexCookie(name, valueObj, days, key, iv) {
    const value = JSON.stringify({
      username: valueObj.username,
      token: valueObj.token,
      deviceId: valueObj.deviceId,
    });

    // Encrypt the value using the provided key and iv
    const { parsedKey, parsedIv } = parseHexKeyIv(key, iv);
    const encryptedValue = CryptoJS.AES.encrypt(value, parsedKey, {
      iv: parsedIv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();

    this.setCookie(name, encryptedValue, days);

    // Log the original and encrypted values for debugging
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    console.log(
      `Cookie set: ${name}
       Original Value: ${value}
       Encrypted Value: ${encryptedValue}
       Expires: ${date.toUTCString()}`
    );
  },

  // Get and decrypt a complex cookie
  getComplexCookie(name, key, iv) {
    const encryptedValue = this.getCookie(name);
    if (encryptedValue) {
      try {
        const { parsedKey, parsedIv } = parseHexKeyIv(key, iv);

        const bytes = CryptoJS.AES.decrypt(encryptedValue, parsedKey, {
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
