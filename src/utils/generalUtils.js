export const getImagePath = (image) => {
  const basePath = import.meta.env.VITE_APP_IMAGE_PATH;
  return `${basePath}/${image}`;
};
