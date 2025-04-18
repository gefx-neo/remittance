export const formatNumber = (value) => {
  const number = parseFloat(value);
  if (isNaN(number)) return "0";

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
    case 0:
      return "Rejected";
    case 1:
      return "Completed";
    case 2:
      return "Unpaid";
    case 3:
      return "Pending";
    case 4:
      return "Cancelled";
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

  // Format the time in 24-hour format
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day} ${month} ${year}, ${hours}:${minutes}`;
};
