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
      agentBasisAuth: {
        value: corporateForm?.agentBasisAuth || "",
        label: "Basis of Authority",
        rules: [validationService.isRequired],
      },
    }),

  // Conditionally validate other fund source if the fundSource is 'Others'
  ...(corporateForm?.fundSource === "Others" && {
    otherFundSource: {
      value: corporateForm?.otherFundSource || "",
      label: "Source of fund (others)",
      rules: [validationService.isRequired],
    },
  }),
});

export const individualValidation = (individualForm, isAgent) => ({
  // Validate these fields only if isAgent is 'Yes'
  ...(isAgent === "Yes" && {
    agentName: {
      value: individualForm?.agentName || "",
      label: "Agent Name",
      rules: [validationService.isRequired],
    },
    agentAddress: {
      value: individualForm?.agentAddress || "",
      label: "Agent Address",
      rules: [validationService.isRequired],
    },
    agentNationality: {
      value: individualForm?.agentNationality || "",
      label: "Agent Nationality",
      rules: [validationService.isRequired],
    },
    agentIC: {
      value: individualForm?.agentIC || "",
      label: "IC / Passport no.",
      rules: [validationService.isRequired],
    },
    agentDOB: {
      value: individualForm?.agentDOB || "",
      label: "Date of Birth",
      rules: [validationService.isRequired],
    },
    agentRelationship: {
      value: individualForm?.agentRelationship || "",
      label: "Relationship between agent(s) and client",
      rules: [validationService.isRequired],
    },
    agentBasisAuth: {
      value: individualForm?.agentBasisAuth || "",
      label: "Basis of Authority",
      rules: [validationService.isRequired],
    },
  }),
});
