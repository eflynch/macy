
import Graph from './graph';
import {paths} from './territory-paths';

let bij = (g, a, b, d = 1) => {
    g.addEdge(a, b, d);
    g.addEdge(b, a, d);
};

let provinces = [
    "Ireland",
    "Clyde",
    "Liverpool",
    "Wales",
    "London",
    "Yorkshire",

    "Cologne",
    "Munich",
    "Kiel",
    "Berlin",
    "Prussia",
    "Silesia",
    "Alsace",

    "Bohemia",
    "Tyrolia",
    "Galacia",
    "Vienna",
    "Budapest",
    "Trieste",

    "Switzerland",

    "Picardy",
    "Burgundy",
    "Brest",
    "Paris",
    "Gascony",
    "Marseilles",

    "Portugal",
    "Spain",
    "Gibraltar",
    "Morocco",
    "Algeria",
    "Southern Algeria",
    "Tunisia",
    "Tripolitania",
    "Cyrenaica",
    "Egypt",

    "Naples",
    "Apulia",
    "Rome",
    "Venetia",
    "Milan",
    "Piedmont",

    "Iceland",
    "Norway",
    "Sweden",
    "Denmark",

    "Finland",
    "St. Petersburg",
    "Siberia",
    "Moscow",
    "Ukraine",
    "Livonia",
    "Warsaw",
    "Sevastapol",

    "Armenia",
    "Ankara",
    "Constantinople",
    "Konya",
    "Macedonia",
    "Damascus",
    "Palestine",

    "Arabia",
    "Hejaz",

    "Rumania",
    "Bulgaria",
    "Serbia",
    "Bosnia",
    "Greece"
];

let coasts = [
    "Ireland",
    "Clyde",
    "Liverpool",
    "Edinburgh",
    "Wales",
    "London",
    "Yorkshire",

    "Kiel",
    "Berlin",
    "Prussia",

    "Trieste",

    "Picardy",
    "Brest",
    "Gascony",
    "Marseilles",

    "Portugal",
    "Spain",
    "Gibraltar",
    "Morocco",
    "Algeria",
    "Tunisia",
    "Tripolitania",
    "Cyrenaica",
    "Egypt",

    "Naples",
    "Apulia",
    "Rome",
    "Venetia",
    "Piedmont",

    "Iceland",
    "Norway",
    "Sweden",
    "Denmark",

    "Finland",
    "St. Petersburg",
    "Livonia",
    "Sevastapol",

    "Armenia",
    "Ankara",
    "Constantinople",
    "Konya",
    "Macedonia",
    "Damascus",
    "Palestine",

    "Hejaz",

    "Rumania",
    "Bulgaria",
    "Bosnia",
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
    "Black Sea"
];

let armyGraph = new Graph();
provinces.forEach((p) => {armyGraph.addNode(p);});

bij(armyGraph, "Clyde", "Ireland");
bij(armyGraph, "Clyde", "Edinburgh");
bij(armyGraph, "Clyde", "Liverpool");
bij(armyGraph, "Edinburgh", "Yorkshire");
bij(armyGraph, "Liverpool", "Yorkshire");
bij(armyGraph, "Liverpool", "Wales");
bij(armyGraph, "Yorkshire", "Wales");
bij(armyGraph, "Yorkshire", "London");
bij(armyGraph, "London", "Wales");

bij(armyGraph, "Portugal", "Spain");
bij(armyGraph, "Spain", "Gascony");
bij(armyGraph, "Spain", "Marseilles");

bij(armyGraph, "Gascony", "Brest");
bij(armyGraph, "Gascony", "Marseilles");
bij(armyGraph, "Gascony", "Paris");
bij(armyGraph, "Gascony", "Burgundy");
bij(armyGraph, "Marseilles", "Burgundy");
bij(armyGraph, "Marseilles", "Switzerland");
bij(armyGraph, "Marseilles", "Piedmont");
bij(armyGraph, "Brest", "Picardy");
bij(armyGraph, "Brest", "Paris");
bij(armyGraph, "Paris", "Burgundy");
bij(armyGraph, "Paris", "Picardy");
bij(armyGraph, "Burgundy", "Picardy");
bij(armyGraph, "Burgundy", "Belgium");
bij(armyGraph, "Burgundy", "Alasace");
bij(armyGraph, "Burgundy", "Switzerland");
bij(armyGraph, "Picardy", "Belgium");

bij(armyGraph, "Belgium", "Alsace");
bij(armyGraph, "Belgium", "Netherlands");
bij(armyGraph, "Belgium", "Cologne");
bij(armyGraph, "Netherlands", "Kiel");
bij(armyGraph, "Netherlands", "Cologne");

bij(armyGraph, "Piedmont", "Milan");
bij(armyGraph, "Piedmont", "Switzerland");
bij(armyGraph, "Piedmont", "Rome");
bij(armyGraph, "Milan", "Venetia");
bij(armyGraph, "Milan", "Switzerland");
bij(armyGraph, "Milan", "Tyrolia");
bij(armyGraph, "Milan", "Rome");
bij(armyGraph, "Rome", "Venetia");
bij(armyGraph, "Rome", "Apulia");
bij(armyGraph, "Rome", "Naples");
bij(armyGraph, "Venetia", "Tyrolia");
bij(armyGraph, "Venetia", "Apulia");
bij(armyGraph, "Apulia", "Naples");

bij(armyGraph, "Alsace", "Cologne");
bij(armyGraph, "Alsace", "Switzerland");
bij(armyGraph, "Alsace", "Munich");
bij(armyGraph, "Cologne", "Kiel");
bij(armyGraph, "Cologne", "Munich");
bij(armyGraph, "Munich", "Kiel");
bij(armyGraph, "Munich", "Berlin");
bij(armyGraph, "Munich", "Silesia");
bij(armyGraph, "Munich", "Bohemia");
bij(armyGraph, "Munich", "Tyrolia");
bij(armyGraph, "Munich", "Switzerland");
bij(armyGraph, "Kiel", "Denmark");
bij(armyGraph, "Kiel", "Berlin");
bij(armyGraph, "Berlin", "Silesia");
bij(armyGraph, "Berlin", "Prussia");

bij(armyGraph, "Denmark", "Sweden");
bij(armyGraph, "Sweden", "Norway");
bij(armyGraph, "Sweden", "Finland");
bij(armyGraph, "Norway", "Finland");
bij(armyGraph, "Norway", "St. Petersburg");
bij(armyGraph, "Finland", "St. Petersburg");
bij(armyGraph, "St. Petersburg", "Livonia");
bij(armyGraph, "St. Petersburg", "Moscow");
bij(armyGraph, "St. Petersburg", "Siberia");
bij(armyGraph, "Siberia", "Moscow");
bij(armyGraph, "Siberia", "Sevastapol");
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
bij(armyGraph, "Bulgaria", "Macedonia");
bij(armyGraph, "Bulgaria", "Constantinople");
bij(armyGraph, "Serbia", "Budapest");
bij(armyGraph, "Serbia", "Trieste");
bij(armyGraph, "Serbia", "Bosnia");
bij(armyGraph, "Serbia", "Macedonia");
bij(armyGraph, "Bosnia", "Trieste");
bij(armyGraph, "Bosnia", "Macedonia");
bij(armyGraph, "Greece", "Macedonia");

bij(armyGraph, "Macedonia", "Constantinople");
bij(armyGraph, "Constantinople", "Ankara");
bij(armyGraph, "Constantinople", "Konya");
bij(armyGraph, "Ankara", "Armenia");
bij(armyGraph, "Ankara", "Konya");
bij(armyGraph, "Konya", "Armenia");
bij(armyGraph, "Konya", "Damascus");
bij(armyGraph, "Armenia", "Damascus");
bij(armyGraph, "Damascus", "Palestine");
bij(armyGraph, "Damascus", "Arabia");
bij(armyGraph, "Palestine", "Egypt");
bij(armyGraph, "Palestine", "Arabia");
bij(armyGraph, "Palestine", "Hejaz");

bij(armyGraph, "Arabia", "Hejaz");
bij(armyGraph, "Hejaz", "Egypt");

bij(armyGraph, "Egypt", "Cyrenaica");

bij(armyGraph, "Cyrenaica", "Tripolitania");
bij(armyGraph, "Tripolitania", "Tunisia");
bij(armyGraph, "Tripolitania", "Southern Algeria");

bij(armyGraph, "Tunisia", "Southern Algeria");
bij(armyGraph, "Tunisia", "Algeria");
bij(armyGraph, "Algeria", "Morocco");
bij(armyGraph, "Algeria", "Southern Algeria");
bij(armyGraph, "Southern Algeria", "Morocco");

bij(armyGraph, "Morocco", "Gibraltar");

bij(armyGraph, "Gibraltar", "Spain");

bij(armyGraph, "Tyrolia", "Bohemia");
bij(armyGraph, "Tyrolia", "Vienna");
bij(armyGraph, "Tyrolia", "Trieste");
bij(armyGraph, "Tyrolia", "Switzerland");
bij(armyGraph, "Bohemia", "Galacia");
bij(armyGraph, "Bohemia", "Vienna");
bij(armyGraph, "Bohemia", "Budapest");
bij(armyGraph, "Vienna", "Trieste");
bij(armyGraph, "Vienna", "Budapest");
bij(armyGraph, "Budapest", "Trieste");
bij(armyGraph, "Budapest", "Galacia");

let fleetGraph = new Graph();
coasts.forEach((p) => {fleetGraph.addNode(p);});
seas.forEach((p) => {fleetGraph.addNode(p);});

bij(fleetGraph, "Clyde", "Ireland");
bij(fleetGraph, "Clyde", "Edinburgh");
bij(fleetGraph, "Clyde", "Liverpool");
bij(fleetGraph, "Edinburgh", "Yorkshire");
bij(fleetGraph, "Liverpool", "Wales");
bij(fleetGraph, "Yorkshire", "London");
bij(fleetGraph, "London", "Wales");

bij(fleetGraph, "Portugal", "Spain :: NC");
bij(fleetGraph, "Portugal", "Spain :: WC");
bij(fleetGraph, "Spain :: NC", "Gascony");
bij(fleetGraph, "Spain :: EC", "Marseilles");

bij(fleetGraph, "Gascony", "Brest");
bij(fleetGraph, "Marseilles", "Piedmont");
bij(fleetGraph, "Brest", "Picardy");
bij(fleetGraph, "Picardy", "Belgium");

bij(fleetGraph, "Belgium", "Netherlands");
bij(fleetGraph, "Netherlands", "Kiel");

bij(fleetGraph, "Piedmont", "Rome");
bij(fleetGraph, "Rome", "Naples");
bij(fleetGraph, "Venetia", "Apulia");
bij(fleetGraph, "Apulia", "Naples");

bij(fleetGraph, "Kiel", "Denmark");
bij(fleetGraph, "Kiel", "Berlin");
bij(fleetGraph, "Berlin", "Prussia");

bij(fleetGraph, "Denmark", "Sweden");
bij(fleetGraph, "Sweden", "Norway");
bij(fleetGraph, "Sweden", "Finland");
bij(fleetGraph, "Norway", "St. Petersburg :: SC");
bij(fleetGraph, "Finland", "St. Petersburg :: SC");
bij(fleetGraph, "St. Petersburg :: SC", "Livonia");
bij(fleetGraph, "Sevastapol", "Rumania");
bij(fleetGraph, "Sevastapol", "Armenia");

bij(fleetGraph, "Rumania", "Bulgaria");
bij(fleetGraph, "Bulgaria", "Constantinople");
bij(fleetGraph, "Bosnia", "Trieste");
bij(fleetGraph, "Bosnia", "Macedonia :: WC");
bij(fleetGraph, "Greece", "Macedonia :: WC");
bij(fleetGraph, "Greece", "Macedonia :: EC");

bij(fleetGraph, "Macedonia :: EC", "Constantinople");
bij(fleetGraph, "Constantinople", "Ankara");
bij(fleetGraph, "Ankara", "Armenia");
bij(fleetGraph, "Konya", "Damascus");
bij(fleetGraph, "Damascus", "Palestine");
bij(fleetGraph, "Palestine", "Egypt");
bij(fleetGraph, "Palestine", "Hejaz");

bij(fleetGraph, "Hejaz", "Egypt");

bij(fleetGraph, "Egypt", "Cyrenaica");

bij(fleetGraph, "Cyrenaica", "Tripolitania");
bij(fleetGraph, "Tripolitania", "Tunisia");

bij(fleetGraph, "Tunisia", "Algeria");
bij(fleetGraph, "Algeria", "Morocco");

bij(fleetGraph, "Morocco", "Gibraltar");

bij(fleetGraph, "Gibraltar", "Spain :: WC");
bij(fleetGraph, "Gibraltar", "Spain :: EC");

bij(fleetGraph, "Barents Sea", "St. Petersburg :: NC");
bij(fleetGraph, "Barents Sea", "Norway");
bij(fleetGraph, "Barents Sea", "Norwegian Sea");
bij(fleetGraph, "Norwegian Sea", "Norway");
bij(fleetGraph, "Norwegian Sea", "Iceland");
bij(fleetGraph, "Norwegian Sea", "North Atlantic Ocean");
bij(fleetGraph, "Norwegian Sea", "Clyde");
bij(fleetGraph, "Norwegian Sea", "Edinburgh");
bij(fleetGraph, "North Atlantic Ocean", "Clyde");
bij(fleetGraph, "North Atlantic Ocean", "Iceland");
bij(fleetGraph, "North Atlantic Ocean", "Liverpool");
bij(fleetGraph, "North Atlantic Ocean", "Ireland");
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
bij(fleetGraph, "Mid Atlantic Ocean", "Spain :: WC");
bij(fleetGraph, "Mid Atlantic Ocean", "Portugal");
bij(fleetGraph, "Mid Atlantic Ocean", "Gibraltar");
bij(fleetGraph, "Mid Atlantic Ocean", "Morocco");
bij(fleetGraph, "Mid Atlantic Ocean", "Egypt");
bij(fleetGraph, "Mid Atlantic Ocean", "Hejaz");
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
bij(fleetGraph, "North Sea", "Netherlands");
bij(fleetGraph, "North Sea", "Belgium");
bij(fleetGraph, "North Sea", "London");
bij(fleetGraph, "North Sea", "Yorkshire");
bij(fleetGraph, "North Sea", "Edinburgh");
bij(fleetGraph, "Skagerrak", "Norway");
bij(fleetGraph, "Skagerrak", "Sweden");
bij(fleetGraph, "Skagerrak", "Denmark");
bij(fleetGraph, "Helgoland Bight", "Denmark");
bij(fleetGraph, "Helgoland Bight", "Kiel");
bij(fleetGraph, "Helgoland Bight", "Netherlands");
bij(fleetGraph, "Baltic Sea", "Livonia");
bij(fleetGraph, "Baltic Sea", "Gulf of Bothnia");
bij(fleetGraph, "Baltic Sea", "Sweden");
bij(fleetGraph, "Baltic Sea", "Denmark");
bij(fleetGraph, "Baltic Sea", "Kiel");
bij(fleetGraph, "Baltic Sea", "Berlin");
bij(fleetGraph, "Baltic Sea", "Prussia");
bij(fleetGraph, "Gulf of Bothnia", "Finland");
bij(fleetGraph, "Gulf of Bothnia :: SC", "St. Petersburg");
bij(fleetGraph, "Gulf of Bothnia", "Livonia");
bij(fleetGraph, "Gulf of Bothnia", "Sweden");
bij(fleetGraph, "Western Mediterranean", "Spain :: EC");
bij(fleetGraph, "Western Mediterranean", "Gibraltar");
bij(fleetGraph, "Western Mediterranean", "Morocco");
bij(fleetGraph, "Western Mediterranean", "Algeria");
bij(fleetGraph, "Western Mediterranean", "Gulf of Lyon");
bij(fleetGraph, "Western Mediterranean", "Tyrrhenian Sea");
bij(fleetGraph, "Gulf of Lyon", "Spain :: EC");
bij(fleetGraph, "Gulf of Lyon", "Marseilles");
bij(fleetGraph, "Gulf of Lyon", "Piedmont");
bij(fleetGraph, "Gulf of Lyon", "Rome");
bij(fleetGraph, "Gulf of Lyon", "Tyrrhenian Sea");
bij(fleetGraph, "Tyrrhenian Sea", "Algeria");
bij(fleetGraph, "Tyrrhenian Sea", "Tunisia");
bij(fleetGraph, "Tyrrhenian Sea", "Rome");
bij(fleetGraph, "Tyrrhenian Sea", "Naples");
bij(fleetGraph, "Tyrrhenian Sea", "Ionian Sea");
bij(fleetGraph, "Ionian Sea", "Tunisia");
bij(fleetGraph, "Ionian Sea", "Tripolitania");
bij(fleetGraph, "Ionian Sea", "Cyrenaica");
bij(fleetGraph, "Ionian Sea", "Naples");
bij(fleetGraph, "Ionian Sea", "Apulia");
bij(fleetGraph, "Ionian Sea", "Macedonia :: WC");
bij(fleetGraph, "Ionian Sea", "Greece");
bij(fleetGraph, "Ionian Sea", "Aegean Sea");
bij(fleetGraph, "Ionian Sea", "Eastern Mediterranean");
bij(fleetGraph, "Ionian Sea", "Adriatic Sea");
bij(fleetGraph, "Aegean Sea", "Eastern Mediterranean");
bij(fleetGraph, "Aegean Sea", "Greece");
bij(fleetGraph, "Aegean Sea", "Macedonia :: EC");
bij(fleetGraph, "Aegean Sea", "Constantinople");
bij(fleetGraph, "Aegean Sea", "Konya");
bij(fleetGraph, "Eastern Mediterranean", "Konya");
bij(fleetGraph, "Eastern Mediterranean", "Damascus");
bij(fleetGraph, "Eastern Mediterranean", "Palestine");
bij(fleetGraph, "Eastern Mediterranean", "Egypt");
bij(fleetGraph, "Eastern Mediterranean", "Cyrenaica");
bij(fleetGraph, "Adriatic Sea", "Apulia");
bij(fleetGraph, "Adriatic Sea", "Venetia");
bij(fleetGraph, "Adriatic Sea", "Trieste");
bij(fleetGraph, "Adriatic Sea", "Bosnia");
bij(fleetGraph, "Adriatic Sea", "Macedonia :: WC");
bij(fleetGraph, "Black Sea", "Constantinople");
bij(fleetGraph, "Black Sea", "Bulgaria");
bij(fleetGraph, "Black Sea", "Rumania");
bij(fleetGraph, "Black Sea", "Sevastapol");
bij(fleetGraph, "Black Sea", "Armenia");
bij(fleetGraph, "Black Sea", "Ankara");

let dip1900 = {
    startingGameState: {
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
        }
    },
    factions : {
        "Great Britain": {
            buildPoints: ["London", "Edinburgh", "Liverpool"],
            startingUnits: {
                fleet: ["London", "Edinburgh", "Gibraltar", "Egypt"],
                army: []
            },
            startingCenters: ["London", "Edinburgh", "Liverpool", "Egypt"],
            emergencyBuildPoints: [],
            unitImages: {
                army: "png/gb-army.png",
                fleet: "png/gb-fleet.png",
            },
            color: "#336699"
        },
        "Germany": {
            buildPoints: ["Kiel", "Berlin", "Cologne", "Munich"],
            startingUnits: {
                fleet: ["Kiel"],
                army: ["Berlin", "Cologne", "Munich"]
            },
            startingCenters: ["Berlin", "Cologne", "Munich", "Kiel"],
            emergencyBuildPoints: [],
            unitImages: {
                army: "png/germany-army.png",
                fleet: "png/germany-fleet.png",
            },
            color: "#000000"
        },
        "France": {
            buildPoints: ["Paris", "Marseilles", "Brest"],
            startingUnits: {
                fleet: ["Brest"],
                army: ["Paris", "Marseilles", "Algeria"]
            },
            startingCenters: ["Brest", "Paris", "Marseilles", "Algeria"],
            emergencyBuildPoints: [],
            unitImages: {
                army: "png/france-army.png",
                fleet: "png/france-fleet.png",
            },
            color: "#66CCCC"
        },
        "Italy": {
            buildPoints: ["Milan", "Rome", "Naples"],
            startingUnits: {
                fleet: ["Naples"],
                army: ["Milan", "Rome"]
            },
            startingCenters: ["Naples", "Milan", "Rome"],
            emergencyBuildPoints: [],
            unitImages: {
                army: "png/italy-army.png",
                fleet: "png/italy-fleet.png",
            },
            color: "#339933"
        },
        "Austria Hungary": {
            buildPoints: ["Trieste", "Vienna", "Budapest"],
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
            buildPoints: ["Damascus", "Ankara", "Constantinople"],
            startingUnits: {
                fleet: ["Ankara"],
                army: ["Damascus", "Constantinople"]
            },
            startingCenters: ["Ankara", "Damascus", "Constantinople"],
            emergencyBuildPoints: [],
            unitImages: {
                army: "png/turkey-army.png",
                fleet: "png/turkey-fleet.png",
            },
            color: "#ffcc66"
        },
        "Russia": {
            buildPoints: ["Sevastapol", "Moscow", "St. Petersburg", "Warsaw"],
            startingUnits: {
                fleet: ["Sevastapol", "St. Petersburg :: SC"],
                army: ["Moscow", "Warsaw"]
            },
            startingCenters: ["Sevastapol", "St. Petersburg", "Moscow", "Warsaw"],
            emergencyBuildPoints: ["Siberia"],
            unitImages: {
                army: "png/russia-army.png",
                fleet: "png/russia-fleet.png",
            },
            color: "#ffffff"
        },
    },
    boardImage: "png/board.jpg",
    territoryImages: "png/map/",
    territoryPaths: paths,
    boardSize: [2250, 2250],
    title: "1900 Diplomacy",
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
        "Gulf of Lyon": [749, 1514],
        "Tyrrhenian Sea": [974, 1622],
        "Ionian Sea": [1252, 1818],
        "Aegean Sea": [1550, 1776],
        "Adriatic Sea": [1159, 1500],
        "Eastern Mediterranean": [1774, 1868],
        "Black Sea": [1733, 1405],
        "Helgoland Bight": [875, 886],

        "Clyde": [565, 703],
        "Ireland": [447, 809],
        "Edinburgh": [626, 697],
        "Liverpool": [592, 841],
        "Yorkshire": [636, 861],
        "Wales": [545, 908],
        "London": [656, 974],

        "Iceland": [4017, 219],
        "Norway": [952, 591],
        "Sweden": [1108, 670],
        "Denmark": [1001, 824],

        "Cologne": [865, 1058],
        "Munich": [956, 1087],
        "Kiel": [966, 919],
        "Berlin": [1064, 989],
        "Prussia": [1243, 933],
        "Silesia": [1167, 1054],
        "Alsace": [840, 1171],

        "Paris": [689, 1260],
        "Marseilles": [660, 1427],
        "Brest": [534, 1167],
        "Picardy": [653, 1117],
        "Burgundy": [766, 1162],
        "Gascony": [563, 1385],

        "Spain": [458, 1512],
        "Spain :: NC": [369, 1391],
        "Spain :: WC": [244, 1676],
        "Spain :: EC": [484, 1647],
        "Portugal": [242, 1466],

        "Gibraltar": [267, 1735],

        "Morocco": [307, 1856],

        "Algeria": [533, 1840],
        "Southern Algeria": [346, 2127],
        "Tunisia": [896, 1831],

        "Tripolitania": [1042, 2077],
        "Cyrenaica": [1412, 2062],

        "Egypt": [1676, 2139],

        "Hejaz": [2105, 2138],
        "Arabia": [2181, 2035],

        "Palestine": [2042, 1928],
        "Damascus": [2145, 1692],
        "Konya": [1696, 1718],
        "Armenia": [2034, 1510],
        "Ankara": [1867, 1513],
        "Constantinople": [1653, 1573],
        "Macedonia": [1401, 1595],
        "Macedonia :: WC": [1330, 1612],
        "Macedonia :: EC": [1511, 1559],

        "Greece": [1431, 1758],
        "Bosnia": [1236, 1426],
        "Serbia": [1357, 1438],
        "Bulgaria": [1569, 1456],
        "Rumania": [1575, 1357],

        "Naples": [1192, 1681],
        "Apulia": [1172, 1589],
        "Venetia": [1104, 1354],
        "Rome": [971, 1448],
        "Piedmont": [856, 1371],
        "Milan": [925, 1354],

        "Switzerland": [879, 1275],
        "Belgium": [764, 1062],
        "Netherlands": [824, 989],

        "Finland": [1357, 501],
        "St. Petersburg": [1584, 654],
        "St. Petersburg :: SC": [1584, 654],
        "St. Petersburg :: NC": [1750, 212],
        "Siberia": [2142, 469],
        "Moscow": [1709, 864],
        "Livonia": [1376, 782],
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
    seas: seas,
    graph: {
        army: armyGraph,
        fleet: fleetGraph
    },
    supplyCenters: [
        "Edinburgh",
        "Liverpool",
        "London",
        "Brest",
        "Paris",
        "Marseilles",
        "Spain",
        "Portugal",
        "Morocco",
        "Algeria",
        "Tripolitania",
        "Egypt",
        "Damascus",
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
        "Cologne",
        "Munich",
        "Netherlands",
        "Belgium",
        "Switzerland",
        "Vienna",
        "Budapest",
        "Trieste",
        "Milan",
        "Rome",
        "Naples"
    ],
}

module.exports = {
    dip1900: dip1900 
};
