import { validationService } from "@/services/validationService";

export const corporateValidation = (corporateForm) => ({
  registeredName: {
    value: corporateForm?.registeredName || "",
    label: "Registered name",
    rules: [validationService.isRequired],
  },
  businessAddress: {
    value: corporateForm?.businessAddress || "",
    label: "Business address",
    rules: [validationService.isRequired],
  },
  postalCode: {
    value: corporateForm?.postalCode || "",
    label: "Postal code",
    rules: [validationService.isRequired],
  },
  mailAddress: {
    value: corporateForm?.mailAddress || "",
    label: "Mailing address",
    rules: [validationService.isRequired],
  },
  mailPostalCode: {
    value: corporateForm?.mailPostalCode || "",
    label: "Mailing postal code",
    rules: [validationService.isRequired],
  },
  contactName: {
    value: corporateForm?.contactName || "",
    label: "Contact name",
    rules: [validationService.isRequired],
  },
  operationCountry: {
    value: corporateForm?.operationCountry || "",
    label: "Country of operation",
    rules: [validationService.isRequired],
  },
  telNum: {
    value: corporateForm?.telNum || "",
    label: "Telephone number",
    rules: [validationService.isRequired, validationService.isPhoneNumber],
  },
  contactMobile: {
    value: corporateForm?.contactMobile || "",
    label: "Contact no. (Mobile)",
    rules: [validationService.isRequired],
  },
  ic: {
    value: corporateForm?.ic || "",
    label: "IC / Passport no.",
    rules: [validationService.isRequired],
  },
  jobTitle: {
    value: corporateForm?.jobTitle || "",
    label: "Job title",
    rules: [validationService.isRequired],
  },
  nationality: {
    value: corporateForm?.nationality || "",
    label: "Nationality",
    rules: [validationService.isRequired],
  },
  dob: {
    value: corporateForm?.dob || "",
    label: "Date of birth",
    rules: [validationService.isRequired],
  },
  registrationPlace: {
    value: corporateForm?.registrationPlace || "",
    label: "Place of registration",
    rules: [validationService.isRequired],
  },
  registrationDate: {
    value: corporateForm?.registrationDate || "",
    label: "Date of registration",
    rules: [validationService.isRequired],
  },
  registrationNo: {
    value: corporateForm?.registrationNo || "",
    label: "Registration no.",
    rules: [validationService.isRequired],
  },
  otherEntity: {
    value: corporateForm?.otherEntity || "",
    label: "Type of entity (others)",
    rules: [validationService.isRequired],
  },
  surname: {
    value: corporateForm?.surname || "",
    label: "Surname",
    rules: [validationService.isRequired],
  },
  givenName: {
    value: corporateForm?.givenName || "",
    label: "Given name",
    rules: [validationService.isRequired],
  },
});

export const individualValidation = (individualForm) => ({
  name: {
    value: individualForm?.name || "",
    label: "Name",
    rules: [validationService.isRequired],
  },
  address: {
    value: individualForm?.address || "",
    label: "Permanent address",
    rules: [validationService.isRequired],
  },
  postalCode: {
    value: individualForm?.postalCode || "",
    label: "Permanent postal code",
    rules: [validationService.isRequired],
  },
  mailAddress: {
    value: individualForm?.mailAddress || "",
    label: "Mailing address",
    rules: [validationService.isRequired],
  },
  mailPostalCode: {
    value: individualForm?.mailPostalCode || "",
    label: "Mailing postal code",
    rules: [validationService.isRequired],
  },
  nationality: {
    value: individualForm?.nationality || "",
    label: "Nationality",
    rules: [validationService.isRequired],
  },
  ic: {
    value: individualForm?.ic || "",
    label: "IC/Passport No.",
    rules: [validationService.isRequired],
  },
  dob: {
    value: individualForm?.dob || "",
    label: "Date of birth",
    rules: [validationService.isRequired],
  },
  contactMobile: {
    value: individualForm?.contactMobile || "",
    label: "Contact no. (Mobile)",
    rules: [validationService.isRequired, validationService.isPhoneNumber],
  },
  surname: {
    value: individualForm?.surname || "",
    label: "Surname",
    rules: [validationService.isRequired],
  },
  givenName: {
    value: individualForm?.givenName || "",
    label: "Given name",
    rules: [validationService.isRequired],
  },
  employerName: {
    value: individualForm?.employerName || "",
    label: "Name of employer",
    rules: [validationService.isRequired],
  },
  employerJobTitle: {
    value: individualForm?.employerJobTitle || "",
    label: "Job title",
    rules: [validationService.isRequired],
  },
  employerAddress: {
    value: individualForm?.employerAddress || "",
    label: "Registered address of employer",
    rules: [validationService.isRequired],
  },
  businessName: {
    value: individualForm?.businessName || "",
    label: "Name of business",
    rules: [validationService.isRequired],
  },
  businessRegistrationNo: {
    value: individualForm?.businessRegistrationNo || "",
    label: "Business registration no.",
    rules: [validationService.isRequired],
  },
  businessAddress: {
    value: individualForm?.businessAddress || "",
    label: "Registered business address",
    rules: [validationService.isRequired],
  },
  businessPlace: {
    value: individualForm?.businessPlace || "",
    label: "Principal place of business",
    rules: [validationService.isRequired],
  },
});
