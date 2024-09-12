import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { FontAwesomeIcon } from "@/fontawesome/fontawesome"; // Use named import

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");

// console.log(import.meta.env.VITE_ENV); // development, staging, or production
// console.log(import.meta.env.VITE_API_BASE_URL); // URL based on the environment
