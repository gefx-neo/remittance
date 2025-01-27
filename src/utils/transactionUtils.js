export const formatNumber = (value) => {
  const number = parseFloat(value);
  if (isNaN(number)) return "";

  // Format without unnecessary decimals
  return number % 1 === 0
    ? number.toLocaleString() // No decimal places for whole numbers
    : number.toLocaleString(undefined, {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      });
};

export const getTransactionStatus = (statusCode) => {
  switch (statusCode) {
    case 0:
      return "Failed";
    case 1:
      return "Success";
    case 2:
      return "Unpaid";
    case 3:
      return "Pending";
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

export const getTotalAmount = (sendingAmount = 0, fee = 0) => {
  const total = parseFloat(sendingAmount) + parseFloat(fee || 0);
  return isNaN(total) ? 0 : total;
};
