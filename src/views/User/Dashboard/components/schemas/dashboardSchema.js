import { validationService } from "@/services/validationService";

export const formValidation = (form) => ({
  sendingAmount: {
    value: form.sendingAmount || "",
    label: "Sending Amount",
    rules: [
      validationService.isRequired, // Ensure it's not empty
      (value, label) => {
        const min = dashboardSchema[form.sendingCurrency]?.min || 0;
        const max = dashboardSchema[form.sendingCurrency]?.max || Infinity;
        return validationService.isWithinRange(value, label, { min, max });
      },
    ],
  },
  receivingAmount: {
    value: form.receivingAmount || "",
    label: "Receiving Amount",
    rules: [
      validationService.isRequired, // Ensure it's not empty
      (value, label) => {
        const min = dashboardSchema[form.receivingCurrency]?.min || 0;
        const max = dashboardSchema[form.receivingCurrency]?.max || Infinity;
        return validationService.isWithinRange(value, label, { min, max });
      },
    ],
  },
});

// Define the validation rules for each currency
export const dashboardSchema = {
  USD: { min: 1, max: 100000 },
  MYR: { min: 0.01, max: 500000 },
  IDR: { min: 100, max: 100000000 },
  SGD: { min: 1, max: 200000 },
};
