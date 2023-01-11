import * as config from "./config.js";
import { MongoClient } from "mongodb";
import * as model from "./model.js";
const client = new MongoClient(config.mongoDbConnection);

const accessDatabase = async (done: (db: any) => void) => {
  await client.connect();
  const db = client.db(`northwind`);
  done(db);
};

export const getEmployees = (): any => {
  // wir brauchen promise da employees nicht als return angeben können, da async await langsamer ist, => brauchen return nicht mehr und await in server
  return new Promise((resolve, reject) => {
    try {
      accessDatabase(async (db) => {
        // employees rausholen
        const employees = await db
          .collection("employees")
          .find({})
          .project({ firstName: 1, lastName: 1, _id: 0 }) // our select
          .toArray();
        if (employees.length > 0) {
          resolve(employees);
        } else {
          reject({
            status: "error",
            message: "bad collection name",
          });
        }
      });
    } catch (error) {
      reject(error);
    }
    // return employees;
  });
};

export const getApiInstructions = () => {
  return `
<style>
	body {
		background-color: #444;
		padding: 1rem;
		color: #fff;
		font-family: courier;
	}
	code {
		background-color: #333;
	}
</style>
<h1>Book Site API</h1>
<ul>
	<li><code>/books</code> - all books</li>
	<li><code>/books/3</code> - book with id 3</li>
</ul>
	`;
};
