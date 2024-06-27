import CryptoJS from "crypto-js";

const secretKey = import.meta.env.VITE_APP_SECRET_KEY;

export default {
  setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  },

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

  eraseCookie(name) {
    document.cookie = name + "=; Max-Age=-99999999;";
  },

  setComplexCookie(name, valueObj, days) {
    const value = JSON.stringify(valueObj);
    const encryptedValue = CryptoJS.AES.encrypt(value, secretKey).toString();
    this.setCookie(name, encryptedValue, days);
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    // Value: ${value},
    console.log(
      `Cookie set: ${name}

Encrypted value: ${encryptedValue}, 

Expires: ${date.toUTCString()}`
    );
  },

  getComplexCookie(name) {
    const value = this.getCookie(name);
    if (value) {
      const bytes = CryptoJS.AES.decrypt(value, secretKey);
      const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
      // console.log("Decrypted Value", decryptedValue);
      return JSON.parse(decryptedValue);
    }
    return null;
  },
};
