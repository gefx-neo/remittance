import {
  getImagePath,
  isUnverifiedUser,
  isPendingUser,
  isVerifiedUser,
  isRejectedUser,
  isNotVerifiedUser,
} from "@/utils/generalUtils";

export default {
  install(app) {
    app.config.globalProperties.$getImagePath = getImagePath;
    app.config.globalProperties.$isUnverifiedUser = isUnverifiedUser;
    app.config.globalProperties.$isPendingUser = isPendingUser;
    app.config.globalProperties.$isVerifiedUser = isVerifiedUser;
    app.config.globalProperties.$isRejectedUser = isRejectedUser;
    app.config.globalProperties.$isNotVerifiedUser = isNotVerifiedUser;
  },
};
