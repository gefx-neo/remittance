import { validationService } from "@/services/validationService";

export const formValidation = (form) => ({
  bankName: {
    value: form.bankName || "",
    label: "Beneficiary's bank name",
    rules: [validationService.isRequired],
  },
  bankAccountNo: {
    value: form.bankAccountNo || "",
    label: "Beneficiary's bank account number",
    rules: [validationService.isRequired],
  },
  bankCountry: {
    value: form.bankCountry || "",
    label: "Beneficiary's bank country",
    rules: [validationService.isRequired],
  },
  ...(form.bankCountry === "OTHERS" && {
    otherBankCountry: {
      value: form.otherBankCountry || "",
      label: "Other beneficiary's bank country",
      rules: [validationService.isRequired],
    },
  }),
  bankAddress: {
    value: form.bankAddress || "",
    label: "Bank address",
    rules: [validationService.isRequired],
  },
  swiftCode: {
    value: form.swiftCode || "",
    label: "Bank code / Swift",
    rules: [validationService.isRequired],
  },
  primaryBIC: {
    value: form.primaryBIC || "",
    label: "ACH routing number / IBAN no / BSB / ABA / Sort code / Bank code",
    rules: [validationService.isRequired],
  },
  branchCode: {
    value: form.secondaryBIC || "",
    label: "Branch code",
    rules: [validationService.isRequired],
  },
});
