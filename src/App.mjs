import express from "express";
import cors from "cors";


const App = express();


App.use(cors()); //enable CORS
App.use(express.json()); //json parsing





App.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || "Error interno del servidor",
  });
});

export default App;