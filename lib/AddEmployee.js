const inquirer = require("inquirer");
const manageEmp = require("./ManageEmp");
const db = require('./db');

const addEmp = () =>
{  
    let firstName,lastName,roleID;
    let roles; 
    let query = `SELECT * FROM role;`
    const dbPromise = db.promise();
    return dbPromise.query(query)   
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
            let query2 = `SELECT * FROM employee WHERE role_id = 1;`
            const dbPromise2 = db.promise();
            return dbPromise2.query(query2)
    })
    .then(function(data)
    {
        let managerListChoices = [];
        const [rows, list] = data;
        // console.log(rows)
        for(let i = 0; i < rows.length; i++)
        {
            managerListChoices.push(`${rows[i].first_name} ${rows[i].last_name}`)
        }
        managerListChoices.push('None')
        return managerListChoices
    })
    .then(function(data)
    {
        let managers = data;
        return inquirer
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
            firstName = first;
            lastName = last;
            roleID = role;
            let manName = manager.split(" ");
            let manFirst = manName[0];
            let manLast = manName[1];
            console.log(manName, manFirst, manLast)
            const dbPromise2 = db.promise();
            return dbPromise2.query(`SELECT id FROM employee WHERE first_name = ? AND last_name = ?`,[manFirst, manLast])
            
            
        })
        .then(function(data)
        {
            const [rows, list] = data;
            const managerId = rows[0].id;
            return insertEmp(firstName,lastName,roleID, managerId);
        })
 
    })
}


const insertEmp = (first, last, role, man) =>
{
    return new Promise((resolve,reject) =>
    {
        db.query(`
        SELECT id FROM role WHERE title = ?;
        `, role, function(err, results)
        {
            console.log(err)
            // console.log(results)
            resolve(results)
        })
    })
    .then(function(data)
    {
        const [rows, list] = data;
        let roleId = rows.id;
        db.query(`
        INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);
        `, [first, last, roleId, man], function(err, results)
        {
            if(err)
            {
                throw err
            }
           
            // console.log(results)
        })
    })
    
}

module.exports = addEmp;