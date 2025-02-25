import { useEnvironment } from "@/composables/useEnvironment";

import {
  beneficiaryCountries,
  businessCategories,
  purposeOfIntendedTransactions,
  fundSource,
  beneficiaryTypes,
} from "@/data/data.js";

export const getInitials = (name) => {
  if (!name) return "";
  const words = name.split(" ");
  return words.length > 1
    ? words[0][0].toUpperCase() + words[1][0].toUpperCase()
    : name[0].toUpperCase();
};

export const getAccountType = (value) => {
  const type = beneficiaryTypes.find((item) => item.value === parseInt(value));
  return type ? type.name : "Unknown Account Type";
};

export const getCurrencyImagePath = (currencyCode) => {
  const { imagePath } = useEnvironment();

  return currencyCode
    ? `${imagePath}/currency/${currencyCode.toLowerCase()}.svg`
    : `${imagePath}/currency/default.svg`;
};

export const getNationality = (id) => {
  const country = beneficiaryCountries.find((item) => item.id === parseInt(id));
  return country ? country.name : "Unknown Nationality";
};

export const getBusinessCategory = (id) => {
  for (const category of businessCategories) {
    const subcategory = category.subcategories.find(
      (sub) => sub.id === parseInt(id)
    );
    if (subcategory) {
      return subcategory.name;
    }
  }
  return "Unknown Business Category";
};

export const getRemittancePurpose = (code) => {
  const purpose = purposeOfIntendedTransactions.find(
    (item) => item.id === parseInt(code)
  );
  return purpose ? purpose.name : "Unknown Purpose";
};

export const getFundSource = (code) => {
  const source = fundSource.find((item) => item.id === parseInt(code));
  return source ? source.name : "Unknown Source of Funds";
};
