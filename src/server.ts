import * as model from "./model.js";
import express from "express";
import cors from "cors";
import logger from "./logger.js";
import * as config from "./config.js";

const app = express();
app.use(cors());
app.use(logger);

app.get("/", (req: express.Request, res: express.Response) => {
  res.send(model.getApiInstructions());
});

app.get("/employees", async (req: express.Request, res: express.Response) => {
  try {
    const employees = await model.getEmployees();
    res.json(employees);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(config.port, () => {
  console.log(`listening on port http://localhost:${config.port}`);
});
