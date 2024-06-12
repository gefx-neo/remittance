export default {
  setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
    // console.log(`Cookie set: ${name}, Expires: ${expires}`); // Log the cookie expiration time
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
    this.setCookie(name, value, days);
    // Log the cookie value and expiration date
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    console.log(
      `Complex cookie set: ${name}, Value: ${value}, Expires: ${date.toUTCString()}`
    );
  },

  getComplexCookie(name) {
    const value = this.getCookie(name);
    return value ? JSON.parse(value) : null;
  },
};
