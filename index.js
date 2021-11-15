const inquirer = require("inquirer");
const mysql = require("mysql2");

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
                    inquirer
                        .prompt([
                            {
                                type: "input",
                                name: "role",
                                message: "Whats the name of the role?"
                            },
                            {
                                type: "input",
                                name: "salary",
                                message: "Whats the salary for the role?"
                            },
                            {
                                type: "input",
                                name: "dep",
                                message: "What the deparment ID for the roll in?"
                            },
                        ]).then(function(data)
                        {
                            const { role, salary, dep } = data;
                            addRole(role, salary, dep);
                            manageEmp();
                        })

                    break;
                case "Add an employee":
                    getDep();
                    // manageEmp();            
                    break;
                case "Update employee role":
                    updateEmp();
                    manageEmp();
                    break;
                case "Quit":
                    console.log("Have a nice day")
                    break;
                case "test":
                    break;

            }
            
        });
};


manageEmp()

const viewDpt = () =>
{
    db.query(`
        SELECT * FROM department;
        `, function(err, results)
        {
            console.log(err)
            console.log(results)
        })
}

const viewRoles = () =>
{
    db.query(`
        SELECT * FROM role;
        `, function(err, results)
        {
            console.log(err)
            console.log(results)
        })
}

const viewEmp = () =>
{
    db.query(`
        SELECT * FROM employee;
        `, function(err, results)
        {
            console.log(err)
            console.log(results)
        })
}

const addDep = (dep) =>
{
    db.query(`
    INSERT INTO department (name) VALUES (?);
    `, dep, function(err, results)
    {
        console.log(err)
        console.log(results)
    })
}

const addRole = (title, salary, deparment_id) =>
{
    db.query(`
        INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);
        `, [title, salary, deparment_id], function(err, results)
        {
            console.log(err)
            console.log(results)
        })
}

const addEmp = (first, last, role, man) =>
{
    new Promise((resolve,reject) =>
    {
        db.query(`
        SELECT id FROM role WHERE title = ?;
        `, role, function(err, results)
        {
            console.log(err)
            console.log(results)
            resolve(results.id)
        })
    })
    .then(function(data)
    {
        let roleId = data;
        console.log(first,last,roleId,man)
        db.query(`
        INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);
        `, [first, last, roleId, man], function(err, results)
        {
            console.log(err)
            console.log(results)
        })
    })
    
}

const updateEmp = (role, id) =>
{
    db.query(`
        UPDATE employee SET role_id = ? WHERE id = ?;
        `, [role, id], function(err, results)
        {
            console.log(err)
            console.log(results)
        })
}

const getDep = async () =>
{   
    new Promise((resolve, reject) =>
    {
        let query = `SELECT * FROM department;`
        const dbPromise = db.promise();
        resolve(dbPromise.query(query))
    })    
    .then(function(data)
    {
        let depListChoices = [];
        const [rows, list] = data;
        for(let i = 0; i < rows.length; i++)
        {
            depListChoices.push(rows[i].name)
        }
        return depListChoices
    })
    .then(function(data)
    {
        inquirer
        .prompt([
            {
                type: "input",
                name: "first",
                message: "Whats the employees first name?"
            },
            {
                type: "input",
                name: "last",
                message: "Whats the employees last name"
            },
            {
                type: "list",
                name: "role",
                message: "What would you like to do?",
                choices: data                             
            },
            {
                type: "input",
                name: "manager",
                message: "Whats the employees Manager"
            },
        
        ]).then(function(data) 
        {
            const {first, last, role, manager} = data;
            addEmp(first,last,role, manager);
            manageEmp();
            
        })
 
    })
}


// const getDep = async () =>
// {
//     return await getResult();
//     async function getResult()
//     {
        
//         let depListChoices = [];
//         list = await doQuery();
//         async function doQuery()
//         {
//             let query = `SELECT * FROM department;`
//             const dbPromise = db.promise();
//             const [rows, list] = await dbPromise.query(query);
//             return await getDep(rows)
//         }    
//         async function getDep(rows)
//         {
//             for(let i = 0; i < rows.length; i++)
//             {
//                 depListChoices.push(rows[i].name)
//             }
//             // console.log(depListChoices)
//             return depListChoices
            
//         }
//         return list
//     }    
// }
