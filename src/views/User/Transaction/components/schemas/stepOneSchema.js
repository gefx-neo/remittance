import { validationService } from "@/services/validationService";

export const formValidation = (form) => ({
  sendingAmount: {
    value: form?.sendingAmount || "",
    rules: [
      validationService.isRequired,
      (value) =>
        validationService.validateAmount(
          value,
          form.sendingCurrency,
          currencySchema,
          "sending"
        ),
    ],
  },
  receivingAmount: {
    value: form?.receivingAmount || "",
    rules: [
      validationService.isRequired,
      (value) =>
        validationService.validateAmount(
          value,
          form.receivingCurrency,
          currencySchema,
          "receiving"
        ),
    ],
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

export const currencySchema = {
  USD: { min: 100, max: 15000 },
  MYR: { min: 100, max: 80000 },
  IDR: { min: 1000000, max: 250000000 },
  SGD: { min: 100, max: 20000 },
};
