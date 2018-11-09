        

module.exports = {
    getAllowedOrderModes: (season) => {
        let orderModes = [];
        if (season === "Spring" || season === "Fall"){
            orderModes = ["Move", "Move (Convoy)", "Support", "Convoy"];
        } else if (season === "Winter") {
            orderModes = ["Build Army", "Build Fleet", "Disband"];
        } else if (season.includes("Retreat")) {
            orderModes = ["Retreat", "Disband"];
        }
        return orderModes;
    }
}