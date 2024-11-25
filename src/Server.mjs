import App from "./App.mjs";
import dotenv from "dotenv"
dotenv.config(); //Load environment variables from an .env file

//Set the port from environment variables or use a default value.
const PORT = process.env.PORT || 3080;

//Initialize the server.
App.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
