const manageEmp = require("./ManageEmp");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const db = require('./db');


const addRole = async () =>
{  
    let departments; 
    let query = `SELECT * FROM department;`
    const dbPromise = db.promise();
    return dbPromise.query(query)
   
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
        return inquirer
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
            insertRole(role, salary, dep);
            
        })
 
    });
}

const insertRole = (title, salary, department) =>
{
    const dbPromise = db.promise();
    return dbPromise.query(`SELECT * FROM department WHERE name = ?`, department)
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
};


module.exports = addRole;