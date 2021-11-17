const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require('console.table');
const db = require('./db');


//a formatted table showing department names and department ids
const viewDpt = () =>
{
    db.query(`
        SELECT name, id FROM department;
        `, function(err, results)
        {
            console.log(err)
            console.table(results)
        })
}
//job title, role id, the department that role belongs to, and the salary for that role
const viewRoles = () =>
{
    db.query(`
        SELECT role.id, title, name as department, salary FROM role join department on role.department_id = department.id;
        `, function(err, results)
        {
            console.log(err)
            console.table(results)
        })
}
//a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
const viewEmp = () =>
{
    db.query(`
    SELECT A.id, A.first_name, A.last_name, title, department.id as department, salary, CONCAT(B.first_name," ", B.last_name) AS Manager FROM employee A 
    LEFT JOIN employee B ON A.manager_id = B.id JOIN role ON A.role_id = role.id JOIN department ON role.department_id = department.id ;

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