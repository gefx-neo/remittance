export const validationService = {
  // Helper to trim the value before any validation
  trimValue(value) {
    return value ? value.trim() : "";
  },

  // Trims all form fields before validation
  trimFormFields(form) {
    Object.keys(form).forEach((key) => {
      if (typeof form[key] === "string") {
        form[key] = this.trimValue(form[key]);
      }
    });
  },

  // Common validation methods
  isRequired(value, fieldName) {
    if (!value) {
      return `${fieldName} is required.`;
    }
    return null;
  },

  isValidEmail(value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      return "Invalid e-mail address.";
    }
    return null;
  },

  isAccountTypeSelected(value) {
    if (!value) {
      return "Please select an account type.";
    }
    return null;
  },

  isCompanyName(value, accountType) {
    if (accountType === "Corporate & Trading Company" && !value) {
      return "Registered company name is required for Business accounts.";
    }
    return null;
  },

  isPasswordRules(value) {
    const passwordPattern = /^(?!.*[;':"])(?=.*[A-Z])(?=.*[!@#$&*]).{8,20}$/;
    if (!passwordPattern.test(value)) {
      return "Password must be 8-20 characters, include atleast one capital letter, and one special character";
    }
    return null;
  },

  // Login Step 1
  validateUsername(form) {
    this.trimFormFields(form);

    let errors = {};

    const usernameError =
      this.isRequired(form.username, "E-mail address") ||
      this.isValidEmail(form.username);
    if (usernameError) errors.username = usernameError;

    return errors;
  },

  // Login Step 2
  validatePassword(form) {
    this.trimFormFields(form);

    let errors = {};

    const passwordError = this.isRequired(form.password, "Password");
    if (passwordError) errors.password = passwordError;

    return errors;
  },

  // Forget password Step 2
  validateForgotPassword(form) {
    this.trimFormFields(form);

    let errors = {};

    const codeError = this.isRequired(form.code, "Temporary password");
    if (codeError) errors.code = codeError;

    const passwordError =
      this.isRequired(form.newPassword, "New password") ||
      this.isPasswordRules(form.newPassword);
    if (passwordError) errors.newPassword = passwordError;

    return errors;
  },

  // Register
  validateRegister(form) {
    this.trimFormFields(form);

    let errors = {};

    const surnameError = this.isRequired(form.surname, "Surname");
    if (surnameError) errors.surname = surnameError;

    const givenNameError = this.isRequired(form.givenName, "Given name");
    if (givenNameError) errors.givenName = givenNameError;

    const emailError =
      this.isRequired(form.emailAddress, "E-mail address") ||
      this.isValidEmail(form.emailAddress);
    if (emailError) errors.emailAddress = emailError;

    const accountTypeError = this.isAccountTypeSelected(form.accountType);
    if (accountTypeError) errors.accountType = accountTypeError;

    const companyNameError = this.isCompanyName(
      form.companyName,
      form.accountType
    );
    if (companyNameError) errors.companyName = companyNameError;

    return errors;
  },
};
