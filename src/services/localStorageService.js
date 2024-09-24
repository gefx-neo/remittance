export function setLocalStorageWithExpiry(key, value, hours) {
  const now = new Date();
  const expiryTime = now.getTime() + hours * 60 * 60 * 1000; // Convert hours to milliseconds
  //   const expiryTime = now.getTime() + seconds * 1000; // Seconds for testin

  // Set value in localStorage
  localStorage.setItem(key, value);

  // Set expiry time in a separate key
  localStorage.setItem(`${key}_expiry`, expiryTime);
}

// Helper function to get localStorage and check expiration
export function getLocalStorageWithExpiry(key) {
  // Retrieve the value
  const value = localStorage.getItem(key);

  // If the value doesn't exist, return null
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

// Helper function to remove localStorage item and its expiry
export function removeLocalStorageWithExpiry(key) {
  // Remove the value
  localStorage.removeItem(key);

  // Remove the expiry time
  localStorage.removeItem(`${key}_expiry`);
}
