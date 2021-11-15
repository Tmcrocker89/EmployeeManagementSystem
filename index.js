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
                    getDep()

                    break;
                case "Add an employee":
                    getRole();
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
                    console.log(getList)
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
        // console.log(results)
    })
}

const addRole = (title, salary, department) =>
{
    new Promise((resolve,reject) =>
    {
        // let query = `SELECT * FROM department WHERE name = ?`, department;
        const dbPromise = db.promise();
        console.log(department)
        resolve(dbPromise.query(`SELECT * FROM department WHERE name = ?`, department))
    })
    .then(function(data)
    {
        const [rows, list] = data;
        let depId = rows[0].id;
        db.query(`
            INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);
            `, [title, salary, depId], function(err, results)
            {
             console.log(err)
                // console.log(results)
            })
    })
}

const addEmp = (first, last, role, man) =>
{
    new Promise((resolve,reject) =>
    {
        console.log(role)
        db.query(`
        SELECT id FROM role WHERE title = ?;
        `, role, function(err, results)
        {
            console.log(err)
            console.log(results)
            resolve(results)
        })
    })
    .then(function(data)
    {
        const [rows, list] = data;
        let roleId = rows.id;
        console.log(roleId)
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
            // console.log(results)
        })
}

const getRole = async () =>
{  
    let roles; 
    new Promise((resolve, reject) =>
    {
        let query = `SELECT * FROM role;`
        const dbPromise = db.promise();
        resolve(dbPromise.query(query))
    })    
    .then(function(data)
    {
        let roleListChoices = [];
        const [rows, list] = data;
        for(let i = 0; i < rows.length; i++)
        {
            roleListChoices.push(`${rows[i].title}`)
        }
        return roleListChoices
    })
    .then(function(data)
    {
        roles = data;
        return new Promise((resolve,reject) =>
        {
            let query2 = `SELECT * FROM employee WHERE role_id = 1;`
            const dbPromise2 = db.promise();
            return resolve(dbPromise2.query(query2)) 
        })
    })
    .then(function(data)
    {
        console.log('why')
        let managerListChoices = [];
        const [rows, list] = data;
        // console.log(rows)
        for(let i = 0; i < rows.length; i++)
        {
            managerListChoices.push(`${rows[i].id} ${rows[i].first_name} ${rows[i].last_name}`)
        }
        return managerListChoices
    })
    .then(function(data)
    {
        let managers = data;
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
                choices: roles                             
            },
            {
                type: "list",
                name: "manager",
                message: "Whats the employees Manager",
                choices: managers
            },
        
        ]).then(function(data) 
        {
            const {first, last, role, manager} = data;
            let managerId = manager.slice(0,1);
            addEmp(first,last,role, managerId);
            manageEmp();
            
        })
 
    })
}

const getDep = async () =>
{  
    let departments; 
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
        departments = data;
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
                type: "list",
                name: "dep",
                message: "Whats the deparment for the roll in?",
                choices: departments

            },
        ]).then(function(data)
        {
            const { role, salary, dep } = data;
            addRole(role, salary, dep);
            manageEmp();
        })
 
    })
}


