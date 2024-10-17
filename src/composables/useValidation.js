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
    clearErrors,
    scrollToErrors,
    scrollToTop,
  };
}
