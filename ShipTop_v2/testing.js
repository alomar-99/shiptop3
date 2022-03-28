//imports
const fs = require('fs');
const shipments = require('./server/shipment');
const warehouses = require('./server/warehouse');
const wManager = require('./server/warehouseManager');
const logManager = require('./server/logisticManager');
const employee = require('./server/employee')
const shelf = require('./server/shelf')
const worker = require('./server/worker');
const consignor = require('./server/consignor')


//test this
let myWorker = new worker.Worker(973306,"khalid","qasim","k8474@gmail.com",'966548546325','hud72947',78948)
let myShelf = new shelf.Shelf(12,8,3,9,"second",false, 65468,3548);
let myShipment = new shipments.Shipment(12371,35529,35.3,'led light',30.0,12.0,10.4,1,'arrived','996553322100','Dhahran','testAddress4','ahmed','Jeddah','Mekkah','2022-5-28','2022-2-10')
let myWManager = new wManager.warehouseManager(33974,'Ali','Al-khalidy','aliKhalid@gmail.com','996553972100','q1w2e3r4','78948');
let myConsignor = new consignor.Consignor(45893, 'Ali','Al-khalidy','aliKhalid@gmail.com','996553972100','q1w2e3r4');
let myLogisticManager = new logManager.LogisticManager()
// myWorker.locateShipmet(myShipment,myShelf);

// myWManager.addShipment(myShipment);
// myWManager.addWorker(myWorker);
// myWManager.addConsignor(myConsignor);
// myWManager.deleteWorker(myWorker);
myWManager.changePassword("hj86");