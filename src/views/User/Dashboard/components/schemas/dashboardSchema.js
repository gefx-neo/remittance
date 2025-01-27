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
  // receivingAmount: {
  //   value: form?.receivingAmount || "",
  //   rules: [
  //     validationService.isRequired,
  //     (value) =>
  //       validationService.validateAmount(
  //         value,
  //         form.receivingCurrency,
  //         currencySchema,
  //         "receiving"
  //       ),
  //   ],
  // },
});

export const currencySchema = {
  USD: { min: 100, max: 500000 },
  MYR: { min: 100, max: 5000000 },
  IDR: { min: 1000000, max: 100000000 },
  SGD: { min: 100, max: 500000 },
};
