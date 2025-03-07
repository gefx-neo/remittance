import { useEnvironment } from "@/composables/useEnvironment";

export const getImagePath = (image) => {
  const { imagePath } = useEnvironment();
  return `${imagePath}/${image}`;
};

export const isUnverifiedUser = (userStatus) => {
  return userStatus === 0;
};

export const isPendingUser = (userStatus) => {
  return userStatus === 2;
};

export const isVerifiedUser = (userStatus) => {
  return userStatus === 3;
};

export const isRejectedUser = (userStatus) => {
  return userStatus === 4;
};

export const isNotVerifiedUser = (userStatus) => {
  return [0, 2, 4].includes(userStatus);
};
