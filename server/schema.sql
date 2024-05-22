DROP DATABASE IF EXISTS expense;
CREATE DATABASE expense;
USE expense;

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE expense_groups (
  group_id INT AUTO_INCREMENT PRIMARY KEY,
  group_name VARCHAR(255),
  description TEXT
);

CREATE TABLE user_group (
  user_id INT,
  group_id INT,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (group_id) REFERENCES expense_groups(group_id)
);

CREATE TABLE expense (
  expense_id INT AUTO_INCREMENT PRIMARY KEY,
  expense DECIMAL (10,2) NOT NULL,
  description TEXT,
  user_id INT,
  group_id INT,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (group_id) REFERENCES expense_groups(group_id)
);

CREATE TABLE invites (
	sent_from INT,
    sent_to INT,
    group_id INT,
    FOREIGN KEY (sent_from) REFERENCES users(user_id),
    FOREIGN KEY (sent_to) REFERENCES users(user_id),
    FOREIGN KEY (group_id) REFERENCES expense_groups(group_id)
);