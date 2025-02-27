export const useEnvironment = () => {
  const hostname = window.location.hostname.toLowerCase();

  let ENV_TYPE;

  if (hostname.includes("localhost")) {
    ENV_TYPE = "LOCALHOST";
  }

  if (hostname.includes("172.188.98.99")) {
    ENV_TYPE = "STAGING";
  }

  if (hostname.includes("gefx")) {
    ENV_TYPE = "PRODUCTION";
  }

  if (!ENV_TYPE) {
    console.warn(`Unknown hostname: ${hostname}. Defaulting to PRODUCTION.`);
    ENV_TYPE = "PRODUCTION";
  }

  return {
    ENV_TYPE,
    apiBaseUrl: import.meta.env[`VITE_API_BASE_URL_${ENV_TYPE}`],
    appTitle: import.meta.env[`VITE_APP_TITLE_${ENV_TYPE}`],
    imagePath: import.meta.env[`VITE_APP_IMAGE_PATH_${ENV_TYPE}`],
    corsOrigin: import.meta.env[`VITE_CORS_ORIGIN_${ENV_TYPE}`],
  };
};
