export const validationService = {
  // Common validation methods
  isRequired(value, fieldName) {
    if (!value || value.trim() === "") {
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

  validateCompanyName(value, accountType) {
    if (accountType === "Corporate & Trading Company" && !value.trim()) {
      return "Registered company name is required for Business accounts.";
    }
    return null;
  },

  // Validation for Step 1: Username (Email) input
  validateUsername(form) {
    let errors = {};

    const usernameError =
      this.isRequired(form.username, "E-mail address") ||
      this.isValidEmail(form.username);
    if (usernameError) errors.username = usernameError;

    return errors;
  },

  validatePassword(form) {
    let errors = {};

    const passwordError = this.isRequired(form.password, "Password");
    if (passwordError) errors.password = passwordError;

    return errors;
  },

  // New password validation for Step 2
  validatePasswordRules(value) {
    const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,12}$/;
    if (!passwordPattern.test(value)) {
      return "Password must be 8 to 12 characters long, include at least one capital letter and one special character.";
    }
    return null;
  },

  // Validation for Step 2: Code and New Password
  validateStep2(form) {
    let errors = {};

    const codeError = this.isRequired(form.code, "Temporary password");
    if (codeError) errors.code = codeError;

    const newPasswordError =
      this.isRequired(form.newPassword, "New password") ||
      this.validatePasswordRules(form.newPassword);
    if (newPasswordError) errors.newPassword = newPasswordError;

    return errors;
  },

  // Validation for the entire Registration form
  validateRegister(form) {
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

    const companyNameError = this.validateCompanyName(
      form.companyName,
      form.accountType
    );
    if (companyNameError) errors.companyName = companyNameError;

    return errors;
  },
};
