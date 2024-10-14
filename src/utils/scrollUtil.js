export const scrollToFirstError = (errors) => {
  const errorKeys = Object.keys(errors);

  // Find the first key in the errors object with a truthy error value
  const firstErrorKey = errorKeys.find((key) => errors[key]);

  if (firstErrorKey) {
    const errorElement = document.getElementById(firstErrorKey);
    if (errorElement) {
      // Scroll smoothly to the first error input
      errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
};

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
