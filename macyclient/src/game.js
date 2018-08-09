import {dip1900} from './board-spec';

let session = {
    title: "A Game",
    boardSpec: dip1900,
    turns: [
        {
            gameState: {
                year: 1900,
                season: "Spring",
                factions : {
                    "Great Britain": {
                        fleet: ["Edinburgh", "Gibraltar", "Egypt", "London"],
                        army: [],
                        supplyCenters: ["London", "Edinburgh", "Liverpool", "Egypt"]
                    },
                    "Germany": {
                        fleet: ["Kiel"],
                        army: ["Cologne", "Munich", "Berlin"],
                        supplyCenters: ["Kiel", "Cologne", "Munich", "Berlin"]
                    },
                    "France": {
                        fleet: ["Brest"],
                        army: ["Paris", "Marseilles", "Algeria"],
                        supplyCenters: ["Brest", "Paris", "Marseilles", "Algeria"]
                    },
                    "Italy": {
                        fleet: ["Naples"],
                        army: ["Milan", "Rome"],
                        supplyCenters: ["Naples", "Milan", "Rome"],
                    },
                    "Austria Hungary": {
                        fleet: ["Trieste"],
                        army: ["Vienna", "Budapest"],
                        supplyCenters: ["Trieste", "Vienna", "Budapest"]
                    },
                    "Turkey": {
                        fleet: ["Ankara"],
                        army: ["Damascus", "Constantinople"],
                        supplyCenters: ["Ankara", "Damascus", "Constantinople"],
                    },
                    "Russia": {
                        fleet: ["Sevastapol", "St. Petersburg :: SC"],
                        army: ["Moscow", "Warsaw"],
                        supplyCenters: ["Sevastapol", "St. Petersburg", "Moscow", "Warsaw"],
                    },
                },
            },
            orders: [
                {power: "Great Britain", unit: "London", action: "Move", target: "English Channel", viaConvoy: false},
                {power: "Great Britain", unit: "Edinburgh", action: "Move", target: "North Sea", viaConvoy: false},
                {power: "Great Britain", unit: "Gibraltar", action: "Move", target: "Morocco", viaConvoy: false},
                {power: "Great Britain", unit: "Egypt", action: "Move", target: "Mid Atlantic Ocean", viaConvoy: false},
                {power: "Germany", unit: "Kiel", action: "Move", target: "Denmark", viaConvoy: false},
                {power: "Germany", unit: "Berlin", action: "Move", target: "Kiel", viaConvoy: false},
                {power: "Germany", unit: "Cologne", action: "Move", target: "Netherlands", viaConvoy: false},
                {power: "Germany", unit: "Munich", action: "Hold"},
                {power: "France", unit: "Brest", action: "Move", target: "Picardy", viaConvoy: false},
                {power: "France", unit: "Paris", action: "Move", target: "Gascony", viaConvoy: false},
                {power: "France", unit: "Marseilles", action: "Move", target: "Spain", viaConvoy: false},
                {power: "France", unit: "Algeria", action: "Move", target: "Morocco", viaConvoy: false},
                {power: "Italy", unit: "Milan", action: "Move", target: "Switzerland", viaConvoy: false},
                {power: "Italy", unit: "Rome", action: "Move", target: "Piedmont", viaConvoy: false},
                {power: "Italy", unit: "Naples", action: "Move", target: "Ionian Sea", viaConvoy: false},
                {power: "Austria Hungary", unit: "Trieste", action: "Move", target: "Adriatic Sea", viaConvoy: false},
                {power: "Austria Hungary", unit: "Vienna", action: "Move", target: "Budapest", viaConvoy: false},
                {power: "Austria Hungary", unit: "Budapest", action: "Move", target: "Rumania", viaConvoy: false},
                {power: "Turkey", unit: "Constantinople", action: "Move", target: "Macedonia", viaConvoy: false},
                {power: "Turkey", unit: "Ankara", action: "Move", target: "Black Sea", viaConvoy: false},
                {power: "Turkey", unit: "Damascus", action: "Move", target: "Palestine", viaConvoy: false},
                {power: "Russia", unit: "St. Petersburg :: SC", action: "Move", target: "Gulf of Bothnia", viaConvoy: false},
                {power: "Russia", unit: "Moscow", action: "Move", target: "Ukraine", viaConvoy: false},
                {power: "Russia", unit: "Warsaw", action: "Move", target: "Galacia", viaConvoy: false},
                {power: "Russia", unit: "Sevastapol", action: "Move", target: "Rumania", viaConvoy: false},
            ]
        },
        {
            gameState: {
                year: 1900,
                season: "Fall",
                factions : {
                    "Great Britain": {
                        fleet: ["North Sea", "Gibraltar", "English Channel", "Mid Atlantic Ocean"],
                        army: [],
                        supplyCenters: ["London", "Edinburgh", "Liverpool", "Egypt"]
                    },
                    "Germany": {
                        fleet: ["Denmark"],
                        army: ["Netherlands", "Munich", "Kiel"],
                        supplyCenters: ["Kiel", "Cologne", "Munich", "Berlin"]
                    },
                    "France": {
                        fleet: ["Picardy"],
                        army: ["Gascony", "Spain", "Algeria"],
                        supplyCenters: ["Brest", "Paris", "Marseilles", "Algeria"]
                    },
                    "Italy": {
                        fleet: ["Ionian Sea"],
                        army: ["Switzerland", "Piedmont"],
                        supplyCenters: ["Naples", "Milan", "Rome"],
                    },
                    "Austria Hungary": {
                        fleet: ["Adriatic Sea"],
                        army: ["Vienna", "Budapest"],
                        supplyCenters: ["Trieste", "Vienna", "Budapest"]
                    },
                    "Turkey": {
                        fleet: ["Black Sea"],
                        army: ["Palestine", "Macedonia"],
                        supplyCenters: ["Ankara", "Damascus", "Constantinople"],
                    },
                    "Russia": {
                        fleet: ["Sevastapol", "Gulf of Bothnia"],
                        army: ["Ukraine", "Galacia"],
                        supplyCenters: ["Sevastapol", "St. Petersburg", "Moscow", "Warsaw"],
                    },
                },
            },
            orders: [
                {power: "Great Britain", unit: "North Sea", action: "Move", target: "Norway", viaConvoy: false},
                {power: "Great Britain", unit: "English Channel", action: "Move", target: "Belgium", viaConvoy: false},
                {power: "Great Britain", unit: "Gibraltar", action: "Support", targetUnit: "Mid Atlantic Ocean", target: "Morocco"},
                {power: "Great Britain", unit: "Mid Atlantic Ocean", action: "Move", target: "Morocco", viaConvoy: false},
                {power: "Germany", unit: "Denmark", action: "Move", target: "Sweden", viaConvoy: false},
                {power: "Germany", unit: "Kiel", action: "Hold", viaConvoy: false},
                {power: "Germany", unit: "Netherlands", action: "Hold", viaConvoy: false},
                {power: "Germany", unit: "Munich", action: "Hold"},
                {power: "France", unit: "Picardy", action: "Move", target: "Belgium", viaConvoy: false},
                {power: "France", unit: "Gascony", action: "Move", target: "Spain", viaConvoy: false},
                {power: "France", unit: "Spain", action: "Move", target: "Portugal", viaConvoy: false},
                {power: "France", unit: "Algeria", action: "Move", target: "Morocco", viaConvoy: false},
                {power: "Italy", unit: "Switzerland", action: "Hold"},
                {power: "Italy", unit: "Piedmont", action: "Move", target: "Marseilles", viaConvoy: false},
                {power: "Italy", unit: "Ionian Sea", action: "Move", target: "Tripoltania", viaConvoy: false},
                {power: "Austria Hungary", unit: "Adriatic Sea", action: "Move", target: "Ionian Sea", viaConvoy: false},
                {power: "Austria Hungary", unit: "Vienna", action: "Move", target: "Budapest", viaConvoy: false},
                {power: "Austria Hungary", unit: "Budapest", action: "Move", target: "Serbia", viaConvoy: false},
                {power: "Turkey", unit: "Macedonia", action: "Move", target: "Greece", viaConvoy: false},
                {power: "Turkey", unit: "Black Sea", action: "Support", targetUnit: "Sevastapol", target: "Rumania"},
                {power: "Turkey", unit: "Palestine", action: "Move", target: "Egypt", viaConvoy: false},
                {power: "Russia", unit: "Gulf of Bothnia", action: "Move", target: "Sweden", viaConvoy: false},
                {power: "Russia", unit: "Ukraine", action: "Move", target: "Warsaw", viaConvoy: false},
                {power: "Russia", unit: "Galacia", action: "Support", targetUnit: "Sevastapol", target: "Rumania"},
                {power: "Russia", unit: "Sevastapol", action: "Move", target: "Rumania", viaConvoy: false},
            ]
        },
        {
            gameState: {
                year: 1900,
                season: "Winter",
                factions : {
                    "Great Britain": {
                        fleet: ["Norway", "Gibraltar", "English Channel", "Morocco"],
                        army: [],
                        supplyCenters: ["London", "Edinburgh", "Liverpool", "Morocco", "Norway"]
                    },
                    "Germany": {
                        fleet: ["Denmark"],
                        army: ["Netherlands", "Munich", "Kiel"],
                        supplyCenters: ["Kiel", "Cologne", "Munich", "Berlin", "Denmark", "Netherlands"]
                    },
                    "France": {
                        fleet: ["Picardy"],
                        army: ["Portugal", "Spain", "Algeria"],
                        supplyCenters: ["Brest", "Paris", "Algeria", "Spain", "Portugal"]
                    },
                    "Italy": {
                        fleet: ["Tripoltania"],
                        army: ["Switzerland", "Marseilles"],
                        supplyCenters: ["Naples", "Milan", "Rome", "Tripoltania", "Switzerland", "Marseilles"],
                    },
                    "Austria Hungary": {
                        fleet: ["Ionian Sea"],
                        army: ["Serbia", "Budapest"],
                        supplyCenters: ["Trieste", "Vienna", "Budapest", "Serbia"]
                    },
                    "Turkey": {
                        fleet: ["Black Sea"],
                        army: ["Egypt", "Greece"],
                        supplyCenters: ["Ankara", "Damascus", "Constantinople", "Greece", "Egypt"],
                    },
                    "Russia": {
                        fleet: ["Rumania", "Gulf of Bothnia"],
                        army: ["Warsaw", "Galacia"],
                        supplyCenters: ["Sevastapol", "St. Petersburg", "Moscow", "Warsaw", "Rumania"],
                    },
                },
            },
            orders: [
                {power: "Great Britain", unit: "London", action: "Build", unitType: "army"},
                {power: "France", unit: "Paris", action: "Build", unitType: "army"},
                {power: "Italy", unit: "Rome", action: "Build", unitType: "fleet"},
                {power: "Italy", unit: "Naples", action: "Build", unitType: "fleet"},
                {power: "Italy", unit: "Milan", action: "Build", unitType: "army"},
                {power: "Austria Hungary", unit: "Vienna", action: "Build", unitType: "army"},
                {power: "Turkey", unit: "Constantinople", action: "Build", unitType: "army"},
                {power: "Turkey", unit: "Damascus", action: "Build", unitType: "fleet"},
                {power: "Germany", unit: "Cologne", action: "Build", unitType: "army"},
                {power: "Germany", unit: "Berlin", action: "Build", unitType: "army"},
                {power: "Russia", unit: "St. Petersburg :: NC", action: "Build", unitType: "fleet"},
            ]
        },
        {
            gameState: {
                year: 1901,
                season: "Spring",
                factions : {
                    "Great Britain": {
                        fleet: ["Norway", "Gibraltar", "English Channel", "Morocco"],
                        army: ["London"],
                        supplyCenters: ["London", "Edinburgh", "Liverpool", "Morocco", "Norway"]
                    },
                    "Germany": {
                        fleet: ["Denmark"],
                        army: ["Netherlands", "Munich", "Kiel", "Cologne", "Berlin"],
                        supplyCenters: ["Kiel", "Cologne", "Munich", "Berlin", "Denmark", "Netherlands"]
                    },
                    "France": {
                        fleet: ["Picardy"],
                        army: ["Portugal", "Spain", "Algeria", "Paris"],
                        supplyCenters: ["Brest", "Paris", "Algeria", "Spain", "Portugal"]
                    },
                    "Italy": {
                        fleet: ["Tripoltania", "Naples", "Rome"],
                        army: ["Switzerland", "Marseilles", "Milan"],
                        supplyCenters: ["Naples", "Milan", "Rome", "Tripoltania", "Switzerland", "Marseilles"],
                    },
                    "Austria Hungary": {
                        fleet: ["Ionian Sea"],
                        army: ["Serbia", "Budapest", "Vienna"],
                        supplyCenters: ["Trieste", "Vienna", "Budapest", "Serbia"]
                    },
                    "Turkey": {
                        fleet: ["Black Sea", "Damascus"],
                        army: ["Egypt", "Greece", "Constantinople"],
                        supplyCenters: ["Ankara", "Damascus", "Constantinople", "Greece", "Egypt"],
                    },
                    "Russia": {
                        fleet: ["Rumania", "Gulf of Bothnia", "St. Petersburg :: NC"],
                        army: ["Warsaw", "Galacia"],
                        supplyCenters: ["Sevastapol", "St. Petersburg", "Moscow", "Warsaw", "Rumania"],
                    },
                },
            },
            orders: [
            ]
        },
    ]
}


module.exports = {
    session: session,
}