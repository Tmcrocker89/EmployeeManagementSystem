const inquirer = require("inquirer");
const mysql = require("mysql2");
const addRole = require("./lib/AddRole")
const addEmp = require("./lib/AddEmployee")
const manageEmp = require("./lib/ManageEmp");

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
  );




manageEmp()








