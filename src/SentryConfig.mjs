import * as Sentry from "@sentry/node";
import dotenv from "dotenv";
dotenv.config();
// Initialize Sentry with configuration settings
Sentry.init({
  dsn: "https://26429e2aee65bd02ce9dfcc7dc5cc934@o4508105026371584.ingest.us.sentry.io/4508978350718976", // Sentry Data Source Name (DSN) for tracking errors
  environment: process.env.NODE_ENV || "development", // Set the environment (production, development)
});
