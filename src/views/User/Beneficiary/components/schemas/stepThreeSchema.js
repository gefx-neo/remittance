import { validationService } from "@/services/validationService";

export const fieldMapping = {
  1: {
    MYR: {
      purposeOfIntendedTransactions: {
        include: true,
        rules: [validationService.isRequired],
      },
      rel: { include: true, rules: [validationService.isRequired] },
      fundSource: { include: true, rules: [validationService.isRequired] },
    },
    IDR: {
      purposeOfIntendedTransactions: {
        include: true,
        rules: [validationService.isRequired],
      },
      rel: { include: true, rules: [validationService.isRequired] },
      fundSource: { include: true, rules: [validationService.isRequired] },
    },
  },
  0: {
    MYR: {
      purposeOfIntendedTransactions: {
        include: true,
        rules: [validationService.isRequired],
      },
      rel: { include: true, rules: [validationService.isRequired] },
      fundSource: { include: true, rules: [validationService.isRequired] },
    },
    IDR: {
      purposeOfIntendedTransactions: {
        include: true,
        rules: [validationService.isRequired],
      },
      rel: { include: true, rules: [validationService.isRequired] },
      fundSource: { include: true, rules: [validationService.isRequired] },
    },
  },
};

export const formValidation = (form) => {
  const currentMapping =
    (fieldMapping[form.beneficiaryType] || {})[form.currency] || {};

  return {
    paymentDetail: {
      value: form.paymentDetail || "",
      rules: [validationService.isRequired],
    },
    ...(currentMapping.rel?.include && {
      rel: {
        value: form.rel || "",
        rules: currentMapping.rel.rules || [],
      },
    }),
    ...(currentMapping.purposeOfIntendedTransactions?.include && {
      purposeOfIntendedTransactions: {
        value: form.purposeOfIntendedTransactions || "",
        rules: currentMapping.purposeOfIntendedTransactions.rules || [],
      },
    }),
    ...(form.purposeOfIntendedTransactions === "Others" && {
      otherPurposeOfIntendedTransactions: {
        value: form.otherPurposeOfIntendedTransactions || "",
        rules: [validationService.isRequired],
      },
    }),
    ...(currentMapping.fundSource?.include && {
      fundSource: {
        value: form.fundSource || "",
        rules: currentMapping.fundSource.rules || [],
      },
    }),
    ...(form.fundSource === "Others" && {
      otherFundSource: {
        value: form.otherFundSource || "",
        rules: [validationService.isRequired],
      },
    }),
  };
};
