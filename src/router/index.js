import { createRouter, createWebHashHistory } from "vue-router";
import GuestLayout from "../layout/GuestLayout/GuestLayout.vue";
import UserLayout from "../layout/UserLayout/UserLayout.vue";
import ErrorLayout from "../layout/ErrorLayout/ErrorLayout.vue";
import Login from "../views/Guest/Login.vue"; // Static import
import { useAuthStore } from "../stores/authStore.js";

const routes = [
  {
    path: "/",
    component: GuestLayout,
    children: [
      {
        path: "",
        name: "login",
        component: Login, // Static import
      },
      {
        path: "register",
        name: "register",
        component: () => import("../views/Guest/Register.vue"),
      },
      {
        path: "forgotpassword",
        name: "forgotpassword",
        component: () => import("../views/Guest/ForgotPassword.vue"),
      },
    ],
  },
  {
    path: "/",
    component: UserLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: () => import("../views/User/Dashboard.vue"), // Dynamic import
      },
      {
        path: "/",
        children: [
          {
            path: "beneficiary",
            name: "beneficiary",
            component: () =>
              import("../views/User/Beneficiary/BeneficiaryList.vue"),
          },
          {
            path: "/beneficiary/:id",
            name: "beneficiary-detail",
            component: () =>
              import("../views/User/Beneficiary/BeneficiaryDetail.vue"),
            props: true,
          },
          {
            path: "/beneficiary/addbeneficiary",
            name: "add-beneficiary",
            component: () =>
              import("../views/User/Beneficiary/AddBeneficiary.vue"),
          },
        ],
      },
      {
        path: "transaction",
        name: "transaction",
        component: () => import("../views/User/Transaction.vue"),
      },
      {
        path: "profile",
        component: () => import("../views/User/Profile/Profile.vue"),
        children: [
          {
            path: "",
            name: "profile-detail",
            component: () => import("../views/User/Profile/ProfileDetail.vue"),
          },
          {
            path: "accountverification",
            name: "account-verification",
            component: () =>
              import("../views/User/Profile/AccountVerification.vue"), // Nested AccountVerification view
          },
        ],
      },

      {
        path: "help",
        name: "help",
        component: () => import("../views/Help.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)",
    component: ErrorLayout,
    children: [
      {
        path: "/:catchAll(.*)",
        name: "error",
        component: () => import("../views/Error.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_API_BASE_URL),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Call refresh cookie function only if the user is logged in
  if (authStore.user && !authStore.cookieRefreshed) {
    authStore.refreshCookie();
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // If the route requires authentication and the user is not logged in
    if (!authStore.user) {
      next({ name: "login" });
    } else {
      next();
    }
  } else {
    // If the route does not require authentication and the user is logged in
    // Disables logged in users to access login/register page
    if (
      authStore.user &&
      (to.name === "login" ||
        to.name === "register" ||
        to.name === "forgetpassword")
    ) {
      next({ name: "dashboard" });
    } else {
      next();
    }
  }
});

export default router;
