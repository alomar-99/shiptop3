
INSERT INTO employees 
SELECT CASE
    WHEN warehousemanagers.email = "k867354@gmail.com" THEN employees.employeeID = "WM12"
    END
firstName, lastName, email, phoneNumber, password, updatedBy, lastUpdate
FROM warehousemanagers 
Where warehousemanagers.email = "k867354@gmail.com"

INSERT INTO employees 
SELECT warehouseManagerID,
firstName, lastName, email, phoneNumber, password, updatedBy, lastUpdate
FROM warehousemanagers 
Where warehousemanagers.email = "k867354@gmail.com"

INSERT INTO employees 
SELECT CASE
    WHEN email = "k867354@gmail.com" THEN warehouseManagerID = 20
    END
firstName, lastName, email, phoneNumber, password, updatedBy, lastUpdate
FROM warehousemanagers 
Where warehousemanagers.email = "k867354@gmail.com"

INSERT INTO employees 
SELECT CAST ( warehouseManagerID AS VARCHAR(10) ),
firstName, lastName, email, phoneNumber, password, updatedBy, lastUpdate
FROM warehousemanagers 
Where warehousemanagers.email = "k867354@gmail.com"

INSERT INTO employees 
SELECT CONVERT (VARCHAR,warehouseManagerID ),
firstName, lastName, email, phoneNumber, password, updatedBy, lastUpdate
FROM warehousemanagers 
Where warehousemanagers.email = "k867354@gmail.com"

INSERT INTO employees(employeeID)
SELECT warehouseManagerID
FROM warehousemanagers 
Where warehousemanagers.email = "k867354@gmail.com"