const mysql = require("mysql2");
const inquirer = require("inquirer");
const addRole = require("./AddRole")
const addEmp = require("./AddEmployee")
const db = require('./db');



const viewDpt = () =>
{
    db.query(`
        SELECT * FROM department;
        `, function(err, results)
        {
            console.log(err)
            console.table(results)
        })
}

const viewRoles = () =>
{
    db.query(`
        SELECT * FROM role;
        `, function(err, results)
        {
            console.log(err)
            console.table(results)
        })
}

const viewEmp = () =>
{
    db.query(`
        SELECT * FROM employee;
        `, function(err, results)
        {
            console.log(err)
            console.table(results)
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




// module.exports = viewDpt;
// module.exports = viewRoles;
// module.exports = viewEmp;
// module.exports = addDep;
// module.exports = updateEmp;

module.exports = {
    viewDpt,
    viewRoles,
    viewEmp,
    addDep
}