export const validationService = {
  trimValue(value) {
    // return value ? value.trim() : value;
    // Ensure the value is a string and not a File or object before trimming
    return typeof value === "string" ? value.trim() : value;
  },

  // Trims all form fields before validation
  trimFormFields(form) {
    Object.keys(form).forEach((key) => {
      if (typeof form[key] === "string") {
        form[key] = this.trimValue(form[key]);
      }
    });
  },

  // Generic validation to check required fields with the field label
  isRequired(value, label) {
    return value && value !== "" ? null : `${label} is required.`;
  },

  // Validation to ensure a file is uploaded
  isFileRequired(value, label) {
    // Check if the value is a File or an array of files (for multiple file input)
    if (value instanceof File || (Array.isArray(value) && value.length > 0)) {
      return null;
    }
    return `${label} is required.`;
  },

  // Email validation
  isEmail(value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value) ? null : "Invalid email format.";
  },

  // Phone number validation
  isPhoneNumber(value, label) {
    const phonePattern = /^[0-9\s\-+()]*$/;
    if (!phonePattern.test(value)) {
      return `Invalid ${label.toLowerCase()} format.`;
    }
  },

  isWithinRange(value, label, { min = 0, max = Infinity } = {}) {
    if (value < min || value > max) {
      return `${label} must be between ${min} and ${max}.`;
    }
    return null; // No error
  },

  // Validate form based on a schema
  validateForm(validationSchema) {
    const errors = {};

    // Trim all values in the schema
    const trimmedSchema = Object.keys(validationSchema).reduce((acc, field) => {
      acc[field] = {
        ...validationSchema[field],
        value: this.trimValue(validationSchema[field].value),
      };
      return acc;
    }, {});

    Object.keys(trimmedSchema).forEach((field) => {
      const { value, label, rules } = trimmedSchema[field];

      if (!rules || !Array.isArray(rules)) {
        console.warn(`No rules defined for field: ${field}`);
        return;
      }

      for (const rule of rules) {
        const error = rule(value, label);
        if (error) {
          errors[field] = error;
          break; // Stop at the first error
        }
      }
    });
    return errors;
  },
};
