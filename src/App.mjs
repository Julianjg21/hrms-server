import express from "express";
import cors from "cors";
import AuthRoutes from "./routes/AuthRoutes.mjs";
import db from "./config/Database.mjs";
import ResetPasswordRoutes from "./routes/ResetPasswordRoutes.mjs";
const App = express();

App.use(cors()); //enable CORS
App.use(express.json()); //json parsing

App.use("/auth", AuthRoutes);
App.use("/requestResetPassword", ResetPasswordRoutes);
//Database connection management
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("Connection to the database established!!");
    connection.release();
  } catch (err) {
    console.error("Database connection error:", err);
  }
})();
db.on("error", (err) => {
  console.error("Database connection error:", err);
});
export default App;
