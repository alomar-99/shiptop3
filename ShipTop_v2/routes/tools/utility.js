
function getDateTime(){ //returns the current date and time
    const today = new Date()
    const date = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate();
    const time = today.getHours()+":"+today.getMinutes()+":"+today.getSeconds();
    return date + " " + time;
}

function capitalize(name){ //takes any name and capitalizes the first letter only
    return name.charAt(0).toUpperCase() + name.substring(1).toLowerCase();
}


module.exports = {
    getDateTime,capitalize,
}

