
import Graph from '../game/graph';
import {paths} from './trad-paths';
import {SaveBoardSpecToSerializable} from '../board-spec';
import {copyTextToClipboard} from '../web-utils';

let bij = (g, a, b, d = 1) => {
    g.addEdge(a, b, d);
    g.addEdge(b, a, d);
};

let provinces = [
    "Edinburgh",
    "Ireland",
    "Clyde",
    "Liverpool",
    "Wales",
    "London",
    "York",

    "Ruhr",
    "Munich",
    "Kiel",
    "Berlin",
    "Prussia",
    "Silesia",

    "Bohemia",
    "Tyrolia",
    "Galacia",
    "Vienna",
    "Budapest",
    "Trieste",

    "Switzerland",
    "Belgium",
    "Holland",

    "Picardy",
    "Burgundy",
    "Brest",
    "Paris",
    "Gascony",
    "Marseilles",

    "Portugal",
    "Spain",
    "North Africa",
    "Tunisia",

    "Napoli",
    "Apulia",
    "Roma",
    "Venezia",
    "Tuscany",
    "Piedmont",

    "Norway",
    "Sweden",
    "Denmark",

    "Finland",
    "St. Petersburg",
    "Moscow",
    "Ukraine",
    "Livonia",
    "Warsaw",
    "Sevastapol",

    "Armenia",
    "Ankara",
    "Constantinople",
    "Syria",
    "Smyrna",

    "Rumania",
    "Bulgaria",
    "Serbia",
    "Albania",
    "Greece"
];

let coasts = [
    "Clyde",
    "Liverpool",
    "Edinburgh",
    "Wales",
    "London",
    "York",

    "Kiel",
    "Berlin",
    "Prussia",

    "Trieste",

    "Belgium",
    "Holland",

    "Picardy",
    "Brest",
    "Gascony",
    "Marseilles",

    "Portugal",
    "Spain :: SC",
    "Spain :: NC",
    "North Africa",
    "Tunisia",

    "Napoli",
    "Apulia",
    "Roma",
    "Venezia",
    "Tuscany",
    "Piedmont",

    "Norway",
    "Sweden",
    "Denmark",

    "Finland",
    "St. Petersburg :: SC",
    "St. Petersburg :: NC",
    "Livonia",
    "Sevastapol",

    "Armenia",
    "Ankara",
    "Constantinople",
    "Smyrna",
    "Bulgaria :: EC",
    "Bulgaria :: SC",
    "Syria",

    "Rumania",
    "Albania",
    "Greece"
];

let seas = [
    "Barents Sea",
    "Norwegian Sea",
    "North Atlantic Ocean",
    "Mid Atlantic Ocean",
    "North Sea",
    "Irish Sea",
    "English Channel",
    "Skagerrak",
    "Helgoland Bight",
    "Baltic Sea",
    "Gulf of Bothnia",
    "Western Mediterranean",
    "Gulf of Lyon",
    "Tyrrhenian Sea",
    "Ionian Sea",
    "Aegean Sea",
    "Adriatic Sea",
    "Eastern Mediterranean",
    "Black Sea",
];

let multiCoast = {
    "St. Petersburg": ["NC", "SC"],
    "Spain": ["SC", "NC"],
    "Bulgaria": ["SC", "EC"]
};

let armyGraph = new Graph();
provinces.forEach((p) => {armyGraph.addNode(p);});

bij(armyGraph, "Clyde", "Edinburgh");
bij(armyGraph, "Clyde", "Liverpool");
bij(armyGraph, "Edinburgh", "York");
bij(armyGraph, "Edinburgh", "Liverpool");
bij(armyGraph, "Liverpool", "York");
bij(armyGraph, "Liverpool", "Wales");
bij(armyGraph, "York", "Wales");
bij(armyGraph, "York", "London");
bij(armyGraph, "London", "Wales");

bij(armyGraph, "Portugal", "Spain");
bij(armyGraph, "Spain", "Gascony");
bij(armyGraph, "Spain", "Marseilles");

bij(armyGraph, "Gascony", "Brest");
bij(armyGraph, "Gascony", "Marseilles");
bij(armyGraph, "Gascony", "Paris");
bij(armyGraph, "Gascony", "Burgundy");
bij(armyGraph, "Marseilles", "Burgundy");
bij(armyGraph, "Marseilles", "Piedmont");
bij(armyGraph, "Brest", "Picardy");
bij(armyGraph, "Brest", "Paris");
bij(armyGraph, "Paris", "Burgundy");
bij(armyGraph, "Paris", "Picardy");
bij(armyGraph, "Burgundy", "Picardy");
bij(armyGraph, "Burgundy", "Belgium");
bij(armyGraph, "Burgundy", "Ruhr");
bij(armyGraph, "Picardy", "Belgium");

bij(armyGraph, "Belgium", "Ruhr");
bij(armyGraph, "Belgium", "Holland");
bij(armyGraph, "Holland", "Kiel");
bij(armyGraph, "Holland", "Ruhr");

bij(armyGraph, "Piedmont", "Tuscany");
bij(armyGraph, "Piedmont", "Venezia");
bij(armyGraph, "Piedmont", "Tyrolia");
bij(armyGraph, "Tuscany", "Venezia");
bij(armyGraph, "Tuscany", "Roma");
bij(armyGraph, "Venezia", "Tyrolia");
bij(armyGraph, "Venezia", "Apulia");
bij(armyGraph, "Venezia", "Roma");
bij(armyGraph, "Rome", "Apulia");
bij(armyGraph, "Rome", "Napoli");
bij(armyGraph, "Apulia", "Napli");

bij(armyGraph, "Ruhr", "Kiel");
bij(armyGraph, "Ruhr", "Munich");
bij(armyGraph, "Munich", "Kiel");
bij(armyGraph, "Munich", "Berlin");
bij(armyGraph, "Munich", "Silesia");
bij(armyGraph, "Munich", "Bohemia");
bij(armyGraph, "Munich", "Tyrolia");
bij(armyGraph, "Kiel", "Denmark");
bij(armyGraph, "Kiel", "Berlin");
bij(armyGraph, "Berlin", "Silesia");
bij(armyGraph, "Berlin", "Prussia");
bij(armyGraph, "Silesia", "Bohemia");
bij(armyGraph, "Silesia", "Warsaw");
bij(armyGraph, "Silesia", "Galacia");
bij(armyGraph, "Silesia", "Prussia");
bij(armyGraph, "Prussia", "Livonia");
bij(armyGraph, "Prussia", "Warsaw");

bij(armyGraph, "Denmark", "Sweden");
bij(armyGraph, "Sweden", "Norway");
bij(armyGraph, "Sweden", "Finland");
bij(armyGraph, "Norway", "Finland");
bij(armyGraph, "Norway", "St. Petersburg");
bij(armyGraph, "Finland", "St. Petersburg");
bij(armyGraph, "St. Petersburg", "Livonia");
bij(armyGraph, "St. Petersburg", "Moscow");
bij(armyGraph, "Moscow", "Livonia");
bij(armyGraph, "Moscow", "Warsaw");
bij(armyGraph, "Moscow", "Ukraine");
bij(armyGraph, "Moscow", "Sevastapol");
bij(armyGraph, "Livonia", "Warsaw");
bij(armyGraph, "Warsaw", "Galacia");
bij(armyGraph, "Warsaw", "Ukraine");
bij(armyGraph, "Ukraine", "Sevastapol");
bij(armyGraph, "Ukraine", "Galacia");
bij(armyGraph, "Ukraine", "Rumania");
bij(armyGraph, "Sevastapol", "Rumania");
bij(armyGraph, "Sevastapol", "Armenia");

bij(armyGraph, "Rumania", "Bulgaria");
bij(armyGraph, "Rumania", "Serbia");
bij(armyGraph, "Rumania", "Galacia");
bij(armyGraph, "Rumania", "Budapest");
bij(armyGraph, "Bulgaria", "Serbia");
bij(armyGraph, "Bulgaria", "Greece");
bij(armyGraph, "Bulgaria", "Constantinople");
bij(armyGraph, "Serbia", "Budapest");
bij(armyGraph, "Serbia", "Trieste");
bij(armyGraph, "Serbia", "Albania");
bij(armyGraph, "Serbia", "Greece");
bij(armyGraph, "Albania", "Trieste");
bij(armyGraph, "Albania", "Greece");

bij(armyGraph, "Constantinople", "Ankara");
bij(armyGraph, "Constantinople", "Smyrna");
bij(armyGraph, "Ankara", "Armenia");
bij(armyGraph, "Ankara", "Smyrna");
bij(armyGraph, "Smyrna", "Armenia");
bij(armyGraph, "Smyrna", "Syria");
bij(armyGraph, "Armenia", "Syria");


bij(armyGraph, "North Africa", "Tunisia");

bij(armyGraph, "Tyrolia", "Bohemia");
bij(armyGraph, "Tyrolia", "Vienna");
bij(armyGraph, "Tyrolia", "Trieste");
bij(armyGraph, "Bohemia", "Galacia");
bij(armyGraph, "Bohemia", "Vienna");
bij(armyGraph, "Vienna", "Galacia");
bij(armyGraph, "Vienna", "Trieste");
bij(armyGraph, "Vienna", "Budapest");
bij(armyGraph, "Budapest", "Trieste");
bij(armyGraph, "Budapest", "Galacia");

let fleetGraph = new Graph();
coasts.forEach((p) => {fleetGraph.addNode(p);});
seas.forEach((p) => {fleetGraph.addNode(p);});

bij(fleetGraph, "Clyde", "Edinburgh");
bij(fleetGraph, "Clyde", "Liverpool");
bij(fleetGraph, "Edinburgh", "York");
bij(fleetGraph, "Liverpool", "Wales");
bij(fleetGraph, "York", "London");
bij(fleetGraph, "London", "Wales");

bij(fleetGraph, "Portugal", "Spain :: NC");
bij(fleetGraph, "Portugal", "Spain :: SC");
bij(fleetGraph, "Spain :: NC", "Gascony");
bij(fleetGraph, "Spain :: SC", "Marseilles");

bij(fleetGraph, "Gascony", "Brest");
bij(fleetGraph, "Marseilles", "Piedmont");
bij(fleetGraph, "Brest", "Picardy");
bij(fleetGraph, "Picardy", "Belgium");

bij(fleetGraph, "Belgium", "Holland");
bij(fleetGraph, "Holland", "Kiel");

bij(fleetGraph, "Piedmont", "Tuscany");
bij(fleetGraph, "Tuscany", "Roma");
bij(fleetGraph, "Roma", "Napoli");
bij(fleetGraph, "Venezia", "Apulia");
bij(fleetGraph, "Apulia", "Napoli");

bij(fleetGraph, "Kiel", "Denmark");
bij(fleetGraph, "Kiel", "Berlin");
bij(fleetGraph, "Berlin", "Prussia");

bij(fleetGraph, "Denmark", "Sweden");
bij(fleetGraph, "Sweden", "Norway");
bij(fleetGraph, "Sweden", "Finland");
bij(fleetGraph, "Norway", "St. Petersburg :: NC");
bij(fleetGraph, "Finland", "St. Petersburg :: SC");
bij(fleetGraph, "St. Petersburg :: SC", "Livonia");
bij(fleetGraph, "Sevastapol", "Rumania");
bij(fleetGraph, "Sevastapol", "Armenia");

bij(fleetGraph, "Rumania", "Bulgaria :: EC");
bij(fleetGraph, "Bulgaria :: EC", "Constantinople");
bij(fleetGraph, "Bulgaria :: SC", "Constantinople");
bij(fleetGraph, "Bulgaria :: SC", "Greece");
bij(fleetGraph, "Greece", "Albania");
bij(fleetGraph, "Albania", "Trieste");

bij(fleetGraph, "Constantinople", "Ankara");
bij(fleetGraph, "Constantinople", "Smyrna");
bij(fleetGraph, "Ankara", "Armenia");
bij(fleetGraph, "Smyrna", "Syria");

bij(fleetGraph, "Tunisia", "North Africa");


bij(fleetGraph, "Barents Sea", "St. Petersburg :: NC");
bij(fleetGraph, "Barents Sea", "Norway");
bij(fleetGraph, "Barents Sea", "Norwegian Sea");
bij(fleetGraph, "Norwegian Sea", "Norway");
bij(fleetGraph, "Norwegian Sea", "North Atlantic Ocean");
bij(fleetGraph, "Norwegian Sea", "Clyde");
bij(fleetGraph, "Norwegian Sea", "Edinburgh");
bij(fleetGraph, "Norwegian Sea", "North Sea");
bij(fleetGraph, "North Atlantic Ocean", "Clyde");
bij(fleetGraph, "North Atlantic Ocean", "Liverpool");
bij(fleetGraph, "North Atlantic Ocean", "Mid Atlantic Ocean");
bij(fleetGraph, "North Atlantic Ocean", "Irish Sea");
bij(fleetGraph, "Irish Sea", "Mid Atlantic Ocean");
bij(fleetGraph, "Irish Sea", "Liverpool");
bij(fleetGraph, "Irish Sea", "Wales");
bij(fleetGraph, "Irish Sea", "Ireland");
bij(fleetGraph, "Irish Sea", "English Channel");
bij(fleetGraph, "Mid Atlantic Ocean", "English Channel");
bij(fleetGraph, "Mid Atlantic Ocean", "Ireland");
bij(fleetGraph, "Mid Atlantic Ocean", "Brest");
bij(fleetGraph, "Mid Atlantic Ocean", "Gascony");
bij(fleetGraph, "Mid Atlantic Ocean", "Spain :: NC");
bij(fleetGraph, "Mid Atlantic Ocean", "Spain :: SC");
bij(fleetGraph, "Mid Atlantic Ocean", "Portugal");
bij(fleetGraph, "Mid Atlantic Ocean", "North Africa");
bij(fleetGraph, "Mid Atlantic Ocean", "Western Mediterranean");
bij(fleetGraph, "English Channel", "London");
bij(fleetGraph, "English Channel", "Brest");
bij(fleetGraph, "English Channel", "Picardy");
bij(fleetGraph, "English Channel", "Belgium");
bij(fleetGraph, "English Channel", "Wales");
bij(fleetGraph, "English Channel", "North Sea");
bij(fleetGraph, "North Sea", "Norway");
bij(fleetGraph, "North Sea", "Skagerrak");
bij(fleetGraph, "North Sea", "Denmark");
bij(fleetGraph, "North Sea", "Helgoland Bight");
bij(fleetGraph, "North Sea", "Holland");
bij(fleetGraph, "North Sea", "Belgium");
bij(fleetGraph, "North Sea", "London");
bij(fleetGraph, "North Sea", "York");
bij(fleetGraph, "North Sea", "Edinburgh");
bij(fleetGraph, "Skagerrak", "Norway");
bij(fleetGraph, "Skagerrak", "Sweden");
bij(fleetGraph, "Skagerrak", "Denmark");
bij(fleetGraph, "Helgoland Bight", "Denmark");
bij(fleetGraph, "Helgoland Bight", "Kiel");
bij(fleetGraph, "Helgoland Bight", "Holland");
bij(fleetGraph, "Baltic Sea", "Livonia");
bij(fleetGraph, "Baltic Sea", "Gulf of Bothnia");
bij(fleetGraph, "Baltic Sea", "Sweden");
bij(fleetGraph, "Baltic Sea", "Denmark");
bij(fleetGraph, "Baltic Sea", "Kiel");
bij(fleetGraph, "Baltic Sea", "Berlin");
bij(fleetGraph, "Baltic Sea", "Prussia");
bij(fleetGraph, "Gulf of Bothnia", "Finland");
bij(fleetGraph, "Gulf of Bothnia", "St. Petersburg :: SC");
bij(fleetGraph, "Gulf of Bothnia", "Livonia");
bij(fleetGraph, "Gulf of Bothnia", "Sweden");
bij(fleetGraph, "Western Mediterranean", "Spain :: SC");
bij(fleetGraph, "Western Mediterranean", "North Africa");
bij(fleetGraph, "Western Mediterranean", "Gulf of Lyon");
bij(fleetGraph, "Western Mediterranean", "Tyrrhenian Sea");
bij(fleetGraph, "Gulf of Lyon", "Spain :: SC");
bij(fleetGraph, "Gulf of Lyon", "Marseilles");
bij(fleetGraph, "Gulf of Lyon", "Piedmont");
bij(fleetGraph, "Gulf of Lyon", "Roma");
bij(fleetGraph, "Gulf of Lyon", "Tyrrhenian Sea");
bij(fleetGraph, "Tyrrhenian Sea", "Tunisia");
bij(fleetGraph, "Tyrrhenian Sea", "Roma");
bij(fleetGraph, "Tyrrhenian Sea", "Napoli");
bij(fleetGraph, "Tyrrhenian Sea", "Ionian Sea");
bij(fleetGraph, "Ionian Sea", "Tunisia");
bij(fleetGraph, "Ionian Sea", "Naploli");
bij(fleetGraph, "Ionian Sea", "Apulia");
bij(fleetGraph, "Ionian Sea", "Greece");
bij(fleetGraph, "Ionian Sea", "Albania");
bij(fleetGraph, "Ionian Sea", "Aegean Sea");
bij(fleetGraph, "Ionian Sea", "Eastern Mediterranean");
bij(fleetGraph, "Ionian Sea", "Adriatic Sea");
bij(fleetGraph, "Aegean Sea", "Eastern Mediterranean");
bij(fleetGraph, "Aegean Sea", "Greece");
bij(fleetGraph, "Aegean Sea", "Bulgaria :: SC");
bij(fleetGraph, "Aegean Sea", "Constantinople");
bij(fleetGraph, "Aegean Sea", "Smyrna");
bij(fleetGraph, "Eastern Mediterranean", "Smyrna");
bij(fleetGraph, "Eastern Mediterranean", "Syria");
bij(fleetGraph, "Adriatic Sea", "Apulia");
bij(fleetGraph, "Adriatic Sea", "Venezia");
bij(fleetGraph, "Adriatic Sea", "Trieste");
bij(fleetGraph, "Adriatic Sea", "Albania");
bij(fleetGraph, "Black Sea", "Constantinople");
bij(fleetGraph, "Black Sea", "Bulgaria :: EC");
bij(fleetGraph, "Black Sea", "Rumania");
bij(fleetGraph, "Black Sea", "Sevastapol");
bij(fleetGraph, "Black Sea", "Armenia");
bij(fleetGraph, "Black Sea", "Ankara");

let dipTrad = {
    startingGameState: {
        year: 1900,
        season: "Spring",
        dislodged: [],
        retreatRestrictions: [],
        factions : {
            "Great Britain": {
                fleet: ["Edinburgh", "London"],
                army: ["Liverpool"],
                supplyCenters: ["London", "Edinburgh", "Liverpool"]
            },
            "Germany": {
                fleet: ["Kiel"],
                army: ["Munich", "Berlin"],
                supplyCenters: ["Kiel", "Munich", "Berlin"]
            },
            "France": {
                fleet: ["Brest"],
                army: ["Paris", "Marseilles"],
                supplyCenters: ["Brest", "Paris", "Marseilles"]
            },
            "Italy": {
                fleet: ["Napoli"],
                army: ["Venezia", "Roma"],
                supplyCenters: ["Napoli", "Roma", "Venezia"],
            },
            "Austria Hungary": {
                fleet: ["Trieste"],
                army: ["Vienna", "Budapest"],
                supplyCenters: ["Trieste", "Vienna", "Budapest"]
            },
            "Turkey": {
                fleet: ["Ankara"],
                army: ["Smyrna", "Constantinople"],
                supplyCenters: ["Ankara", "Smyrna", "Constantinople"],
            },
            "Russia": {
                fleet: ["Sevastapol", "St. Petersburg :: SC"],
                army: ["Moscow", "Warsaw"],
                supplyCenters: ["Sevastapol", "St. Petersburg", "Moscow", "Warsaw"],
            },
        }
    },
    factions : {
        "Great Britain": {
            armyBuildPoints: ["London", "Edinburgh", "Liverpool"],
            fleetBuildPoints: ["London", "Edinburgh", "Liverpool"],
            startingUnits: {
                fleet: ["London", "Edinburgh"],
                army: ["Liverpool"]
            },
            startingCenters: ["London", "Edinburgh", "Liverpool"],
            emergencyBuildPoints: [],
            unitImages: {
                army: "png/gb-army.png",
                fleet: "png/gb-fleet.png",
            },
            color: "#336699"
        },
        "Germany": {
            armyBuildPoints: ["Kiel", "Berlin", "Munich"],
            fleetBuildPoints: ["Kiel", "Berlin"],
            startingUnits: {
                fleet: ["Kiel"],
                army: ["Berlin","Munich"]
            },
            startingCenters: ["Berlin", "Munich", "Kiel"],
            emergencyBuildPoints: [],
            unitImages: {
                army: "png/germany-army.png",
                fleet: "png/germany-fleet.png",
            },
            color: "#000000"
        },
        "France": {
            armyBuildPoints: ["Paris", "Marseilles", "Brest"],
            fleetBuildPoints: ["Marseilles", "Brest"],
            startingUnits: {
                fleet: ["Brest"],
                army: ["Paris", "Marseilles"]
            },
            startingCenters: ["Brest", "Paris", "Marseilles"],
            emergencyBuildPoints: [],
            unitImages: {
                army: "png/france-army.png",
                fleet: "png/france-fleet.png",
            },
            color: "#66CCCC"
        },
        "Italy": {
            armyBuildPoints: ["Venezia", "Roma", "Napoli"],
            fleetBuildPoints: ["Roma", "Napoli"],
            startingUnits: {
                fleet: ["Napoli"],
                army: ["Venezia", "Roma"]
            },
            startingCenters: ["Napoli", "Venezia", "Roma"],
            emergencyBuildPoints: [],
            unitImages: {
                army: "png/italy-army.png",
                fleet: "png/italy-fleet.png",
            },
            color: "#339933"
        },
        "Austria Hungary": {
            armyBuildPoints: ["Trieste", "Vienna", "Budapest"],
            fleetBuildPoints: ["Trieste"],
            startingUnits: {
                fleet: ["Trieste"],
                army: ["Vienna", "Budapest"]
            },
            startingCenters: ["Trieste", "Vienna", "Budapest"],
            emergencyBuildPoints: [],
            unitImages: {
                army: "png/ah-army.png",
                fleet: "png/ah-fleet.png",
            },
            color: "#ff3333"
        },
        "Turkey": {
            armyBuildPoints: ["Smyrna", "Ankara", "Constantinople"],
            fleetBuildPoints: ["Smyrna", "Ankara", "Constantinople"],
            startingUnits: {
                fleet: ["Ankara"],
                army: ["Smyrna", "Constantinople"]
            },
            startingCenters: ["Ankara", "Smyrna", "Constantinople"],
            emergencyBuildPoints: [],
            unitImages: {
                army: "png/turkey-army.png",
                fleet: "png/turkey-fleet.png",
            },
            color: "#ffcc66"
        },
        "Russia": {
            armyBuildPoints: ["Sevastapol", "Moscow", "St. Petersburg", "Warsaw"],
            fleetBuildPoints: ["Sevastapol", "St. Petersburg :: NC", "St. Petersburg :: SC"],
            startingUnits: {
                fleet: ["Sevastapol", "St. Petersburg :: SC"],
                army: ["Moscow", "Warsaw"]
            },
            startingCenters: ["Sevastapol", "St. Petersburg", "Moscow", "Warsaw"],
            emergencyBuildPoints: [],
            unitImages: {
                army: "png/russia-army.png",
                fleet: "png/russia-fleet.png",
            },
            color: "#ffffff"
        },
    },
    boardImage: "png/trad-board.jpg",
    territoryPaths: paths,
    boardSize: [1152, 965],
    title: "Traditional",
    unitPositions: {
        "North Atlantic Ocean": [305, 648],
        "Norwegian Sea": [747, 408],
        "Barents Sea": [1463, 51],
        "North Sea": [750, 851],
        "Skagerrak": [924,723],
        "Baltic Sea": [1213, 820],
        "Gulf of Bothnia": [1234, 529],
        "Irish Sea": [491, 893],
        "English Channel": [504, 1064],
        "Mid Atlantic Ocean": [354, 1222],
        "Western Mediterranean": [504, 1742],
        "Gulf of Lyon": [800, 1510],
        "Tyrrhenian Sea": [974, 1622],
        "Ionian Sea": [1252, 1818],
        "Aegean Sea": [1550, 1776],
        "Adriatic Sea": [1139, 1470],
        "Eastern Mediterranean": [1774, 1868],
        "Black Sea": [1733, 1405],
        "Helgoland Bight": [875, 886],

        "Clyde": [565, 703],
        "Edinburgh": [626, 697],
        "Liverpool": [592, 841],
        "York": [636, 861],
        "Wales": [545, 908],
        "London": [656, 974],

        "Norway": [952, 591],
        "Sweden": [1108, 670],
        "Denmark": [1001, 824],

        "Cologne": [865, 1068],
        "Munich": [956, 1087],
        "Kiel": [966, 919],
        "Berlin": [1090, 940],
        "Prussia": [1243, 933],
        "Silesia": [1167, 1054],
        "Alsace": [840, 1171],

        "Paris": [689, 1260],
        "Marseilles": [660, 1427],
        "Brest": [530, 1150],
        "Picardy": [700, 1080],
        "Burgundy": [766, 1162],
        "Gascony": [563, 1385],

        "Spain": [458, 1512],
        "Spain :: NC": [369, 1391],
        "Spain :: WC": [244, 1676],
        "Spain :: EC": [484, 1647],
        "Portugal": [242, 1466],

        "Gibraltar": [267, 1735],

        "Morocco": [307, 1856],

        "North Africa": [533, 1840],
        "Tunisia": [896, 1831],

        "Syria": [2145, 1692],
        "Smyrna": [1696, 1718],
        "Armenia": [2034, 1510],
        "Ankara": [1820, 1520],
        "Constantinople": [1653, 1573],
        "Greece": [1401, 1595],
        "Bulgaria :: EC": [1330, 1612],
        "Bulgaria :: SC": [1511, 1559],

        "Greece": [1431, 1758],
        "Albania": [1236, 1426],
        "Serbia": [1370, 1420],
        "Rumania": [1575, 1357],

        "Napoli": [1192, 1681],
        "Apulia": [1172, 1589],
        "Venezia": [1000, 1354],
        "Roma": [971, 1448],
        "Piedmont": [846, 1351],
        "Tuscany": [925, 1354],

        "Belgium": [764, 1042],
        "Holland": [824, 989],

        "Finland": [1357, 501],
        "St. Petersburg": [1584, 654],
        "St. Petersburg :: SC": [1584, 654],
        "St. Petersburg :: NC": [1750, 212],
        "Moscow": [1709, 864],
        "Livonia": [1360, 782],
        "Warsaw": [1308, 1004],
        "Ukraine": [1575, 1081],
        "Sevastapol": [2046, 1263],

        "Tyrolia": [987, 1278],
        "Trieste": [1111, 1355],
        "Vienna": [1143, 1273],
        "Bohemia": [1133, 1137],
        "Galacia": [1418, 1129],
        "Budapest": [1355, 1321]
    },
    canConvoy: seas,
    graph: {
        army: armyGraph,
        fleet: fleetGraph
    },
    customEdges: {},
    multiCoast: multiCoast,
    supplyCenters: [
        "Edinburgh",
        "Liverpool",
        "London",
        "Brest",
        "Paris",
        "Marseilles",
        "Spain",
        "Portugal",
        "Tunisia",
        "Smyrna",
        "Ankara",
        "Constantinople",
        "Greece",
        "Bulgaria",
        "Serbia",
        "Rumania",
        "Sevastapol",
        "Warsaw",
        "Moscow",
        "St. Petersburg",
        "Norway",
        "Sweden",
        "Denmark",
        "Kiel",
        "Berlin",
        "Munich",
        "Holland",
        "Belgium",
        "Vienna",
        "Budapest",
        "Trieste",
        "Venezia",
        "Roma",
        "Napoli"
    ],
}

export const generate = () => {
    copyTextToClipboard(JSON.stringify(SaveBoardSpecToSerializable(dipTrad)));
};
