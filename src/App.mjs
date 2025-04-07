import "./SentryConfig.mjs";
import * as Sentry from "@sentry/node";
import helmet from "helmet";
import dotenv from "dotenv"
import express from "express";
import cors from "cors";
import AuthRoutes from "./routes/AuthRoutes.mjs";
import UserRoleRoutes from "./routes/UserRoleRoutes.mjs";
import db from "./config/Database.mjs";
import ResetPasswordRoutes from "./routes/ResetPasswordRoutes.mjs";
import UserManagement from "./routes/UserManagementRoutes.mjs";
import UserDocuments from "./routes/UserDocumentsRoute.mjs";
import UserEvents from "./routes/UserEventsRoutes.mjs";

const App = express();
//Load the environment variables
dotenv.config({ path: "./src/config/configs.env" });

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN, // Specifies the allowed origin from environment variables
  methods: "GET,POST,PUT,DELETE", // Defines the HTTP methods allowed for cross-origin requests
  credentials: true, // Allows cookies and authentication headers to be sent with requests
};

//Helmet to improve security
App.use(helmet());
App.use(cors(corsOptions));
App.use(express.json()); //json parsing

App.use("/auth", AuthRoutes);
App.use("/requestResetPassword", ResetPasswordRoutes);
App.use("/requestUserRole", UserRoleRoutes);
App.use("/requestUserManagement", UserManagement);
App.use("/requestUserDocuments", UserDocuments);
App.use("/requestUserEvents", UserEvents);

// Register Sentry's error handler middleware
Sentry.setupExpressErrorHandler(App);

//Database connection management
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("Connection to the database established!!");
    connection.release();
  } catch (error) {
    Sentry.captureException(error, {
      tags: { module: "database-connection" },
      extra: { message: "Error trying to connect the database" },
      level: "error",
    });
  }
})();
db.on("error", (error) => {
  Sentry.captureException(error, {
    tags: { module: "server-connection" },
    extra: { message: "Error trying to create the server connection" },
    level: "error",
  });
});
export default App;
