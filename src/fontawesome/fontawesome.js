// src/fontawesome.js
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faHome,
  faBars,
  faBell,
  faUser,
  faChevronDown,
  faQuestionCircle,
  faMoneyBill,
  faUserPlus,
  faSignInAlt,
  faRegistered,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

// Adding only the necessary icons to the library
library.add(
  faHome,
  faBars,
  faBell,
  faUser,
  faChevronDown,
  faQuestionCircle,
  faMoneyBill,
  faUserPlus,
  faSignInAlt,
  faRegistered,
  faSignOutAlt
);

export { FontAwesomeIcon }; // Export as a named export
