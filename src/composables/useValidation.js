// src/composables/useValidation.js
import { reactive } from "vue";
import { validationService } from "@/services/validationService";

export function useValidation() {
  const errors = reactive({});

  const validateForm = (form, schema) => {
    clearErrors();

    // Trim form fields
    validationService.trimFormFields(form);

    // Validate the form against the provided schema
    const validationErrors = validationService.validateForm(schema);

    // Assign validation errors
    Object.keys(schema).forEach((field) => {
      if (!validationErrors[field]) errors[field] = ""; // Clear error if validation passes
    });
    Object.assign(errors, validationErrors);

    return !Object.values(errors).some((error) => error); // Return true if no errors
  };

  const formatAmount = (amount) => {
    return parseFloat(amount).toLocaleString("en-US");
  };

  const validateSendingAmount = (amount, currency, schema) => {
    const minSending = schema[currency]?.min || 0;
    const maxSending = schema[currency]?.max || Infinity;

    if (amount < minSending) {
      errors.sendingAmount = `The lowest amount you can send is ${formatAmount(
        minSending
      )} ${currency}.`;
    } else if (amount > maxSending) {
      errors.sendingAmount = `The highest amount you can send is ${formatAmount(
        maxSending
      )} ${currency}.`;
    } else {
      errors.sendingAmount = null;
    }
  };

  const validateReceivingAmount = (amount, currency, schema) => {
    const minReceiving = schema[currency]?.min || 0;
    const maxReceiving = schema[currency]?.max || Infinity;

    if (amount < minReceiving) {
      errors.receivingAmount = `The lowest amount you can receive is ${formatAmount(
        minReceiving
      )} ${currency}.`;
    } else if (amount > maxReceiving) {
      errors.receivingAmount = `The highest amount you can receive is ${formatAmount(
        maxReceiving
      )} ${currency}.`;
    } else {
      errors.receivingAmount = null;
    }
  };

  const clearErrors = () => {
    Object.keys(errors).forEach((key) => (errors[key] = ""));
  };

  const scrollToFirstError = (errors) => {
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

  const scrollToErrors = () => {
    scrollToFirstError(errors);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return {
    errors,
    validateForm,
    validateSendingAmount,
    validateReceivingAmount,
    clearErrors,
    scrollToErrors,
    scrollToTop,
  };
}
