import { createRouter, createWebHistory } from "vue-router";
import GuestLayout from "../layout/GuestLayout/GuestLayout.vue";
import UserLayout from "../layout/UserLayout/UserLayout.vue";
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
        path: "recipent",
        name: "recipent",
        component: () => import("../views/User/Recipent.vue"),
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
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.cookieRefreshed) {
    authStore.checkCookie();
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // If the route requires authentication and the user is not logged in
    if (!authStore.user) {
      next({ name: "login" });
    } else {
      next();
    }
  } else {
    // Allow access to help pages without authentication
    if (to.name === "help") {
      next();
    } else {
      // If the route does not require authentication and the user is logged in
      // Disables logged in users to access login/register page
      if (authStore.user && to.name !== "home") {
        next({ name: "home" });
      } else {
        next();
      }
    }
  }
});

export default router;
