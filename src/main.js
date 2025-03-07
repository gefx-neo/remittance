import "./assets/main.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import App from "./App.vue";
import router from "./router";
import { FontAwesomeIcon } from "@/fontawesome/fontawesome";
import globalUtils from "@/plugins/globalUtils";
import { DEFAULT_ERROR_MESSAGE } from "@/services/apiService";
const app = createApp(App);

// Create Pinia instance
const pinia = createPinia();
// Use the persistence plugin
pinia.use(piniaPluginPersistedState);

// Register Pinia and other plugins
app.use(pinia);
app.use(router);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(globalUtils);

app.mount("#app");
