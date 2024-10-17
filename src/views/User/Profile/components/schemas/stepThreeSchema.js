import { validationService } from "@/services/validationService";

export const corporateValidation = (corporateForm) => ({
  docAccOpening: {
    value: corporateForm?.docAccOpening || "",
    label: "Account opening form",
    rules: [validationService.isFileRequired],
  },
  docPhotoID: {
    value: corporateForm?.docPhotoID || "",
    label: "Photo ID",
    rules: [validationService.isFileRequired],
  },
  docSelfie: {
    value: corporateForm?.docSelfie || "",
    label: "Selfie with Photo ID",
    rules: [validationService.isFileRequired],
  },
  docDirectorIC: {
    value: corporateForm?.docDirectorIC || "",
    label: "Director's identity card",
    rules: [validationService.isFileRequired],
  },
  docAcra: {
    value: corporateForm?.docAcra || "",
    label: "Company business profile (ACRA)",
    rules: [validationService.isFileRequired],
  },
});

export const individualValidation = (individualForm) => ({
  docIC: {
    value: individualForm?.docIC || "",
    label: "IC / Passport copy",
    rules: [validationService.isFileRequired],
  },
  docSelfie: {
    value: individualForm?.docSelfie || "",
    label: "Selfie with Photo ID",
    rules: [validationService.isFileRequired],
  },
  docCard: {
    value: individualForm?.docCard || "",
    label: "Business / Name card",
    rules: [validationService.isFileRequired],
  },
  docKYC: {
    value: individualForm?.docKYC || "",
    label: "KYC Form",
    rules: [validationService.isFileRequired],
  },
});
