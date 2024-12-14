import { validationService } from "@/services/validationService";

export const fieldMapping = {
  1: {
    MYR: {
      bankName: { include: true, rules: [validationService.isRequired] },
      bankAccountNo: { include: true, rules: [validationService.isRequired] },
      fullName: { include: true, rules: [validationService.isRequired] },
      bankCountry: { include: true, rules: [validationService.isRequired] },
      bankAddress: { include: false, rules: [] },
      paymentType: { include: true, rules: [validationService.isRequired] },
      swiftCode: { include: true, rules: [validationService.isRequired] },
      primaryBIC: { include: false, rules: [] },
      secondaryBIC: { include: false, rules: [] },
    },
    IDR: {
      bankName: { include: true, rules: [validationService.isRequired] },
      bankAccountNo: { include: true, rules: [validationService.isRequired] },
      fullName: { include: true, rules: [validationService.isRequired] },
      bankCountry: { include: true, rules: [validationService.isRequired] },
      bankAddress: { include: false, rules: [] },
      paymentType: { include: true, rules: [validationService.isRequired] },
      swiftCode: { include: true, rules: [validationService.isRequired] },
      primaryBIC: { include: false, rules: [] },
      secondaryBIC: { include: false, rules: [] },
    },
  },
  0: {
    MYR: {
      bankName: { include: true, rules: [validationService.isRequired] },
      bankAccountNo: { include: true, rules: [validationService.isRequired] },
      fullName: { include: true, rules: [validationService.isRequired] },
      bankCountry: { include: true, rules: [] },
      bankAddress: { include: false, rules: [] },
      paymentType: { include: true, rules: [validationService.isRequired] },
      swiftCode: { include: true, rules: [validationService.isRequired] },
      primaryBIC: { include: false, rules: [] },
      secondaryBIC: { include: false, rules: [] },
    },
    IDR: {
      bankName: { include: true, rules: [validationService.isRequired] },
      bankAccountNo: { include: true, rules: [validationService.isRequired] },
      fullName: { include: true, rules: [validationService.isRequired] },
      bankCountry: { include: true, rules: [] },
      bankAddress: { include: false, rules: [] },
      paymentType: { include: true, rules: [validationService.isRequired] },
      swiftCode: { include: true, rules: [validationService.isRequired] },
      primaryBIC: { include: false, rules: [] },
      secondaryBIC: { include: false, rules: [] },
    },
  },
};

export const formValidation = (form) => {
  const currentMapping =
    (fieldMapping[form.beneficiaryType] || {})[form.currency] || {};

  return {
    ...(currentMapping.bankName?.include && {
      bankName: {
        value: form.bankName || "",
        rules: currentMapping.bankName.rules || [],
      },
    }),
    ...(currentMapping.bankAccountNo?.include && {
      bankAccountNo: {
        value: form.bankAccountNo || "",
        rules: currentMapping.bankAccountNo.rules || [],
      },
    }),
    ...(currentMapping.fullName?.include && {
      fullName: {
        value: form.fullName || "",
        rules: currentMapping.fullName.rules || [],
      },
    }),
    ...(currentMapping.bankCountry?.include && {
      bankCountry: {
        value: form.bankCountry || "",
        rules: currentMapping.bankCountry.rules || [],
      },
    }),
    ...(form.bankCountry === 280 &&
      currentMapping.bankCountry?.include && {
        otherBankCountry: {
          value: form.otherBankCountry || "",
          rules: [validationService.isRequired],
        },
      }),
    ...(currentMapping.bankAddress?.include && {
      bankAddress: {
        value: form.bankAddress || "",
        rules: currentMapping.bankAddress.rules || [],
      },
    }),
    ...(currentMapping.swiftCode?.include && {
      swiftCode: {
        value: form.swiftCode || "",
        rules: currentMapping.swiftCode.rules || [],
      },
    }),
    ...(currentMapping.primaryBIC?.include && {
      primaryBIC: {
        value: form.primaryBIC || "",
        rules: currentMapping.primaryBIC.rules || [],
      },
    }),
    ...(currentMapping.secondaryBIC?.include && {
      secondaryBIC: {
        value: form.secondaryBIC || "",
        rules: currentMapping.secondaryBIC.rules || [],
      },
    }),
  };
};
