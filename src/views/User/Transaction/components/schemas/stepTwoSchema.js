import { validationService } from "@/services/validationService";

export const formValidation = (form) => ({
  sendingAmount: {
    value: form?.sendingAmount || "",
    rules: [validationService.isRequired],
  },
  receivingAmount: {
    value: form?.receivingAmount || "",
    rules: [validationService.isRequired],
  },
  paymentType: {
    value: form?.paymentType || "",
    rules: [validationService.isRequired],
  },
  gefxBank: {
    value: form?.gefxBank || "",
    rules: [validationService.isRequired],
  },
});
