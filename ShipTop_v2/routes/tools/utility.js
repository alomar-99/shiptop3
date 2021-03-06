
function getDateTime(){ //returns the current date and time
    const today = new Date()
    const date = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate();
    const time = today.getHours()+":"+today.getMinutes()+":"+today.getSeconds();
    return date + " " + time;
}

function capitalize(name){ //takes any name and capitalizes the first letter only
    return name.charAt(0).toUpperCase() + name.substring(1).toLowerCase();
}

function equality(filterList,i){
    let SQL ="";
    if(String(filterList[i]).includes("<x<")) SQL += " BETWEEN "+ filterList[i].substring(0,filterList[i].indexOf("<")) + " AND " + filterList[i].substring(filterList[i].lastIndexOf("<")+1) + " ";
    else if (String(filterList[i]).includes("<")||String(filterList[i]).includes(">")||String(filterList[i]).includes("!=")) SQL += filterList[i] + " ";
    else if(typeof filterList[i]=="string") SQL += " = '"+ filterList[i] + "' ";
    else SQL += " = "+ filterList[i] + " ";
    return SQL;
}

function isOwner(adminID){
    return "SELECT IF(MIN(employeeID)="+adminID+",true,false) AS IsOwner FROM employee WHERE role = 'AD'";
}

const defaultOW = {
    "firstName": "Owner",
    "lastName": "Owner",
    "role":"AD",
    "email": "owner@ow.com",
    "phoneNumber":"123456789",
    "password":"1234"
};




module.exports = {
    getDateTime,capitalize,equality,isOwner,defaultOW
}

