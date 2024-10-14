import { validationService } from "@/services/validationService";

export const corporateValidation = (corporateForm, isAgent) => ({
  // Validate agentCorporateCustomerType only if isAgent is 'Yes'
  ...(isAgent === "Yes" && {
    agentCorporateCustomerType: {
      value: corporateForm?.agentCorporateCustomerType || "",
      label: "Customer type",
      rules: [validationService.isRequired],
    },
  }),

  // Conditionally validate the following fields only if agentCorporateCustomerType is selected
  ...(isAgent === "Yes" &&
    corporateForm?.agentCorporateCustomerType && {
      agentAddress: {
        value: corporateForm?.agentAddress || "",
        label: "Address",
        rules: [validationService.isRequired],
      },
      agentRegistrationCountry: {
        value: corporateForm?.agentRegistrationCountry || "",
        label:
          corporateForm?.agentCorporateCustomerType === "Entity"
            ? "Place of registration"
            : "Country",
        rules: [validationService.isRequired],
      },
      agentRegistrationNo: {
        value: corporateForm?.agentRegistrationNo || "",
        label:
          corporateForm?.agentCorporateCustomerType === "Entity"
            ? "Registration no."
            : "Identification no.",
        rules: [validationService.isRequired],
      },
      agentRegistrationDate: {
        value: corporateForm?.agentRegistrationDate || "",
        label:
          corporateForm?.agentCorporateCustomerType === "Entity"
            ? "Date of registration"
            : "Date of birth",
        rules: [validationService.isRequired],
      },
      agentRelationship: {
        value: corporateForm?.agentRelationship || "",
        label: "Relationship between agent(s) and client",
        rules: [validationService.isRequired],
      },
    }),

  // Always validate other fund source if relevant
  otherFundSource: {
    value: corporateForm?.otherFundSource || "",
    label: "Source of fund (others)",
    rules: [validationService.isRequired],
  },
});

export const personValidation = (personForm) => ({});
