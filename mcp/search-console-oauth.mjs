import process from "node:process";
import {
  getAuthStrategySummary,
  getScopeForMode,
  getScopeMode,
  loginWithOAuth,
  logoutOAuth,
} from "./search-console-auth.mjs";

async function main() {
  const command = process.argv[2] || "status";
  const scopeMode = getScopeMode();

  if (command === "login") {
    const result = await loginWithOAuth(scopeMode);
    console.log(
      JSON.stringify(
        {
          ok: true,
          message: "OAuth login completed. Cached refresh token saved locally.",
          ...result,
        },
        null,
        2
      )
    );
    return;
  }

  if (command === "logout") {
    console.log(JSON.stringify(logoutOAuth(scopeMode), null, 2));
    return;
  }

  if (command === "status") {
    console.log(
      JSON.stringify(
        {
          ...getAuthStrategySummary(),
          expectedScope: getScopeForMode(scopeMode),
        },
        null,
        2
      )
    );
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
