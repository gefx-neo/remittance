export function setLocalStorageWithExpiry(key, value, hours) {
  const now = new Date();
  const expiryTime = now.getTime() + hours * 60 * 60 * 1000; // Convert hours to milliseconds
  // const expiryTime = now.getTime() + seconds * 1000; // Seconds for testing

  localStorage.setItem(key, value);
  localStorage.setItem(`${key}_expiry`, expiryTime);
}

// Helper function to get localStorage and check expiration
export function getLocalStorageWithExpiry(key) {
  const value = localStorage.getItem(key);

  if (!value) {
    return null;
  }

  // Retrieve the expiry time
  const expiryTime = localStorage.getItem(`${key}_expiry`);
  const now = new Date().getTime();

  // If the item has expired, remove it and its expiry time from localStorage and return null
  if (now > expiryTime) {
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_expiry`);
    return null;
  }

  // Return the value if not expired
  return value;
}

export function removeLocalStorageWithExpiry(key) {
  localStorage.removeItem(key);
  localStorage.removeItem(`${key}_expiry`);
}
