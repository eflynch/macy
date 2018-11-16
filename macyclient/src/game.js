import {dip1900} from './board-spec';

let session = {
    title: "War in Q4",
    boardSpec: dip1900,
    turns: [
        [{"faction":"Russia","unit":"St. Petersburg :: SC","action":"Move","target":"Gulf of Bothnia","viaConvoy":false},{"faction":"Russia","unit":"Moscow","action":"Hold","target":"Moscow"},{"faction":"Russia","unit":"Warsaw","action":"Move","target":"Livonia","viaConvoy":false},{"faction":"Russia","unit":"Sevastapol","action":"Move","target":"Rumania","viaConvoy":false},{"faction":"Turkey","unit":"Constantinople","action":"Move","target":"Bulgaria","viaConvoy":false},{"faction":"Turkey","unit":"Ankara","action":"Move","target":"Constantinople","viaConvoy":false},{"faction":"Turkey","unit":"Damascus","action":"Move","target":"Palestine","viaConvoy":false},{"faction":"Great Britain","unit":"Egypt","action":"Hold","target":"Egypt"},{"faction":"France","unit":"Algeria","action":"Move","target":"Tunisia","viaConvoy":false},{"faction":"Great Britain","unit":"Gibraltar","action":"Move","target":"Morocco","viaConvoy":false},{"faction":"France","unit":"Marseilles","action":"Move","target":"Spain","viaConvoy":false},{"faction":"France","unit":"Paris","action":"Move","target":"Gascony","viaConvoy":false},{"faction":"France","unit":"Brest","action":"Move","target":"Picardy","viaConvoy":false},{"faction":"Germany","unit":"Cologne","action":"Move","target":"Belgium","viaConvoy":false},{"faction":"Germany","unit":"Munich","action":"Move","target":"Alsace","viaConvoy":false},{"faction":"Germany","unit":"Berlin","action":"Move","target":"Kiel","viaConvoy":false},{"faction":"Germany","unit":"Kiel","action":"Move","target":"Denmark","viaConvoy":false},{"faction":"Great Britain","unit":"Edinburgh","action":"Move","target":"Norwegian Sea","viaConvoy":false},{"faction":"Great Britain","unit":"London","action":"Move","target":"North Sea","viaConvoy":false},{"faction":"Italy","unit":"Milan","action":"Move","target":"Switzerland","viaConvoy":false},{"faction":"Italy","unit":"Rome","action":"Move","target":"Piedmont","viaConvoy":false},{"faction":"Italy","unit":"Naples","action":"Move","target":"Ionian Sea","viaConvoy":false},{"faction":"Austria Hungary","unit":"Trieste","action":"Move","target":"Bosnia","viaConvoy":false},{"faction":"Austria Hungary","unit":"Vienna","action":"Move","target":"Budapest","viaConvoy":false},{"faction":"Austria Hungary","unit":"Budapest","action":"Move","target":"Serbia","viaConvoy":false}],
        [{"faction":"Great Britain","unit":"Norwegian Sea","action":"Move","target":"Norway","viaConvoy":false},{"faction":"Russia","unit":"Livonia","action":"Move","target":"Sweden","viaConvoy":true},{"faction":"Russia","unit":"Gulf of Bothnia","action":"Convoy","target":"Sweden","targetUnit":"Livonia"},{"faction":"Great Britain","unit":"North Sea","action":"Move","target":"Denmark","viaConvoy":false},{"faction":"Germany","unit":"Denmark","action":"Move","target":"Baltic Sea","viaConvoy":false},{"faction":"Germany","unit":"Kiel","action":"Move","target":"Netherlands","viaConvoy":false},{"faction":"Germany","unit":"Alsace","action":"Move","target":"Burgundy","viaConvoy":false},{"faction":"Germany","unit":"Belgium","action":"Support","target":"Burgundy","targetUnit":"Alsace"},{"faction":"Italy","unit":"Piedmont","action":"Move","target":"Marseilles","viaConvoy":false},{"faction":"Italy","unit":"Switzerland","action":"Support","target":"Marseilles","targetUnit":"Piedmont"},{"faction":"France","unit":"Spain","action":"Move","target":"Portugal","viaConvoy":false},{"faction":"France","unit":"Gascony","action":"Move","target":"Spain","viaConvoy":false},{"faction":"Great Britain","unit":"Morocco","action":"Hold","target":"Morocco"},{"faction":"France","unit":"Tunisia","action":"Move","target":"Tripolitania","viaConvoy":false},{"faction":"Great Britain","unit":"Egypt","action":"Hold","target":"Egypt"},{"faction":"Turkey","unit":"Palestine","action":"Hold","target":"Palestine"},{"faction":"Italy","unit":"Ionian Sea","action":"Move","target":"Greece","viaConvoy":false},{"faction":"Turkey","unit":"Constantinople","action":"Move","target":"Macedonia :: EC","viaConvoy":false},{"faction":"Turkey","unit":"Bulgaria","action":"Support","target":"Macedonia :: EC","targetUnit":"Constantinople"},{"faction":"Austria Hungary","unit":"Bosnia","action":"Move","target":"Macedonia","viaConvoy":false},{"faction":"Austria Hungary","unit":"Budapest","action":"Hold","target":"Budapest"},{"faction":"Austria Hungary","unit":"Serbia","action":"Hold","target":"Serbia"},{"faction":"Russia","unit":"Moscow","action":"Move","target":"Ukraine","viaConvoy":false},{"faction":"France","unit":"Picardy","action":"Hold","target":"Picardy"}],
        [{"faction":"Russia","unitType":"fleet","action":"Build","unit":"Sevastapol"},{"faction":"Russia","unitType":"army","action":"Build","unit":"Warsaw"},{"faction":"Turkey","unitType":"fleet","action":"Build","unit":"Damascus"},{"faction":"Italy","unitType":"fleet","action":"Build","unit":"Naples"},{"faction":"Italy","unitType":"fleet","action":"Build","unit":"Rome"},{"faction":"Italy","unitType":"army","action":"Build","unit":"Milan"},{"faction":"Austria Hungary","unitType":"army","action":"Build","unit":"Trieste"},{"faction":"Germany","unitType":"fleet","action":"Build","unit":"Kiel"},{"faction":"Germany","unitType":"army","action":"Build","unit":"Berlin"},{"faction":"Great Britain","unitType":"fleet","action":"Build","unit":"London"},{"faction":"Great Britain","unitType":"fleet","action":"Build","unit":"Liverpool"},{"faction":"Great Britain","unitType":"fleet","action":"Build","unit":"Edinburgh"},{"faction":"France","unitType":"fleet","action":"Build","unit":"Brest"},{"faction":"France","unitType":"army","action":"Build","unit":"Paris"}],
        [{"faction":"Great Britain","unit":"Edinburgh","action":"Move","target":"North Sea","viaConvoy":false},{"faction":"Great Britain","unit":"Liverpool","action":"Move","target":"Irish Sea","viaConvoy":false},{"faction":"Great Britain","unit":"London","action":"Move","target":"English Channel","viaConvoy":false},{"faction":"France","unit":"Picardy","action":"Move","target":"English Channel","viaConvoy":false},{"faction":"France","unit":"Brest","action":"Support","target":"English Channel","targetUnit":"Picardy"},{"faction":"France","unit":"Spain","action":"Move","target":"Gascony","viaConvoy":false},{"faction":"France","unit":"Paris","action":"Support","target":"Gascony","targetUnit":"Spain"},{"faction":"France","unit":"Portugal","action":"Move","target":"Spain","viaConvoy":false},{"faction":"Italy","unit":"Marseilles","action":"Move","target":"Gascony","viaConvoy":false},{"faction":"Germany","unit":"Burgundy","action":"Support","target":"Gascony","targetUnit":"Marseilles"},{"faction":"Italy","unit":"Switzerland","action":"Move","target":"Marseilles","viaConvoy":false},{"faction":"Italy","unit":"Milan","action":"Move","target":"Piedmont","viaConvoy":false},{"faction":"Italy","unit":"Rome","action":"Move","target":"Gulf of Lyon","viaConvoy":false},{"faction":"Italy","unit":"Naples","action":"Move","target":"Tyrrhenian Sea","viaConvoy":false},{"faction":"Italy","unit":"Greece","action":"Move","target":"Ionian Sea","viaConvoy":false},{"faction":"Great Britain","unit":"Morocco","action":"Move","target":"Algeria","viaConvoy":false},{"faction":"Great Britain","unit":"Egypt","action":"Move","target":"Mid Atlantic Ocean","viaConvoy":false},{"faction":"Great Britain","unit":"Denmark","action":"Move","target":"Sweden","viaConvoy":false},{"faction":"Great Britain","unit":"Norway","action":"Support","target":"Sweden","targetUnit":"Denmark"},{"faction":"Germany","unit":"Baltic Sea","action":"Support","target":"Sweden","targetUnit":"Denmark"},{"faction":"Russia","unit":"Gulf of Bothnia","action":"Support","target":"Sweden","targetUnit":"Sweden"},{"faction":"Germany","unit":"Kiel","action":"Move","target":"Denmark","viaConvoy":false},{"faction":"Germany","unit":"Netherlands","action":"Move","target":"Kiel","viaConvoy":false},{"faction":"Germany","unit":"Belgium","action":"Move","target":"Picardy","viaConvoy":false},{"faction":"Germany","unit":"Berlin","action":"Hold","target":"Berlin"},{"faction":"Russia","unit":"Warsaw","action":"Move","target":"Prussia","viaConvoy":false},{"faction":"Russia","unit":"Ukraine","action":"Move","target":"Warsaw","viaConvoy":false},{"faction":"Russia","unit":"Sevastapol","action":"Move","target":"Black Sea","viaConvoy":false},{"faction":"Russia","unit":"Rumania","action":"Support","target":"Bulgaria","targetUnit":"Serbia"},{"faction":"Austria Hungary","unit":"Serbia","action":"Move","target":"Bulgaria","viaConvoy":false},{"faction":"Austria Hungary","unit":"Budapest","action":"Move","target":"Serbia","viaConvoy":false},{"faction":"Austria Hungary","unit":"Trieste","action":"Move","target":"Budapest","viaConvoy":false},{"faction":"Austria Hungary","unit":"Bosnia","action":"Move","target":"Macedonia","viaConvoy":false},{"faction":"Turkey","unit":"Macedonia :: EC","action":"Hold","target":"Macedonia :: EC"},{"faction":"Turkey","unit":"Damascus","action":"Move","target":"Eastern Mediterranean","viaConvoy":false},{"faction":"Turkey","unit":"Palestine","action":"Hold","target":"Palestine"},{"faction":"France","unit":"Tripolitania","action":"Hold","target":"Tripolitania"}],
        [{"faction":"Turkey","unit":"Bulgaria","action":"Retreat","target":"Constantinople","unitType":"army"},{"faction":"Russia","unit":"Sweden","action":"Retreat","target":"Finland","unitType":"army"}],
        [{"faction":"Great Britain","unit":"London","action":"Move","target":"North Sea","viaConvoy":false},{"faction":"Great Britain","unit":"North Sea","action":"Move","target":"Belgium","viaConvoy":false},{"faction":"France","unit":"English Channel","action":"Move","target":"Belgium","viaConvoy":false},{"faction":"Germany","unit":"Picardy","action":"Move","target":"Paris","viaConvoy":false},{"faction":"France","unit":"Brest","action":"Move","target":"Mid Atlantic Ocean","viaConvoy":false},{"faction":"France","unit":"Portugal","action":"Support","target":"Spain","targetUnit":"Spain"},{"faction":"France","unit":"Spain","action":"Hold","target":"Spain"},{"faction":"France","unit":"Paris","action":"Move","target":"Gascony","viaConvoy":false},{"faction":"France","unit":"Tripolitania","action":"Move","target":"Southern Algeria","viaConvoy":false},{"faction":"Great Britain","unit":"Algeria","action":"Hold","target":"Algeria"},{"faction":"Italy","unit":"Piedmont","action":"Move","target":"Spain","viaConvoy":true},{"faction":"Italy","unit":"Gulf of Lyon","action":"Convoy","target":"Spain","targetUnit":"Piedmont"},{"faction":"Italy","unit":"Marseilles","action":"Move","target":"Gascony","viaConvoy":false},{"faction":"Germany","unit":"Burgundy","action":"Support","target":"Paris","targetUnit":"Picardy"},{"faction":"Italy","unit":"Tyrrhenian Sea","action":"Move","target":"Western Mediterranean","viaConvoy":false},{"faction":"Italy","unit":"Ionian Sea","action":"Move","target":"Greece","viaConvoy":false},{"faction":"Turkey","unit":"Macedonia :: EC","action":"Support","target":"Constantinople","targetUnit":"Constantinople"},{"faction":"Turkey","unit":"Eastern Mediterranean","action":"Move","target":"Egypt","viaConvoy":false},{"faction":"Turkey","unit":"Palestine","action":"Move","target":"Damascus","viaConvoy":false},{"faction":"Turkey","unit":"Constantinople","action":"Hold","target":"Constantinople"},{"faction":"Austria Hungary","unit":"Bosnia","action":"Move","target":"Macedonia","viaConvoy":false},{"faction":"Austria Hungary","unit":"Bulgaria","action":"Support","target":"Macedonia","targetUnit":"Bosnia"},{"faction":"Austria Hungary","unit":"Serbia","action":"Support","target":"Bulgaria","targetUnit":"Bulgaria"},{"faction":"Russia","unit":"Black Sea","action":"Support","target":"Rumania","targetUnit":"Rumania"},{"faction":"Russia","unit":"Rumania","action":"Hold","target":"Rumania"},{"faction":"Austria Hungary","unit":"Budapest","action":"Hold","target":"Budapest"},{"faction":"Italy","unit":"Switzerland","action":"Move","target":"Marseilles","viaConvoy":false},{"faction":"Germany","unit":"Berlin","action":"Move","target":"Munich","viaConvoy":false},{"faction":"Germany","unit":"Kiel","action":"Move","target":"Netherlands","viaConvoy":false},{"faction":"Germany","unit":"Baltic Sea","action":"Convoy","target":"Sweden","targetUnit":"Prussia"},{"faction":"Russia","unit":"Prussia","action":"Move","target":"Sweden","viaConvoy":true},{"faction":"Russia","unit":"Warsaw","action":"Hold","target":"Warsaw"},{"faction":"Russia","unit":"Finland","action":"Move","target":"St. Petersburg","viaConvoy":false},{"faction":"Russia","unit":"Gulf of Bothnia","action":"Support","target":"Sweden","targetUnit":"Prussia"},{"faction":"Germany","unit":"Denmark","action":"Support","target":"Sweden","targetUnit":"Prussia"},{"faction":"Great Britain","unit":"Norway","action":"Support","target":"Sweden","targetUnit":"Sweden"},{"faction":"Great Britain","unit":"Sweden","action":"Hold","target":"Sweden"},{"faction":"Great Britain","unit":"Irish Sea","action":"Move","target":"English Channel","viaConvoy":false},{"faction":"Great Britain","unit":"Mid Atlantic Ocean","action":"Support","target":"English Channel","targetUnit":"Irish Sea"}],
        [{"faction":"Germany","action":"Disband","unit":"Paris"},{"faction":"Turkey","unit":"Macedonia :: EC","action":"Disband"},{"faction":"Great Britain","unit":"Sweden","action":"Retreat","target":"Skagerrak","unitType":"fleet"}],
        [{"faction":"Germany","unitType":"fleet","action":"Build","unit":"Kiel"},{"faction":"Germany","unitType":"fleet","action":"Build","unit":"Berlin"},{"faction":"Turkey","unitType":"fleet","action":"Build","unit":"Ankara"},{"faction":"Austria Hungary","unitType":"fleet","action":"Build","unit":"Trieste"},{"faction":"Great Britain","action":"Disband","unit":"Irish Sea"},{"faction":"France","action":"Disband","unit":"Southern Algeria"}],
        [{"faction":"Great Britain","unit":"Algeria","action":"Move","target":"Morocco","viaConvoy":false},{"faction":"Great Britain","unit":"Mid Atlantic Ocean","action":"Support","target":"Spain","targetUnit":"Spain"},{"faction":"Great Britain","unit":"North Sea","action":"Move","target":"Belgium","viaConvoy":false},{"faction":"Great Britain","unit":"London","action":"Move","target":"North Sea","viaConvoy":false},{"faction":"Great Britain","unit":"Norway","action":"Hold","target":"Norway"},{"faction":"Great Britain","unit":"Skagerrak","action":"Support","target":"Norway","targetUnit":"Norway"},{"faction":"Austria Hungary","unit":"Trieste","action":"Move","target":"Adriatic Sea","viaConvoy":false},{"faction":"Austria Hungary","unit":"Budapest","action":"Support","target":"Serbia","targetUnit":"Serbia"},{"faction":"Austria Hungary","unit":"Bulgaria","action":"Support","target":"Constantinople","targetUnit":"Black Sea"},{"faction":"Austria Hungary","unit":"Macedonia","action":"Support","target":"Constantinople","targetUnit":"Black Sea"},{"faction":"Austria Hungary","unit":"Serbia","action":"Support","target":"Macedonia","targetUnit":"Macedonia"},{"faction":"Russia","unit":"Rumania","action":"Move","target":"Black Sea","viaConvoy":false},{"faction":"Russia","unit":"Black Sea","action":"Move","target":"Constantinople","viaConvoy":false},{"faction":"Russia","unit":"Sweden","action":"Move","target":"Norway","viaConvoy":false},{"faction":"Russia","unit":"St. Petersburg","action":"Support","target":"Norway","targetUnit":"Sweden"},{"faction":"Russia","unit":"Gulf of Bothnia","action":"Move","target":"Sweden","viaConvoy":false},{"faction":"Russia","unit":"Warsaw","action":"Move","target":"Livonia","viaConvoy":false},{"faction":"Turkey","unit":"Constantinople","action":"Hold","target":"Constantinople"},{"faction":"Turkey","unit":"Ankara","action":"Support","target":"Constantinople","targetUnit":"Constantinople"},{"faction":"Turkey","unit":"Damascus","action":"Move","target":"Konya","viaConvoy":false},{"faction":"Turkey","unit":"Egypt","action":"Move","target":"Cyrenaica","viaConvoy":false},{"faction":"Italy","unit":"Greece","action":"Move","target":"Ionian Sea","viaConvoy":false},{"faction":"Italy","unit":"Piedmont","action":"Move","target":"Spain","viaConvoy":true},{"faction":"Italy","unit":"Gulf of Lyon","action":"Convoy","target":"Spain","targetUnit":"Piedmont"},{"faction":"France","unit":"Spain","action":"Hold","target":"Spain"},{"faction":"Italy","unit":"Switzerland","action":"Move","target":"Piedmont","viaConvoy":false},{"faction":"Italy","unit":"Western Mediterranean","action":"Support","target":"Spain","targetUnit":"Piedmont"},{"faction":"Italy","unit":"Marseilles","action":"Support","target":"Spain","targetUnit":"Piedmont"},{"faction":"France","unit":"English Channel","action":"Support","target":"Belgium","targetUnit":"North Sea"},{"faction":"France","unit":"Brest","action":"Move","target":"Picardy","viaConvoy":false},{"faction":"France","unit":"Portugal","action":"Support","target":"Spain","targetUnit":"Spain"},{"faction":"Germany","unit":"Denmark","action":"Move","target":"Skagerrak","viaConvoy":false},{"faction":"Germany","unit":"Kiel","action":"Move","target":"Netherlands","viaConvoy":false},{"faction":"Germany","unit":"Netherlands","action":"Move","target":"Belgium","viaConvoy":false},{"faction":"Germany","unit":"Munich","action":"Move","target":"Cologne","viaConvoy":false},{"faction":"Germany","unit":"Burgundy","action":"Move","target":"Picardy","viaConvoy":false},{"faction":"Germany","unit":"Paris","action":"Support","target":"Picardy","targetUnit":"Burgundy"},{"faction":"Germany","unit":"Berlin","action":"Move","target":"Kiel","viaConvoy":false},{"faction":"Germany","unit":"Baltic Sea","action":"Support","target":"Sweden","targetUnit":"Gulf of Bothnia"}],
        [{"faction":"Great Britain","unit":"Norway","action":"Retreat","target":"Norwegian Sea","unitType":"fleet"},{"faction":"Russia","action":"Disband","unit":"Constantinople"}],
    ]
}


module.exports = {
    session: session,
}