import { createRouter, createWebHistory } from "vue-router";
import GuestLayout from "../layout/GuestLayout/GuestLayout.vue";
import LoginLayout from "../layout/LoginLayout/LoginLayout.vue";
import UserLayout from "../layout/UserLayout/UserLayout.vue";
import ErrorLayout from "../layout/ErrorLayout/ErrorLayout.vue";
import HomeView from "../views/HomeView.vue"; // Static import
import { useAuthStore } from "../stores/authStore.js";

const routes = [
  {
    path: "/",
    component: GuestLayout,
    children: [
      {
        path: "",
        name: "homeview",
        component: HomeView, // Static import
      },
    ],
  },
  {
    path: "/",
    component: LoginLayout,
    children: [
      {
        path: "login",
        name: "login",
        component: () => import("../views/Login.vue"),
      },
      {
        path: "register",
        name: "register",
        component: () => import("../views/Register.vue"),
      },
    ],
  },
  {
    path: "/",
    component: UserLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("../views/User/Home.vue"), // Dynamic import
      },
      {
        path: "recipient",
        name: "recipient",
        component: () => import("../views/User/Recipients.vue"),
      },
      {
        path: "payment",
        name: "payment",
        component: () => import("../views/User/Payment.vue"),
      },
      {
        path: "profile",
        name: "profile",
        component: () => import("../views/User/Profile.vue"),
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
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Call refresh cookie function
  if (!authStore.cookieRefreshed) {
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
      (to.name === "homeview" || to.name === "login" || to.name === "register")
    ) {
      next({ name: "home" });
    } else {
      next();
    }
  }
});

export default router;
