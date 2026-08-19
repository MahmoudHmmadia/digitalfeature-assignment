import { config } from "dotenv";
import express from "express";
import { dirname } from "path";
import mainConfig from "./config/main.config";
import { configureSwaggerDocs } from "./config/swagger.config";
import "./index.d";
import router from "./routes/router";

config();

const server = express();

export const DIRNAME = dirname(__filename);

mainConfig(server);

configureSwaggerDocs(server);
router(server);

server.listen(+process.env.PORT!, async () => {
  console.log(`Server Up And Running On Port: ${process.env.PORT!}`);
});
