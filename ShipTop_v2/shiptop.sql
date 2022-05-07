SELECT ord.ID, CE.location, CE.address, CE.phoneNumber, inv.date, inv.paymentMethod,
inv.amount

-- , count(ship.shipmentID) AS Total_shipment, count(del.shipmentID) AS deliveredShipments
 FROM consignororder ord
 INNER JOIN ordershipment ship
 INNER JOIN shipmentdelivery del 
 INNER JOIN consignee CE
 INNER JOIN invoice inv
 INNER JOIN orderupdate upd
 INNER JOIN orderpayment pay
 ON upd.updatedBy = 16
 AND ord.ID = 79
 AND upd.orderID = ord.ID
 AND ship.orderID = ord.ID 
 AND CE.orderID = ord.ID
 AND pay.orderID = ord.ID
 AND pay.invoiceID = inv.invoiceID
 AND del.shipmentID = ship.shipmentID
 
 GROUP BY ord.ID
