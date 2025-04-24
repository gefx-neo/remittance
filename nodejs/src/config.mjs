// config.mjs
import dotenv from "dotenv";
dotenv.config();

function parseJSONEnv(key) {
  try {
    return JSON.parse(process.env[key]);
  } catch (e) {
    console.error(`[ERROR]: Failed to parse ${key}.`, e);
    return null;
  }
}

const config = {
  SERVER_PORT: process.env.SERVER_PORT || 3080,
  CLIENT_ID: process.env.CLIENT_ID,
  ISSUER_URL: process.env.ISSUER_URL,
  REDIRECT_URI: process.env.REDIRECT_URI,
  SCOPES: process.env.SCOPES,
  KEYS: {
    PRIVATE_SIG_KEY: parseJSONEnv("PRIVATE_SIG_KEY_JSON"),
    PRIVATE_ENC_KEY: parseJSONEnv("PRIVATE_ENC_KEY_JSON"),
    PUBLIC_SIG_KEY: parseJSONEnv("PUBLIC_SIG_KEY_JSON"),
    PUBLIC_ENC_KEY: parseJSONEnv("PUBLIC_ENC_KEY_JSON"),
  },
};

export default config;
