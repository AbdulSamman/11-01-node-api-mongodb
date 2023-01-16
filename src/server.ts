import * as model from "./model.js";
import express from "express";
import cors from "cors";
import logger from "./logger.js";
import * as config from "./config.js";
import { IEmployee } from "./interfaces.js";

const app = express();
app.use(cors());
app.use(logger);
app.use(express.json());

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

app.post("/employee", async (req: express.Request, res: express.Response) => {
  try {
    const employee: IEmployee = req.body;
    const result = await model.addEmployee(employee);
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete(
  "/employee/:id",
  async (req: express.Request, res: express.Response) => {
    try {
      const _id = req.params.id;
      const result = await model.deleteEmployee(_id);
      res.status(200).send(result);
    } catch (e) {
      res.status(500).send(e);
    }
  }
);

app.patch(
  "/employee/:id",
  async (req: express.Request, res: express.Response) => {
    try {
      const _id = req.params.id;
      const employee: IEmployee = req.body;
      const result = await model.editEmployee(_id, employee);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

app.get("*", (req: express.Request, res: express.Response) => {
  res.send(model.getApiInstructions());
});

app.listen(config.port, () => {
  console.log(`listening on port http://localhost:${config.port}`);
});
