import { createRouter, createWebHashHistory } from "vue-router";
import GuestLayout from "../layout/GuestLayout/GuestLayout.vue";
import UserLayout from "../layout/UserLayout/UserLayout.vue";
import ProcessLayout from "../layout/ProcessLayout/ProcessLayout.vue";
import AdminLayout from "../layout/AdminLayout/AdminLayout.vue";
import ErrorLayout from "../layout/ErrorLayout/ErrorLayout.vue";
import Login from "../views/Guest/Login.vue";
import AdminLogin from "../views/Guest/AdminLogin.vue";
import {
  useStore,
  useAuthStore,
  useProfileStore,
  useAlertStore,
} from "../stores/index.js";
import { useAdminAuthStore } from "../stores/admin/adminAuthStore.js";
import { DEFAULT_ERROR_MESSAGE } from "@/services/apiService";
import { ref, watch } from "vue";

const routes = [
  {
    path: "/",
    component: GuestLayout,
    meta: { requiresGuest: true },
    children: [
      {
        path: "",
        name: "login",
        component: Login,
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

  {
    path: "/",
    component: UserLayout,
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: () => import("../views/User/Dashboard/Dashboard.vue"),
      },
      {
        path: "beneficiary",
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
        path: "localtransfer",
        name: "localtransfer",
        component: () =>
          import("../views/User/LocalTransfer/LocalTransfer.vue"),
      },
      {
        path: "withdrawal",
        name: "withdrawal",
        component: () => import("../views/User/Withdrawal/Withdrawal.vue"),
      },
      {
        path: "faq",
        name: "faq",
        component: () => import("../views/User/Faq/Faq.vue"),
      },
      {
        path: "profile",
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
    meta: { requiresAuth: true },
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
    meta: { requiresAuth: true },
    children: [
      {
        path: "addtransaction",
        name: "addtransaction",
        component: () => import("../views/User/Transaction/AddTransaction.vue"),
        meta: { requiresVerified: true },
      },
    ],
  },
  {
    path: "/profile",
    component: ProcessLayout,
    children: [
      {
        path: "accountverification",
        name: "accountverification",
        component: () =>
          import("../views/User/Profile/AccountVerification.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/admin",
    component: AdminLayout,
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
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const profileStore = useProfileStore();
  const alertStore = useAlertStore();

  const isLoggedIn = await authStore.checkSession();

  if (to.meta.requiresAuth && !isLoggedIn) {
    // alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
    // await authStore.logout();
    return next({ name: "login" });
  }

  if (to.meta.requiresGuest && isLoggedIn) {
    return next({ name: "dashboard" });
  }

  if (to.meta.requiresVerified && isLoggedIn) {
    try {
      const profileDetail = await profileStore.getProfileDetail();
      if (profileDetail?.userStatus !== 3) {
        alertStore.alert("pending", "Please verify your account");
        return next({ name: "profiledetail" });
      }
    } catch (error) {
      alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
      return next({ name: "profiledetail" });
    }
  }

  next();
});

const pendingRoute = ref(null);

const queueNavigation = (to) => {
  pendingRoute.value = to;
  const store = useStore();
  const stopWatcher = watch(
    () => store.isLoading,
    (newVal) => {
      if (!newVal && pendingRoute.value) {
        stopWatcher();
        const queuedRoute = pendingRoute.value;
        pendingRoute.value = null;
        router.push(queuedRoute);
      }
    }
  );
};

router.beforeEach((to, from, next) => {
  const store = useStore();
  store.isLoading ? queueNavigation(to) : next();
});

export default router;
