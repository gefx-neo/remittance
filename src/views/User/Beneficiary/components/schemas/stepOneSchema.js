import { validationService } from "@/services/validationService";

export const fieldMapping = {
  1: {
    MYR: {
      address: { include: true, rules: [validationService.isRequired] },
      registrationNo: { include: true, rules: [] },
      registrationPlace: { include: true, rules: [] },
    },
    IDR: {
      address: { include: true, rules: [] },
      registrationNo: { include: false },
      registrationPlace: { include: true, rules: [] },
    },
  },
  0: {
    MYR: {
      address: { include: true, rules: [] },
      dob: { include: true, rules: [] },
    },
    IDR: {
      address: { include: true, rules: [] },
      dob: { include: true, rules: [] },
    },
  },
};

export const formValidation = (form) => {
  const currentMapping =
    (fieldMapping[form.beneficiaryType] || {})[form.currency] || {};

  return {
    name: {
      value: form.name || "",
      rules: [validationService.isRequired],
    },
    // contactMobile: {
    //   value: form.contactMobile || "",
    //   rules: [validationService.isRequired, validationService.isPhoneNumber],
    // },
    ...(currentMapping.address?.include && {
      address: {
        value: form.address || "",
        rules: currentMapping.address.rules || [],
      },
    }),
    ...(form.beneficiaryType === 1 && {
      ...(currentMapping.registrationNo?.include && {
        registrationNo: {
          value: form.registrationNo || "",
          rules: currentMapping.registrationNo.rules || [],
        },
      }),
      ...(currentMapping.registrationPlace?.include && {
        registrationPlace: {
          value: form.registrationPlace || "",
          rules: currentMapping.registrationPlace.rules || [],
        },
      }),
      ...(form.registrationPlace === "OTHERS" && {
        otherRegistrationPlace: {
          value: form.otherRegistrationPlace || "",
          rules: [validationService.isRequired],
        },
      }),
      businessCategory: {
        value: form.businessCategory || "",
        rules: [validationService.isRequired],
      },
      ...(form.businessCategory === 331 && {
        otherBusinessCategory: {
          value: form.otherBusinessCategory || "",
          rules: [validationService.isRequired],
        },
      }),
      companyContactNo: {
        value: form.companyContactNo || "",
        rules: [validationService.isRequired, validationService.isPhoneNumber],
      },
    }),
    ...(form.beneficiaryType === 0 && {
      nationality: {
        value: form.nationality || "",
        rules: [validationService.isRequired],
      },
      ...(form.nationality === "OTHERS" && {
        otherNationality: {
          value: form.otherNationality || "",
          rules: [validationService.isRequired],
        },
      }),
      docIC: {
        value: form.docIC || "",
        rules: [validationService.isRequired],
      },
      ...(currentMapping.dob?.include && {
        address: {
          value: form.dob || "",
          rules: currentMapping.address.rules || [],
        },
      }),
    }),
  };
};
