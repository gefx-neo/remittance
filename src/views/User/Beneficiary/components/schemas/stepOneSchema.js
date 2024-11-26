import { validationService } from "@/services/validationService";

export const formValidation = (form) => ({
  name: {
    value: form.name || "",
    label: "Beneficiary's friendly name",
    rules: [validationService.isRequired],
  },
  fullName: {
    value: form.fullName || "",
    label: "Account holder name",
    rules: [validationService.isRequired],
  },
  contactMobile: {
    value: form.contactMobile || "",
    label: "Contact no. (Mobile)",
    rules: [validationService.isRequired, validationService.isPhoneNumber],
  },
  address: {
    value: form.address || "",
    label: "Address",
    rules: [validationService.isRequired],
  },
  ...(form.beneficiaryType === 1 && {
    registrationNo: {
      value: form.registrationNo || "",
      label: "Beneficiary's company registration number",
      rules: [validationService.isRequired],
    },
    registrationPlace: {
      value: form.registrationPlace || "",
      label: "Beneficiary's country of incorporation",
      rules: [validationService.isRequired],
    },
    ...(form.registrationPlace === "OTHERS" && {
      otherRegistrationPlace: {
        value: form.otherRegistrationPlace || "",
        label: "Other beneficiary's country of incorporation",
        rules: [validationService.isRequired],
      },
    }),
    businessCategory: {
      value: form.businessCategory || "",
      label: "Business category",
      rules: [validationService.isRequired],
    },
    ...(form.businessCategory === 331 && {
      otherBusinessCategory: {
        value: form.otherBusinessCategory || "",
        label: "Other business category",
        rules: [validationService.isRequired],
      },
    }),
    companyContactNo: {
      value: form.companyContactNo || "",
      label: "Company's contact number",
      rules: [validationService.isRequired, validationService.isPhoneNumber],
    },
  }),
  ...(form.beneficiaryType === 0 && {
    nationality: {
      value: form.nationality || "",
      label: "Nationality",
      rules: [validationService.isRequired],
    },
    ...(form.nationality === "OTHERS" && {
      otherNationality: {
        value: form.otherNationality || "",
        label: "Other nationality",
        rules: [validationService.isRequired],
      },
    }),
    docIC: {
      value: form.docIC || "",
      label: "Photocopy of IC",
      rules: [validationService.isRequired],
    },
    dob: {
      value: form.dob || "",
      label: "Date of birth",
      rules: [validationService.isRequired],
    },
  }),
});
