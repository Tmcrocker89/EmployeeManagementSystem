const mysql = require("mysql2");
const inquirer = require("inquirer");
const addRole = require("./AddRole");
const addEmp = require("./AddEmployee");
const dbStuff = require("./dbstuff");
const viewDpt = dbStuff.viewDpt;
const viewRoles = dbStuff.viewRoles;
const viewEmp = dbStuff.viewEmp;
const addDep = dbStuff.addDep;
const updateEmp = require("./UpdateEmp").updateEmp

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
  );

const manageEmp = () => 
{
    inquirer
        .prompt([
            {
                type: "list",
                name: "action",
                message: "What would you like to do?",
                choices: [
                    "View all departments",
                    "View all roles",
                    "View all employees",
                    "Add a department",
                    "Add a role",
                    "Add an employee",
                    "Update employee role",
                    "test",
                    "Quit"
                ]
            }

        ]).then(function(data) 
        {

            const { action } = data;
            switch(action)
            {
                case "View all departments":
                    viewDpt();
                    manageEmp();
                    break;
                case "View all roles":
                    viewRoles();
                    manageEmp();
                    break;
                case "View all employees":
                    viewEmp();
                    manageEmp();
                    break;
                case "Add a department":
                    inquirer
                        .prompt([
                            {
                                type: "input",
                                name: "dep",
                                message: "What Department do you want to add?"
                            }
                        ]).then(function(data)
                        {
                            const { dep } = data;
                            addDep(dep);
                            manageEmp();
                        })
                    break;
                case "Add a role":
                    addRole()
                    // manageEmp();

                    break;
                case "Add an employee":
                    addEmp();
                    // manageEmp();            
                    break;
                case "Update employee role":
                    updateEmp();
                    // manageEmp();
                    break;
                case "Quit":
                    console.log("Have a nice day")
                    break;
                case "test":
                    console.log(getList)
                    break;

            }
            
        });
};

module.exports = manageEmp;