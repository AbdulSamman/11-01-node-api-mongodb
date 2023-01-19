import * as config from "./config.js";
import { MongoClient, ObjectId } from "mongodb";
import { IEmployee } from "./interfaces.js";

const client = new MongoClient(config.mongoDbConnection);

const accessDatabase = async (done: (db: any) => void) => {
  await client.connect();
  const db = client.db(`northwind`);
  done(db);
};

export const getEmployees = () => {
  // wir brauchen promise da employees nicht als return angeben können, da async await langsamer ist, => brauchen return nicht mehr und await in server
  return new Promise((resolve, reject) => {
    try {
      accessDatabase(async (db) => {
        // employees rausholen
        const employees = await db
          .collection("employees")
          .find({})
          .project({ firstName: 1, lastName: 1 }) // our select
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
export const addEmployee = async (employee: IEmployee) => {
  return new Promise((resolve, reject) => {
    try {
      accessDatabase(async (db) => {
        const employeesCollection = db.collection("employees");
        const result = await employeesCollection.insertOne(employee);
        console.log(result);
        resolve({
          status: "success",
          newId: result.insertedId,
        });
      });
    } catch (e) {
      reject(e);
    }
  });
};

export const deleteEmployee = async (_id: string) => {
  return new Promise((resolve, reject) => {
    try {
      accessDatabase(async (db) => {
        const employeesCollection = db.collection("employees");
        const result = await employeesCollection.deleteOne({
          _id: new ObjectId(_id),
        });
        if (result.deletedCount === 1) {
          resolve({
            status: "success",
            message: `item with id "${_id}" was deleted`,
          });
        } else {
          reject({
            status: "error",
            message: `item with id "${_id}" was not deleted`,
          });
        }
      });
    } catch (e) {
      reject(e);
    }
  });
};

export const editEmployee = (_id: string, employee: IEmployee) => {
  return new Promise((resolve, reject) => {
    try {
      accessDatabase(async (db) => {
        const employeesCollection = db.collection("employees");
        const result = await employeesCollection.updateOne(
          { _id: new ObjectId(_id) },
          { $set: { ...employee } }
        );
        if (result.modifiedCount === 1) {
          resolve({
            status: "success",
            message: `item with id "${_id}" was edited`,
          });
        } else {
          reject({
            status: "error",
            message: `item with id "${_id}" was not edited`,
          });
        }
      });
    } catch (error) {
      reject(error);
    }
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
    color: orange
	}
  a {
    color: yellow;
   
  }
</style>
<h1>Employee Site API</h1>
<ul>
	<li>GET <a href="http://localhost:3615/employees">/employees</a> - get all employees</li>
  <li>POST <code>/employee</code> - add an employee</li>
  <li>PATCH <code>/employee/63c413bece003d083deefd0f</code> - edit employee with id 63c413bece003d083deefd0f</li>
  <li>DELETE <code>/employee/63c413bece003d083deefd0f</code> - delete employee with id 63c413bece003d083deefd0f</li>
</ul>
	`;
};
