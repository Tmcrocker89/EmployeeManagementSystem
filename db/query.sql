-- SELECT first_name, last_name, title, salary
-- FROM role
-- JOIN employee ON role.id = employee.role_id;


-- join multiple tables
SELECT first_name, last_name, title, name as department, salary
FROM role

JOIN (employee, department) ON (role.id = employee.role_id AND role.department_id = department.id);
