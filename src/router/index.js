import { createRouter, createWebHashHistory } from "vue-router";
import GuestLayout from "../layout/GuestLayout/GuestLayout.vue";
import UserLayout from "../layout/UserLayout/UserLayout.vue";
import ProcessLayout from "../layout/ProcessLayout/ProcessLayout.vue";
import AdminLayout from "../layout/AdminLayout/AdminLayout.vue"; // Admin layout
import ErrorLayout from "../layout/ErrorLayout/ErrorLayout.vue";
import Login from "../views/Guest/Login.vue"; // Static import
import AdminLogin from "../views/Guest/AdminLogin.vue"; // Admin Login
import { useAuthStore, useAlertStore } from "../stores/index.js";
import { useAdminAuthStore } from "../stores/admin/adminAuthStore.js";

const guestGuard = (to, from, next) => {
  const authStore = useAuthStore();

  // If the user is already logged in, redirect to dashboard
  if (authStore.user) {
    next({ name: "dashboard" });
  } else {
    next();
  }
};

const authGuard = (to, from, next) => {
  const authStore = useAuthStore();

  // Call refresh cookie function only if the user is logged in
  authStore.checkSession();

  // If the route requires authentication and the user is not logged in
  if (!authStore.user) {
    next({ name: "login" }); // Redirect to login if the user is not logged in
  } else if (
    authStore.userStatus === "0" &&
    (to.name === "transaction" || to.name === "addtransaction")
  ) {
    const alertStore = useAlertStore();
    alertStore.alert("pending", "Please verify your account");

    // Redirect users with userStatus === 0 to account verification
    next({ name: "profiledetail" });
  } else {
    next(); // Allow navigation for other cases
  }
};

// Admin Authentication Guard
const adminAuthGuard = (to, from, next) => {
  const adminAuthStore = useAdminAuthStore();

  // Call refresh cookie function only if the admin is logged in
  adminAuthStore.checkSession();

  // If the route requires admin authentication and the admin is not logged in
  if (!adminAuthStore.admin) {
    next({ name: "admin-login" }); // Redirect to admin login if not authenticated
  } else {
    next();
  }
};

const routes = [
  // Guest Routes
  {
    path: "/",
    component: GuestLayout,
    beforeEnter: guestGuard,
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
      {
        path: "admin",
        name: "admin-login",
        component: AdminLogin,
      },
    ],
  },

  // User Routes
  {
    path: "/",
    component: UserLayout,
    beforeEnter: authGuard, // Protect all user routes by applying user guard
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: () => import("../views/User/Dashboard/Dashboard.vue"), // Dynamic import
      },
      {
        path: "beneficiary",
        beforeEnter: authGuard,
        children: [
          {
            path: "",
            name: "beneficiary",
            component: () =>
              import("../views/User/Beneficiary/BeneficiaryList.vue"),
          },
          {
            path: ":id",
            name: "beneficiary-detail",
            component: () =>
              import("../views/User/Beneficiary/BeneficiaryDetail.vue"),
            props: true,
          },
        ],
      },
      {
        path: "transaction",
        beforeEnter: authGuard,
        children: [
          {
            path: "",
            name: "transaction",
            component: () =>
              import("../views/User/Transaction/TransactionList.vue"),
          },
          {
            path: ":memoId",
            name: "transaction-detail",
            component: () =>
              import("../views/User/Transaction/TransactionDetail.vue"),
            props: true,
          },
        ],
      },
      {
        path: "profile",
        component: () => import("../views/User/Profile/Profile.vue"),
        children: [
          {
            path: "",
            name: "profiledetail",
            component: () => import("../views/User/Profile/ProfileDetail.vue"),
          },
        ],
      },
      {
        path: "setting",
        name: "setting",
        component: () => import("../views/User/Setting.vue"),
      },
    ],
  },

  {
    path: "/beneficiary",
    component: ProcessLayout,
    beforeEnter: authGuard,
    children: [
      {
        path: "addbeneficiary",
        name: "addbeneficiary",
        component: () => import("../views/User/Beneficiary/AddBeneficiary.vue"),
      },
    ],
  },
  {
    path: "/transaction",
    component: ProcessLayout,
    beforeEnter: authGuard,
    children: [
      {
        path: "addtransaction",
        name: "addtransaction",
        component: () => import("../views/User/Transaction/AddTransaction.vue"),
      },
    ],
  },
  {
    path: "/profile",
    component: ProcessLayout,
    beforeEnter: authGuard,
    children: [
      {
        path: "accountverification",
        name: "accountverification",
        component: () =>
          import("../views/User/Profile/AccountVerification.vue"),
      },
    ],
  },

  // Admin Routes
  {
    path: "/admin",
    component: AdminLayout,
    // beforeEnter: adminAuthGuard, // Protect admin dashboard routes with admin authentication
    children: [
      {
        path: "remittance",
        children: [
          {
            path: "customermanagement",
            name: "admin-remittance-customermanagement",
            component: () =>
              import("../views/Admin/Remittance/CustomerManagement.vue"),
          },
          {
            path: "transactionmanagement",
            name: "admin-remittance-transactionmanagement",
            component: () =>
              import("../views/Admin/Remittance/TransactionManagement.vue"),
          },
          {
            path: "beneficiarymanagement",
            name: "admin-remittance-beneficiarymanagement",
            component: () =>
              import("../views/Admin/Remittance/BeneficiaryManagement.vue"),
          },
          {
            path: "auditlog",
            name: "admin-remittance-auditlog",
            component: () => import("../views/Admin/Remittance/AuditLog.vue"),
          },
        ],
      },
    ],
  },

  // Catch All Error Routes
  {
    path: "/:catchAll(.*)",
    component: ErrorLayout,
    children: [
      {
        path: "",
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

// Global beforeEach to check session
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  authStore.checkSession();

  next();
});

export default router;
