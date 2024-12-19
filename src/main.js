import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate"; // Import plugin
import App from "./App.vue";
import router from "./router";
import { FontAwesomeIcon } from "@/fontawesome/fontawesome"; // Use named import

const app = createApp(App);

// Create Pinia instance
const pinia = createPinia();

// Use the persistence plugin
pinia.use(piniaPluginPersistedState);

// Register Pinia and other plugins
app.use(pinia);
app.use(router);
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");

// console.log(import.meta.env.VITE_ENV); // development, staging, or production
// console.log(import.meta.env.VITE_API_BASE_URL); // URL based on the environment
