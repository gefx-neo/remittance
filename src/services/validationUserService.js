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
    const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,20}$/;
    if (!passwordPattern.test(value)) {
      return "Password must be 8 to 20 characters long, include at least one capital letter and one special character.";
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

  // Account verification Step 1
  validateCorporateForm(corporateForm) {
    this.trimFormFields(corporateForm);

    let errors = {};

    const businessAddressError = this.isRequired(
      corporateForm.businessAddress,
      "Business address"
    );
    if (businessAddressError) errors.businessAddress = businessAddressError;

    const postalCodeError = this.isRequired(
      corporateForm.postalCode,
      "Postal code"
    );
    if (postalCodeError) errors.postalCode = postalCodeError;

    const contactNameError = this.isRequired(
      corporateForm.contactName,
      "Contact name"
    );
    if (contactNameError) errors.contactName = contactNameError;

    const telNumError = this.isRequired(
      corporateForm.telNum,
      "Telephone number"
    );
    if (telNumError) errors.telNum = telNumError;

    const registrationPlaceError = this.isRequired(
      corporateForm.registrationPlace,
      "Registration place"
    );
    if (registrationPlaceError)
      errors.registrationPlace = registrationPlaceError;

    const registrationDateError = this.isRequired(
      corporateForm.registrationDate,
      "Registration date"
    );
    if (registrationDateError) errors.registrationDate = registrationDateError;

    const registrationNoError = this.isRequired(
      corporateForm.registrationNo,
      "Registration number"
    );
    if (registrationNoError) errors.registrationNo = registrationNoError;

    const entityTypeError = this.isRequired(
      corporateForm.entityType,
      "Entity type "
    );
    if (entityTypeError) errors.entityType = entityTypeError;

    return errors;
  },

  validatePersonForm(personForm) {
    this.trimFormFields(personForm);

    let errors = {};

    // Validate common fields
    const nameError = this.isRequired(personForm.name, "Name");
    if (nameError) errors.name = nameError;

    const addressError = this.isRequired(personForm.address, "Address");
    if (addressError) errors.address = addressError;

    const mailAddressError = this.isRequired(
      personForm.mailAddress,
      "Mail address"
    );
    if (mailAddressError) errors.mailAddress = mailAddressError;

    const nationalityError = this.isRequired(
      personForm.nationality,
      "Nationality"
    );
    if (nationalityError) errors.nationality = nationalityError;

    const icError = this.isRequired(personForm.ic, "IC");
    if (icError) errors.ic = icError;

    const dobError = this.isRequired(personForm.dob, "Date of birth");
    if (dobError) errors.dob = dobError;

    const contactHomeError = this.isRequired(
      personForm.contactHome,
      "Contact no. (Home)"
    );
    if (contactHomeError) errors.contactHome = contactHomeError;

    const contactOfficeError = this.isRequired(
      personForm.contactOffice,
      "Contact no. (Office)"
    );
    if (contactOfficeError) errors.contactOffice = contactOfficeError;

    const contactMobileError = this.isRequired(
      personForm.contactMobile,
      "Contact no. (Mobile)"
    );
    if (contactMobileError) errors.contactMobile = contactMobileError;

    const employmentTypeError = this.isRequired(
      personForm.naturalEmploymentType,
      "Employment type"
    );
    if (employmentTypeError) errors.naturalEmploymentType = employmentTypeError;

    // Validate fields if employed
    if (personForm.naturalEmploymentType === "employed") {
      const employerNameError = this.isRequired(
        personForm.employerName,
        "Employer name"
      );
      if (employerNameError) errors.employerName = employerNameError;

      const employerJobTitleError = this.isRequired(
        personForm.employerJobTitle,
        "Job title"
      );
      if (employerJobTitleError)
        errors.employerJobTitle = employerJobTitleError;

      const employerAddressError = this.isRequired(
        personForm.employerAddress,
        "Employer address"
      );
      if (employerAddressError) errors.employerAddress = employerAddressError;
    }

    // Validate fields if self-employed
    if (personForm.naturalEmploymentType === "selfEmployed") {
      const businessNameError = this.isRequired(
        personForm.businessName,
        "Business name"
      );
      if (businessNameError) errors.businessName = businessNameError;

      const businessRegistrationNoError = this.isRequired(
        personForm.businessRegistrationNo,
        "Business registration number"
      );
      if (businessRegistrationNoError)
        errors.businessRegistrationNo = businessRegistrationNoError;

      const businessAddressError = this.isRequired(
        personForm.businessAddress,
        "Business address"
      );
      if (businessAddressError) errors.businessAddress = businessAddressError;

      const businessPlaceError = this.isRequired(
        personForm.businessPlace,
        "Principal place of business"
      );
      if (businessPlaceError) errors.businessPlace = businessPlaceError;
    }

    return errors;
  },
};
