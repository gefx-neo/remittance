import { validationService } from "@/services/validationService";

export const formValidation = (form) => ({
  paymentDetail: {
    value: form.paymentDetail || "",
    label: "Payment details / instructions",
    rules: [validationService.isRequired],
  },
  paymentDetail: {
    value: form.rel || "",
    label:
      "Purpose and intended nature of account relationship and/or relevant business transaction undertaken",
    rules: [validationService.isRequired],
  },
  purposeOfIntendedTransactions: {
    value: form.purposeOfIntendedTransactions || "",
    label: "Purpose of intended transactions",
    rules: [validationService.isRequired],
  },
  ...(form.purposeOfIntendedTransactions === "Others" && {
    otherPurposeOfIntendedTransactions: {
      value: form.otherPurposeOfIntendedTransactions || "",
      label: "Other purpose of intended transactions",
      rules: [validationService.isRequired],
    },
  }),
  fundSource: {
    value: form.fundSource || "",
    label: "Source of funds",
    rules: [validationService.isRequired],
  },
  ...(form.fundSource === "Others" && {
    otherFundSource: {
      value: form.otherFundSource || "",
      label: "Other source of funds",
      rules: [validationService.isRequired],
    },
  }),
});
