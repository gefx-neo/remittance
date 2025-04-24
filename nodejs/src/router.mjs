import config from "./config.mjs";
import { Issuer, generators, custom } from "openid-client";
import * as crypto from "crypto";
import Router from "@koa/router";

// This demo uses panva/node-openid-client, an off-the-shelf OIDC client.

const singpassIssuer = await Issuer.discover(config.ISSUER_URL);

const singpassClient = new singpassIssuer.Client(
  {
    // All the hardcoded values used below are taken from Singpass' OpenID Provider Metadata,
    // which can be found at config.ISSUER_URL + '/.well-known/openid-configuration'
    client_id: config.CLIENT_ID,
    response_types: ["code"],
    token_endpoint_auth_method: "private_key_jwt",
    id_token_signed_response_alg: "ES256",
    userinfo_encrypted_response_alg: config.KEYS.PRIVATE_ENC_KEY.alg,
    userinfo_encrypted_response_enc: "A256GCM",
    userinfo_signed_response_alg: config.KEYS.PRIVATE_SIG_KEY.alg,
  },
  { keys: [config.KEYS.PRIVATE_SIG_KEY, config.KEYS.PRIVATE_ENC_KEY] }
);

custom.setHttpOptionsDefaults({
  timeout: 15000,
});

// This demo uses Koa for routing.

const router = new Router();

router.get("/.well-known/jwks.json", function getJwks(ctx) {
  ctx.body = { keys: [config.KEYS.PUBLIC_SIG_KEY, config.KEYS.PUBLIC_ENC_KEY] };
});

router.get("/login", async function handleLogin(ctx) {
  const code_verifier = generators.codeVerifier();
  const code_challenge = generators.codeChallenge(code_verifier);
  const nonce = crypto.randomUUID();
  const state = crypto.randomBytes(16).toString("hex");
  ctx.session.auth = { code_verifier, nonce, state };

  // Authorization request
  const authorizationUrl = singpassClient.authorizationUrl({
    redirect_uri: config.REDIRECT_URI,
    code_challenge_method: "S256",
    code_challenge,
    nonce,
    state,
    scope: config.SCOPES,
  });
  ctx.redirect(authorizationUrl);
});

// router.get("/callback", async function handleSingpassCallback(ctx) {
//   try {
//     const receivedQueryParams = ctx.request.query;
//     const { code_verifier, nonce, state } = ctx.session.auth;

//     // Token request
//     const tokenSet = await singpassClient.callback(
//       config.REDIRECT_URI,
//       receivedQueryParams,
//       {
//         code_verifier,
//         nonce,
//         state,
//       }
//     );
//     console.log("These are the claims in the ID token:");
//     console.log(tokenSet.claims());

//     // Userinfo request (available only to apps with additional allowed scopes, beyond just 'openid').
//     const userInfo = await singpassClient.userinfo(tokenSet);
//     console.log("This is the user info returned:");
//     console.log(userInfo); // Second API
//     const processedUserInfo = {
//       uinfin: userInfo?.uinfin.value,
//       name: userInfo?.name?.value?.trim(), // remove accidental whitespace
//     };

//     console.log("Processed user info:", processedUserInfo); // console.log(processedUserInfo);  // FIRST API
//     ctx.session.user = { ...tokenSet.claims(), ...userInfo };
//     ctx.redirect("/#/dashboard");
//   } catch (err) {
//     console.error(err);
//     ctx.status = 401;
//   }
// });

router.get("/callback", async function handleSingpassCallback(ctx) {
  try {
    const receivedQueryParams = ctx.request.query;
    const { code_verifier, nonce, state } = ctx.session.auth;

    // Token request
    const tokenSet = await singpassClient.callback(
      config.REDIRECT_URI,
      receivedQueryParams,
      { code_verifier, nonce, state }
    );
    console.log("These are the claims in the ID token:");
    console.log(tokenSet.claims());

    // Userinfo request
    const userInfo = await singpassClient.userinfo(tokenSet);
    console.log("This is the user info returned:");
    console.log(userInfo);

    // Process user info
    const processedUserInfo = {
      uinfin: userInfo?.uinfin?.value,
      name: userInfo?.name?.value?.trim(),
    };
    console.log("Processed user info:", processedUserInfo);

    // 👇 Send POST request to /user/reqkey with { username: uinfin }
    try {
      const response = await fetch("http://localhost:3080/user/reqkey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(processedUserInfo),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const apiResponse = await response.json();
      console.log("API response from /user/reqkey:", apiResponse);

      // Save key and iv to session for later use (optional)
      ctx.session.apiToken = {
        hex: apiResponse.key,
        iv: apiResponse.iv,
      };
    } catch (apiErr) {
      console.error("Failed to call /user/reqkey API:", apiErr);
    }

    // Save full user info to session
    ctx.session.user = {
      ...tokenSet.claims(),
      ...userInfo,
    };

    // Redirect to dashboard
    ctx.redirect("/#/dashboard");
  } catch (err) {
    console.error("Callback error:", err);
    ctx.status = 401;
  }
});

router.get("/user", function getUser(ctx) {
  if (ctx.session.user) {
    ctx.body = ctx.session.user;
  } else {
    ctx.status = 401;
  }
});

router.get("/logout", function handleLogout(ctx) {
  ctx.session = null;
  ctx.redirect("/");
});

router.post("/user/reqkey", async (ctx) => {
  console.log("✅ /user/reqkey was called");

  // 👇 Log the full request body
  console.log("📦 Received body:", ctx.request.body);

  const { uinfin, name } = ctx.request.body;

  ctx.body = {
    status: 1,
    token: `mock-response-token-${uinfin}+${name}`,
  };
});

export { router };
