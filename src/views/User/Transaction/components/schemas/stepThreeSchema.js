import { validationService } from "@/services/validationService";

export const formValidation = (form) => ({
  beneficiaryUploadSupportingFile: {
    value: form?.beneficiaryUploadSupportingFile || "",
    rules: [validationService.isFileRequired],
  },
});
