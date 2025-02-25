import { useEnvironment } from "@/composables/useEnvironment";

export const getImagePath = (image) => {
  const { imagePath } = useEnvironment();
  return `${imagePath}/${image}`;
};
