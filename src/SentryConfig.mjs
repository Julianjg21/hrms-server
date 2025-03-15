import dotenv from "dotenv";
import * as Sentry from "@sentry/node";
//Load the environment variables
dotenv.config({ path: "./src/config/configs.env" });
// Initialize Sentry with configuration settings
Sentry.init({
  dsn: process.env.SENTRY_DNS, // Sentry Data Source Name (DSN) for tracking errors
  environment: process.env.NODE_ENV || "development", // Set the environment (production, development)
});
