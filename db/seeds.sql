INSERT INTO department (name)
VALUES ("HR"),
       ("Management"),
       ("Engineering"),
       ("Information Technology"),
       ("Maintenance");

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 70000, 2),
       ("Developer", 90000, 3),
       ("Electrician", 85000, 5),
       ("Trouble Shooter", 70000, 5),
       ("Lead Developer", 110000, 3),
       ("Student", 35000, 4),
       ("Systems Expert", 60000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Stephen", "Smith", 1, 0),
       ("Travis", "Crocker", 2, 1),
       ("Josh", "Stone", 5, 1),
       ("Jacob", "Webb", 1, 0),
       ("Brandon", "Anderson", 7, 4),
       ("Ramey", "Stevens", 4, 1),
       ("David", "Patterson", 6, 1);