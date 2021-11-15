const mysql = require("mysql2");
const inquirer = require("inquirer");

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
  );

const updateEmp = (role, id) =>
{
    let dataArr;
    let departments; 
    let roles; 
    new Promise((resolve, reject) =>
    {
        let query = `select first_name, last_name, title from employee join role on employee.role_id = role.id;`
        const dbPromise = db.promise();
        resolve(dbPromise.query(query))
    })    
    .then(function(data)
    {
        let empListChoices = [];
        const [rows, list] = data;
        for(let i = 0; i < rows.length; i++)
        {
            empListChoices.push(`${rows[i].last_name},${rows[i].first_name},${rows[i].title}`)
        }
        return empListChoices
    })
    .then(function(data)
    {
        let empList = data;
        inquirer
        .prompt([
            {
                type: "list",
                name: "info",
                message: "What employee do you want to change?",
                choices: empList
            }
        ])    
        .then(function(data)
        {
            dataArr = data.info.split(",")
            console.log(dataArr[0], dataArr[1], dataArr[2])
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
                console.log(data)
                roles = data;
                inquirer
                .prompt([
                    {
                        type: "list",
                        name: "selectedRole",
                        message: "What roll do you want to assign",
                        choices: roles,
                    }
                ])
                .then(function(results)
                {
                    let selectedRole = results.selectedRole;
                    new Promise((resolve, reject) =>
                    {
                        const dbPromise = db.promise();
                        resolve(dbPromise.query(`SELECT id FROM role WHERE title = ?`,selectedRole))
                    })    
                    .then(function(data)
                    {
                        const [rows, list] = data;
                        let selectedId = rows[0].id
                        db.query(`
                        UPDATE employee SET role_id = ? WHERE last_name = ? AND first_name = ? ;
                        `, [selectedId, dataArr[0], dataArr[1]], function(err, results)
                        {
                            console.log(err)
                            // console.log(results)
                        })
                    }) 
                })
                
                  
            })
            
        })
        
        
    })
    
    
}

module.exports = {
    updateEmp
}