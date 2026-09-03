/**
 * Server bootstrap hooks. Next.js calls register() once per server process.
 * We install last-resort guards so a stray socket error or rejected promise
 * (e.g. Postgres restarting under us) can never kill the web server and
 * leave visitors staring at "This page couldn't load".
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    process.on("unhandledRejection", (reason: unknown) => {
      console.error("[server] unhandledRejection (contained):", reason);
    });
    process.on("uncaughtException", (err: Error) => {
      console.error("[server] uncaughtException (contained):", err?.message);
    });
  }
}
