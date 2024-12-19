export const formatNumber = (value) => {
  const number = parseFloat(value);
  if (isNaN(number)) return "";

  // Format without unnecessary decimals
  return number % 1 === 0
    ? number.toLocaleString() // No decimal places for whole numbers
    : number.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
};

export const getTransactionStatus = (statusCode) => {
  switch (statusCode) {
    case 1:
      return "Success";
    case 2:
      return "Pending";
    case 3:
      return "Rejected";
    default:
      return "Unknown";
  }
};

export const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  if (isNaN(date.getTime())) return "Invalid Date";

  // Manually format the date
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  // Format the time as "05:27 PM"
  const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";

  return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
};
