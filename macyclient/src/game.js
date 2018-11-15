import {dip1900} from './board-spec';

let session = {
    title: "War in Q4",
    boardSpec: dip1900,
    turns: [
        [{"power":"Russia","unit":"St. Petersburg :: SC","action":"Move","target":"Gulf of Bothnia","viaConvoy":false},{"power":"Russia","unit":"Moscow","action":"Hold","target":"Moscow"},{"power":"Russia","unit":"Warsaw","action":"Move","target":"Livonia","viaConvoy":false},{"power":"Russia","unit":"Sevastapol","action":"Move","target":"Rumania","viaConvoy":false},{"power":"Turkey","unit":"Constantinople","action":"Move","target":"Bulgaria","viaConvoy":false},{"power":"Turkey","unit":"Ankara","action":"Move","target":"Constantinople","viaConvoy":false},{"power":"Turkey","unit":"Damascus","action":"Move","target":"Palestine","viaConvoy":false},{"power":"Great Britain","unit":"Egypt","action":"Hold","target":"Egypt"},{"power":"France","unit":"Algeria","action":"Move","target":"Tunisia","viaConvoy":false},{"power":"Great Britain","unit":"Gibraltar","action":"Move","target":"Morocco","viaConvoy":false},{"power":"France","unit":"Marseilles","action":"Move","target":"Spain","viaConvoy":false},{"power":"France","unit":"Paris","action":"Move","target":"Gascony","viaConvoy":false},{"power":"France","unit":"Brest","action":"Move","target":"Picardy","viaConvoy":false},{"power":"Germany","unit":"Cologne","action":"Move","target":"Belgium","viaConvoy":false},{"power":"Germany","unit":"Munich","action":"Move","target":"Alsace","viaConvoy":false},{"power":"Germany","unit":"Berlin","action":"Move","target":"Kiel","viaConvoy":false},{"power":"Germany","unit":"Kiel","action":"Move","target":"Denmark","viaConvoy":false},{"power":"Great Britain","unit":"Edinburgh","action":"Move","target":"Norwegian Sea","viaConvoy":false},{"power":"Great Britain","unit":"London","action":"Move","target":"North Sea","viaConvoy":false},{"power":"Italy","unit":"Milan","action":"Move","target":"Switzerland","viaConvoy":false},{"power":"Italy","unit":"Rome","action":"Move","target":"Piedmont","viaConvoy":false},{"power":"Italy","unit":"Naples","action":"Move","target":"Ionian Sea","viaConvoy":false},{"power":"Austria Hungary","unit":"Trieste","action":"Move","target":"Bosnia","viaConvoy":false},{"power":"Austria Hungary","unit":"Vienna","action":"Move","target":"Budapest","viaConvoy":false},{"power":"Austria Hungary","unit":"Budapest","action":"Move","target":"Serbia","viaConvoy":false}],
        [{"power":"Great Britain","unit":"Norwegian Sea","action":"Move","target":"Norway","viaConvoy":false},{"power":"Russia","unit":"Livonia","action":"Move","target":"Sweden","viaConvoy":true},{"power":"Russia","unit":"Gulf of Bothnia","action":"Convoy","target":"Sweden","targetUnit":"Livonia"},{"power":"Great Britain","unit":"North Sea","action":"Move","target":"Denmark","viaConvoy":false},{"power":"Germany","unit":"Denmark","action":"Move","target":"Baltic Sea","viaConvoy":false},{"power":"Germany","unit":"Kiel","action":"Move","target":"Netherlands","viaConvoy":false},{"power":"Germany","unit":"Alsace","action":"Move","target":"Burgundy","viaConvoy":false},{"power":"Germany","unit":"Belgium","action":"Support","target":"Burgundy","targetUnit":"Alsace"},{"power":"Italy","unit":"Piedmont","action":"Move","target":"Marseilles","viaConvoy":false},{"power":"Italy","unit":"Switzerland","action":"Support","target":"Marseilles","targetUnit":"Piedmont"},{"power":"France","unit":"Spain","action":"Move","target":"Portugal","viaConvoy":false},{"power":"France","unit":"Gascony","action":"Move","target":"Spain","viaConvoy":false},{"power":"Great Britain","unit":"Morocco","action":"Hold","target":"Morocco"},{"power":"France","unit":"Tunisia","action":"Move","target":"Tripolitania","viaConvoy":false},{"power":"Great Britain","unit":"Egypt","action":"Hold","target":"Egypt"},{"power":"Turkey","unit":"Palestine","action":"Hold","target":"Palestine"},{"power":"Italy","unit":"Ionian Sea","action":"Move","target":"Greece","viaConvoy":false},{"power":"Turkey","unit":"Constantinople","action":"Move","target":"Macedonia :: EC","viaConvoy":false},{"power":"Turkey","unit":"Bulgaria","action":"Support","target":"Macedonia :: EC","targetUnit":"Constantinople"},{"power":"Austria Hungary","unit":"Bosnia","action":"Move","target":"Macedonia","viaConvoy":false},{"power":"Austria Hungary","unit":"Budapest","action":"Hold","target":"Budapest"},{"power":"Austria Hungary","unit":"Serbia","action":"Hold","target":"Serbia"},{"power":"Russia","unit":"Moscow","action":"Move","target":"Ukraine","viaConvoy":false},{"power":"France","unit":"Picardy","action":"Hold","target":"Picardy"}],
        [{"power":"Russia","unitType":"fleet","action":"Build","unit":"Sevastapol"},{"power":"Russia","unitType":"army","action":"Build","unit":"Warsaw"},{"power":"Turkey","unitType":"fleet","action":"Build","unit":"Damascus"},{"power":"Italy","unitType":"fleet","action":"Build","unit":"Naples"},{"power":"Italy","unitType":"fleet","action":"Build","unit":"Rome"},{"power":"Italy","unitType":"army","action":"Build","unit":"Milan"},{"power":"Austria Hungary","unitType":"army","action":"Build","unit":"Trieste"},{"power":"Germany","unitType":"fleet","action":"Build","unit":"Kiel"},{"power":"Germany","unitType":"army","action":"Build","unit":"Berlin"},{"power":"Great Britain","unitType":"fleet","action":"Build","unit":"London"},{"power":"Great Britain","unitType":"fleet","action":"Build","unit":"Liverpool"},{"power":"Great Britain","unitType":"fleet","action":"Build","unit":"Edinburgh"},{"power":"France","unitType":"fleet","action":"Build","unit":"Brest"},{"power":"France","unitType":"army","action":"Build","unit":"Paris"}],
        [{"power":"Great Britain","unit":"Edinburgh","action":"Move","target":"North Sea","viaConvoy":false},{"power":"Great Britain","unit":"Liverpool","action":"Move","target":"Irish Sea","viaConvoy":false},{"power":"Great Britain","unit":"London","action":"Move","target":"English Channel","viaConvoy":false},{"power":"France","unit":"Picardy","action":"Move","target":"English Channel","viaConvoy":false},{"power":"France","unit":"Brest","action":"Support","target":"English Channel","targetUnit":"Picardy"},{"power":"France","unit":"Spain","action":"Move","target":"Gascony","viaConvoy":false},{"power":"France","unit":"Paris","action":"Support","target":"Gascony","targetUnit":"Spain"},{"power":"France","unit":"Portugal","action":"Move","target":"Spain","viaConvoy":false},{"power":"Italy","unit":"Marseilles","action":"Move","target":"Gascony","viaConvoy":false},{"power":"Germany","unit":"Burgundy","action":"Support","target":"Gascony","targetUnit":"Marseilles"},{"power":"Italy","unit":"Switzerland","action":"Move","target":"Marseilles","viaConvoy":false},{"power":"Italy","unit":"Milan","action":"Move","target":"Piedmont","viaConvoy":false},{"power":"Italy","unit":"Rome","action":"Move","target":"Gulf of Lyon","viaConvoy":false},{"power":"Italy","unit":"Naples","action":"Move","target":"Tyrrhenian Sea","viaConvoy":false},{"power":"Italy","unit":"Greece","action":"Move","target":"Ionian Sea","viaConvoy":false},{"power":"Great Britain","unit":"Morocco","action":"Move","target":"Algeria","viaConvoy":false},{"power":"Great Britain","unit":"Egypt","action":"Move","target":"Mid Atlantic Ocean","viaConvoy":false},{"power":"Great Britain","unit":"Denmark","action":"Move","target":"Sweden","viaConvoy":false},{"power":"Great Britain","unit":"Norway","action":"Support","target":"Sweden","targetUnit":"Denmark"},{"power":"Germany","unit":"Baltic Sea","action":"Support","target":"Sweden","targetUnit":"Denmark"},{"power":"Russia","unit":"Gulf of Bothnia","action":"Support","target":null,"targetUnit":"Sweden"},{"power":"Germany","unit":"Kiel","action":"Move","target":"Denmark","viaConvoy":false},{"power":"Germany","unit":"Netherlands","action":"Move","target":"Kiel","viaConvoy":false},{"power":"Germany","unit":"Belgium","action":"Move","target":"Picardy","viaConvoy":false},{"power":"Germany","unit":"Berlin","action":"Hold","target":"Berlin"},{"power":"Russia","unit":"Warsaw","action":"Move","target":"Prussia","viaConvoy":false},{"power":"Russia","unit":"Ukraine","action":"Move","target":"Warsaw","viaConvoy":false},{"power":"Russia","unit":"Sevastapol","action":"Move","target":"Black Sea","viaConvoy":false},{"power":"Russia","unit":"Rumania","action":"Support","target":"Bulgaria","targetUnit":"Serbia"},{"power":"Austria Hungary","unit":"Serbia","action":"Move","target":"Bulgaria","viaConvoy":false},{"power":"Austria Hungary","unit":"Budapest","action":"Move","target":"Serbia","viaConvoy":false},{"power":"Austria Hungary","unit":"Trieste","action":"Move","target":"Budapest","viaConvoy":false},{"power":"Austria Hungary","unit":"Bosnia","action":"Move","target":"Macedonia","viaConvoy":false},{"power":"Turkey","unit":"Macedonia :: EC","action":"Hold","target":"Macedonia :: EC"},{"power":"Turkey","unit":"Damascus","action":"Move","target":"Eastern Mediterranean","viaConvoy":false},{"power":"Turkey","unit":"Palestine","action":"Hold","target":"Palestine"},{"power":"France","unit":"Tripolitania","action":"Hold","target":"Tripolitania"}],
        [{"power":"Turkey","unit":"Bulgaria","action":"Retreat","target":"Constantinople","unitType":"army"},{"power":"Russia","unit":"Sweden","action":"Retreat","target":"Finland","unitType":"army"}],
        [{"power":"Great Britain","unit":"London","action":"Move","target":"North Sea","viaConvoy":false},{"power":"Great Britain","unit":"North Sea","action":"Move","target":"Belgium","viaConvoy":false},{"power":"France","unit":"English Channel","action":"Move","target":"Belgium","viaConvoy":false},{"power":"Germany","unit":"Picardy","action":"Move","target":"Paris","viaConvoy":false},{"power":"France","unit":"Brest","action":"Move","target":"Mid Atlantic Ocean","viaConvoy":false},{"power":"France","unit":"Portugal","action":"Support","target":null,"targetUnit":"Spain"},{"power":"France","unit":"Spain","action":"Hold","target":"Spain"},{"power":"France","unit":"Paris","action":"Move","target":"Gascony","viaConvoy":false},{"power":"France","unit":"Tripolitania","action":"Move","target":"Southern Algeria","viaConvoy":false},{"power":"Great Britain","unit":"Algeria","action":"Hold","target":"Algeria"},{"power":"Italy","unit":"Piedmont","action":"Move","target":"Spain","viaConvoy":true},{"power":"Italy","unit":"Gulf of Lyon","action":"Convoy","target":"Spain","targetUnit":"Piedmont"},{"power":"Italy","unit":"Marseilles","action":"Move","target":"Gascony","viaConvoy":false},{"power":"Germany","unit":"Burgundy","action":"Support","target":"Paris","targetUnit":"Picardy"},{"power":"Italy","unit":"Tyrrhenian Sea","action":"Move","target":"Western Mediterranean","viaConvoy":false},{"power":"Italy","unit":"Ionian Sea","action":"Move","target":"Greece","viaConvoy":false},{"power":"Turkey","unit":"Macedonia :: EC","action":"Support","target":null,"targetUnit":"Constantinople"},{"power":"Turkey","unit":"Eastern Mediterranean","action":"Move","target":"Egypt","viaConvoy":false},{"power":"Turkey","unit":"Palestine","action":"Move","target":"Damascus","viaConvoy":false},{"power":"Turkey","unit":"Constantinople","action":"Hold","target":"Constantinople"},{"power":"Austria Hungary","unit":"Bosnia","action":"Move","target":"Macedonia","viaConvoy":false},{"power":"Austria Hungary","unit":"Bulgaria","action":"Support","target":"Macedonia","targetUnit":"Bosnia"},{"power":"Austria Hungary","unit":"Serbia","action":"Support","target":null,"targetUnit":"Bulgaria"},{"power":"Russia","unit":"Black Sea","action":"Support","target":null,"targetUnit":"Rumania"},{"power":"Russia","unit":"Rumania","action":"Hold","target":"Rumania"},{"power":"Austria Hungary","unit":"Budapest","action":"Hold","target":"Budapest"},{"power":"Italy","unit":"Switzerland","action":"Move","target":"Marseilles","viaConvoy":false},{"power":"Germany","unit":"Berlin","action":"Move","target":"Munich","viaConvoy":false},{"power":"Germany","unit":"Kiel","action":"Move","target":"Netherlands","viaConvoy":false},{"power":"Germany","unit":"Baltic Sea","action":"Convoy","target":"Sweden","targetUnit":"Prussia"},{"power":"Russia","unit":"Prussia","action":"Move","target":"Sweden","viaConvoy":true},{"power":"Russia","unit":"Warsaw","action":"Hold","target":"Warsaw"},{"power":"Russia","unit":"Finland","action":"Move","target":"St. Petersburg","viaConvoy":false},{"power":"Russia","unit":"Gulf of Bothnia","action":"Support","target":"Sweden","targetUnit":"Prussia"},{"power":"Germany","unit":"Denmark","action":"Support","target":"Sweden","targetUnit":"Prussia"},{"power":"Great Britain","unit":"Norway","action":"Support","target":null,"targetUnit":"Sweden"},{"power":"Great Britain","unit":"Sweden","action":"Hold","target":"Sweden"},{"power":"Great Britain","unit":"Irish Sea","action":"Move","target":"English Channel","viaConvoy":false},{"power":"Great Britain","unit":"Mid Atlantic Ocean","action":"Support","target":"English Channel","targetUnit":"Irish Sea"}],
        [{"power":"Germany","action":"Disband","unit":"Paris"},{"power":"Turkey","unit":"Macedonia :: EC","action":"Disband"},{"power":"Great Britain","unit":"Sweden","action":"Retreat","target":"Skagerrak","unitType":"fleet"}],
        [{"power":"Germany","unitType":"fleet","action":"Build","unit":"Kiel"},{"power":"Germany","unitType":"fleet","action":"Build","unit":"Berlin"},{"power":"Turkey","unitType":"fleet","action":"Build","unit":"Ankara"},{"power":"Austria Hungary","unitType":"fleet","action":"Build","unit":"Trieste"},{"power":"Great Britain","action":"Disband","unit":"Irish Sea"},{"power":"France","action":"Disband","unit":"Southern Algeria"}],
    ]
}


module.exports = {
    session: session,
}