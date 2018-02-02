const cassandra = require('cassandra-driver');
const faker = require('faker');
const fs = require('fs');
// const file = fs.createWriteStream('../file4.txt');
const random = require('random-world');

const client = new cassandra.Client({
    contactPoints: ['127.0.0.1'], 
    keyspace: 'historical_data'
});

client.connect((err) => {
  if(err) {
    console.log('Error connecting to Cassandra', err);
  } else {
    console.log('Connection successful');
  }
});

// for (var i = 0; i < 200; i++) {
//   console.log('\'' + random.city() + '\',' )
// }

// var cities = ['Brody', 'Borisov', 'Bazar', 'Osnova', 'Ogre', 'Spas', 'Gustavia',
//               'Avarua', 'Gourbeyre', 'Onar', 'Florida', 'Willensen', 'Himanka', 
//               'Kavarna', 'Christiansted', 'Vastra Amtervik', 'West Island', 'Gan Hayyim',
//               'Honiara', 'Made', 'Mercedes', 'Honefoss', 'Sint Nicolaas', 'Al Sohar',
//               'Draginovo', 'Sanaa', 'Tanki Lender', 'Lobamba', 'Niamey', 'Cotoca',
//               'Bamako', 'Bangui', 'ÄŒadca', 'Cristuru Secuiesc', 'American Samoa', 'Roma',
//               'Masai', 'Dauphin', 'Emmastad', 'Toila', 'Shkoder', 'Marigot',
//               'Vientiane', 'Ashgabat', 'Baghdad', 'Jaunolaine', 'Grand Cul-de-Sac', 
//               'Sansanne-Mango', 'Port-aux-Francais', 'Funafuti', 'Ashgabat', 'Lyakhovichi',
//               'Jacmel', 'Saint Lucia', 'Sansanne-Mango', 'Casal', 'Maseru', 'Toliara',
//               'Windhoek', 'Praia', 'Vega Alta', 'Kingstown', 'Bamako', 'Bujumbura',
//               'Bangui', 'West Island', 'Amarante', 'Tan Binh', 'Xirdalan', 'Philipsburg',
//               'Tristan Da Cunha', 'Maldonado', 'JelÅ¡ava', 'Terre-de-Haut', 'Bahrs Scrub', 'Salwa',
//               'Majuro', 'Vredeberg', 'Lhota', 'KÃ¼nten', 'Sahalahti', 'PaysandÃº',
//               'Anse Marcel', 'Safotulafai', 'Nassau', 'Jawlakhel', 'Banjul', 'Dunlavin',
//               'American Samoa', 'Lot', 'New Amsterdam', 'Ipoh', 'Gudja', 'Hahndorf',
//               'Gata de Gorgos', 'Aleppo', 'Ad Dasmah', 'Petit Cayenne', 'MalÃ©', 'Zurges',
//               'Berekua', 'Loperhet', 'Dalby', 'Darganata', 'Safotulafai', 'Lopinot',
//               'Umwa Village','Port Erin','Dinskaya','Jakobselv','Chinhoyi','Talatona',
//               'Owaka', 'La Saline', 'San Juan del Sur', 'Banda Aceh', 'Eureka', 'Piarco',
//               'Palpa', 'Ingija', 'Piedecuesta', 'Ma Wan', 'Aitape', 'Villa Madero',
//               'Santa Cruz', 'Skopje', 'Loltong', 'Longyearbyen', 'Sihanoukville', 'Malyn',
//               'Springs Junction', 'Apostag', 'Kaevlinge', 'Diego Garcia', 'Palm Beach', 'Banjul',
//               'Honiara', 'Sharjah', 'Marigot', 'Dehiwala-Mount Lavinia', 'Nemby',
//               'Aleppo', 'Ternat', 'Abidjan', 'Adamstown', 'Juarez', 'Funafuti',
//               'Antarctica', 'Grindavik', 'Gros Islet', 'Manama', 'Kotor', 'Dili',
//               'Weitra', 'Grytviken', 'Aroma', '`Ara', 'Anabar', 'Juan Franco',
//               'Avarua', 'Lugang', 'Tristan Da Cunha', 'Kitale', 'Kiev', 'Quetzaltenango',
//               'Peshawar', 'Abidjan', 'La Saline', 'Road Town', 'Wong Chuk Hang', 'Leval-Trahegnies',
//               'Sobral de Monte Agraco', 'Phumi Boeng (1)', 'Caldas', 'Jelgava', 'Laventille', 'Port Vila',
//               'Berekum', 'Triesen', 'West Bay', 'Lusaka', 'Hveragerdi', 'Monaco',
//               'Gustavia', 'Made', 'Sandy Point Town', 'Dhrol', 'Al Wakrah', 'Banjul',
//               'Jurdab', 'Quba', 'Vilniaus Apskritis', 'Shendi', 'Gibraltar', 'St Peter Port',
//               'Komotini', 'Alfta', 'Ernstbrunn', 'Orchard Hills', 'Antarctica', 'Stanley',
//               'Salt', 'Village', 'Siikainen', 'Praia', 'LomÃ©', 'Mogadishu', 'Minacar',
//               'Asmara', 'Bohinjska Bela', 'Kampala', 'Longyearbyen', 'Malabo', 'Damascus',
//               'Tenkodogo', 'Adamstown', 'Castries', 'Canillo', 'Dubai', 'Moutsamoudou',
//               'Khanpur', 'Somerset', 'Al Sohar', 'Saint Helier', 'Honiara', 'Lagos',
//               'Pravets', 'Kinshasa', 'Anse La Raye', 'Macao', 'Claxton Bay', 'Bangui',
//               'Safotulafai', 'Adamstown', 'Saint Helier', 'Amman', 'Inya', 'Komenda',
//               'Juba', 'Niamey', 'Port-aux-Francais', 'Hartenbos', 'VlorÃ«', 'Neiafu',
//               'Bangui', 'Gimhae', 'Karaca', 'Ouagadougou', 'Cahul', 'Quelimane',
//               'Kralendijk', 'Nuuk', 'Macao', 'Kingston', 'Kingston', 'Velden', 'Pago Pago',
//               'Zakynthos', 'Djibouti', 'Innan Glyvur', 'Choiseul', 'Dauphin', 'LomÃ©', 'Vikesa',
//               'Lucapa', 'Juba', 'Dumbea', 'Grytviken', 'Larisa', 'Parana',
//               'Praia', 'Apia', 'Kirkuk', 'Jerez de Garcia Salinas', 'Overpelt', 'Alofi',
//               'Dehiwala', 'Kanokupolu', 'Banjul', 'Berekua', 'EkerÃ¶', 'Loltong',
//               'Kinshasa', 'Pointe-Noire', 'Panaga', 'Ferizaj', 'Sotira', 'Tristan Da Cunha',
//               'Kabete', 'Anse La Raye', 'Bissau', 'Wagan', 'Asmara', 'Karojba',
//               'Banana', 'Ondangwa', 'Sousse', 'Fossdalen', 'Kamphaeng Phet', 'Saint Johns',
//               'Mata-Utu', 'Arue', 'Lyakhovichi', 'Brookfield', 'Obernberg am Brenner',
//               'Port-au-Prince', 'Catano', 'Darakhov', 'Anse La Raye', 'Vientiane', 'Khartoum', 'Mongar',
//               'Harare', 'Tortola', 'Pyongyang', 'Ostervra', 'Polatsk', 'Tizi', 'Lujiazhi',
//               'Over Back The Damp', 'Marigot', 'Ait Melloul', 'Temirtau', 'Le Reduit', 'Huetor Vega',
//               'FacatativÃ¡', 'Salem', 'Vullierens', 'Andorra la Vella', 'Escaldes-Engordany',
//               'Nuevo Leon', 'Ilulissat', 'Mwanza', 'Kadima', 'Kertih', 'Sainte-Anne', 'Shkoder',
//               'Santa Rita', 'Atlantic Shores', 'Bingemma', 'GuantÃ¡namo', 'Seglora', 'Kanokupolu',
//               'Novi Becej','Kanokupolu','Rasak','Baie-Mahault','Saint-Francois',
//               'Erlach','Anabar','Coyol','Saint-Louis','Kampala','Seong-dong',
//               'Road Town', 'Santa Cruz', 'Ghaxaq', 'Palpa', 'Vaeaeksy',
//               'Roma', 'Ouangani', 'Pago Pago', 'Banaz', 'Ossiach', 'Vailala',
//               'Tete', 'Nyala', 'Vientiane', 'Port Louis', 'Kornik', 'Ar Rayyan',
//               'Brezno', 'Nea Filadelfeia', 'Linden', 'Saku', 'Ruggell', 'Gyeongsan-si',
//               'Pirae', 'Chiconi', 'Pyongyang', 'Oleh', 'Djibouti', 'Saint Peter',
//               'Cacheu', 'Flying Fish Cove', 'Moroni', 'Flying Fish Cove', 'Anse Marcel', 'West Island',
//               'Kingstown', 'Ad Darah', 'Juba', 'Sarba', 'Raha', 'Bloomsbury',
//               'Machali', 'Ilinden', 'Bamako', 'Neiafu', 'Gaborone', 'Dereham',
//               'Palpa', 'Hamilton', 'Kundiawa', 'May Pen', 'Hargeysa', 'Kampala',
//               'Kundiawa', 'Anabar', 'Dumbea', 'Praia', 'Over Back The Damp', 'St John Island',
//               'Saint Clair', 'Palin', 'Ouagadougou', 'Madaba', 'Bodden Town', 'AbÃ©chÃ©',
//               'Philipsburg', 'Prokuplje', 'Somerset', 'Grafendorf', 'Diego Garcia', 'San Vicente',
//               'Tamavua Heights', 'Dili', 'Vatican City', 'Susenii Bargaului', 'Robards', 'Rozino',
//               'Salalah', 'Ambriz', 'Ar Rayyan', 'Salwa', 'Sidcot', 'Majuro',
//               'Mount Hamilton', 'Neves', 'Soyapango', 'Taichung', 'Oistins', 'Villa Morelli',
//               'Kotor', 'Mont-Dore', 'San Ignacio', 'Nam Äá»‹nh', 'Termez', 'Kandahar',
//               'Kabi', 'Grytviken', 'Mamou', 'Adamstown', 'Strovolos', 'La Union',
//               'Ouangani', 'George Hill', 'La Molina', 'Naklo', 'Honiara', 'Alofi',
//               'Adamstown', 'Herat', 'Ebene CyberCity', 'Somero', 'Turgeau', 'Pljevlja',
//               'Suphan Buri', 'Siavonga', 'KuldÄ«ga', 'Luohe', 'West Island', 'Suva',
//               'Kwaluseni', 'Pyongyang', 'Ciego de Ãvila', 'Cruz Alta', 'Thabit', 'Diego Garcia',
//               'Nieuw Amsterdam', 'Fengming', 'Praia', 'Charlestown', 'Kapan',
//               'Beira', 'Charlestown', 'Ramallah', 'Bingol', 'Newlands', 'Grytviken',
//               'Nyala', 'Otavalo', 'Tenkodogo', 'Cotoca', 'Ad Darah', 'Grimmen',
//               'Newport', 'Tai Kok Tsui', 'Ringo', 'Kembangan', 'West Island', 'Kafr ash Shaykh',
//               'Sansanne-Mango', 'Abidjan', 'Krynica-Zdroj', 'Ukmerge', 'Matoury',
//               'The Valley', 'Rocklea', 'Sollentuna', 'Honiara', 'Valley',
//               'Paamiut', 'Rades', 'St. George\'s', 'Vatican City', 'Paco de Arcos',
//               'Puentelarra', 'Stanley', 'Skwierzyna', 'Casablanca', 'Rades',
//               'Bodden Town', 'Esch-sur-Alzette', 'Djibouti', 'Ballon', 'Kingstown',
//               'Carignan', 'Sumqayit', 'Old Harbour', 'Antarctica', 'Talca',
//               'Atafu Village', 'Dili', 'Vieques', 'Funafuti', 'Khartoum',
//               'Berekua', 'Puli', 'Tsoundzou 1', 'Cruz', 'Dili', 'Corumba de Goias',
//               'Phuket', 'Hargeysa', 'Ayia Marina', 'Mzuzu', 'Boca Chica', 'Dobruska',
//               'Honiara', 'Monaco', 'AbÃ©chÃ©', 'Jelka', 'Niamey', 'San Pedro de MacorÃ­s',
//               'Hawalli', 'Freetown', 'LomÃ©', 'Majuro', 'Sanaa',
//               'Strassen', 'RuÅ¾omberok', 'Basseterre', 'St John Island', 'Bor', 'Varberg',
//               'Kran', 'ÅžÇki', 'Valle', 'Flying Fish Cove', 'Fazal',
//               'Sinaloa de Leyva', 'Horche', 'Yap', 'Linden', 'Port Maria',
//               'Kongerslev', 'Santa Cruz', 'Matsuyama', 'Bani Jamrah', 'EckerÃ¶', 'Marsh Harbour',
//               'Ballasalla', 'Gibraltar', 'Durian Tunggal', 'Anse Marcel', 'Bujumbura',
//               'San Juan', 'Venhuizen', 'Mariehamn', 'Banana', 'Monaco',
//               'Visoko', 'Saipan', 'Itagui', 'Lehota', 'Pyongyang',
//               'Ovoshtnik', 'Maseru', 'Eldoret', 'Grytviken', 'Leirvik', 'Thon Bao An', 'Dushanbe', 'Valkeala',
//               'Vilniaus Apskritis', 'Port-aux-Francais', 'Isla de Tibas', 'St. George\'s', 'Torre',
//               'Gordon\'s Bay', 'Guarei', 'PotosÃ­', 'Chinhoyi', 'St Peter Port', 'Charlotte Amalie',
//               'Zagrodno', 'Barquisimeto', 'Clanwilliam', 'Bishkek', 'Palmetto Point',
//               'Awasa', 'Codrington', 'Sukkur', 'Gostar', 'Francistown', 'Flying Fish Cove',
//               'Llano Tugri', 'Kingston', 'Quelimane', 'Beira', 'Kralendijk', 'Canelones',
//               'Sanaa', 'Ashtarak', 'Nouakchott', 'Hargeysa', 'Sansanne-Mango',
//               'Rudnyy', 'Ar Ruways', 'Hvolsvollur', 'Cacheu', 'Balfour Town',
//               'Mumbwa', 'Leudelange', 'Village', 'Innan Glyvur', 'Yap', 'Georgetown',
//               'Shuishang', 'Doha', 'Papeete', 'Terre-de-Haut', 'Adamstown', 'Roma',
//               'Nouakchott', 'Vatican City', 'Komorni Lhotka', 'La Paz', 'Charlotte Amalie', 'Dauphin',
//               'Banatsko Novo Selo', 'Almasfuzito', 'Kampala', 'Willemstad', 'Mamoudzou',
//               'Agenskalns', 'Schaan', 'Aigio', 'OneÅŸti', 'Lilongwe',
//               'Herinnes', 'Haukkala', 'Encamp', 'Zakynthos', 'Pointe Noire', 'Salcininkai',
//               'KuldÄ«ga', 'LomÃ©', 'Shulin', 'Yukuhashi', 'Ravda',
//               'Aldeanueva de Ebro', 'Longyearbyen', 'Ordino', 'Kilingi-NÃµmme', 'Kirkuk',
//               'Zepce', 'George Hill', 'Ciego de Ãvila', 'American Samoa', 'Otelfingen', 'Sero Blanco',
//               'Brazzaville', 'Emmastad', 'Schaan', 'Alvechurch', 'Ouagadougou', 'La Chaloupe Saint-Leu',
//               'Saint Johnâ€™s Church', 'Cockburn Harbour', 'Pueblo Nuevo', 'Tay Ninh',
//               'Funafuti', 'PietÃ ', 'Olinda', 'Skandia', 'Irbid', 'Union',
//               'Kumanovo', 'Sansanne-Mango', 'Khartoum', 'Addis Ababa', 'Moratuwa', 'Portalegre',
//               'Ibadan', 'Bistrica pri Rusah', 'Wabag', 'Falciano', 'Irbid', 'Baudour',
//               'Anabar', 'Qusar', 'Stompetoren', 'Ladyville', 'Totness', 'Neves',
//               'Enniscorthy', 'Neves', 'Tsoundzou 1', 'Dunavo', 'Phumi Thnal', 'Bharatpur',
//               'Bharatpur', 'George Hill', 'Kanokupolu', 'Nouakchott', 'Belize City', 'Monrovia',
//               'Christiansted', 'Benguela', 'Piggs Peak', 'Ar Rayyan', 'Nampula',
//               'Kisumu', 'Saint-Esprit', 'Bevtoft', 'Settat', 'Ravine des Cabris', 'Majuro',
//               'Valga', 'Paeau', 'Istanbul', 'Asmara', 'Playas',
//               'Telega', 'San Antonio', 'Vatican City', 'Vestmannaeyjar', 'Freetown',
//               'Pyongyang', 'Toliara', 'Awasa', 'Honiara', 'Baiao', 'Curtici',
//               'Charlotte Amalie', 'Stanley', 'Level', 'Erebuni Fortress', 'Saint-Denis', 'TelÅ¡iai',
//               'Voorburg', 'Abidjan', 'Kampong Pasir Ris', 'Bukit Timah', 'Philipsburg',
//               'Ostim', 'Chinandega', 'Somerset', 'Nyala', 'Petit-Bourg', 'Petite-Ile',
//               'Soroca', 'Moundou', 'Dunavo', 'Stevensweert', 'SÃ£o TomÃ©', 'Tar',
//               'Dabola', 'Mahina', 'Pirae', 'Saipan', 'Fish Town',
//               'Vredeberg', 'Pyhaejoki', 'Ashgabat', 'Al `Amarah', 'Vientiane'
//             ]

// var obj = {};
// cities.forEach( (city) => {
//   obj[city] = obj[city] + 1 || 1;
// });
// console.log(Object.keys(obj).length);

var aggregatedData = () => {
  var timeInterval = Math.floor(Math.random() * 24);
  var day = Math.floor(Math.random() * 30);
  var city = faker.address.city();
  var avgSurge = parseFloat((Math.random() * (3.0 - 1.0) + 1.0).toFixed(1));
  var avgDrivers = parseInt(Math.floor(Math.random() * (65 - 0) + 0));
  var queryStr = `INSERT INTO aggregated_data (day, time_interval, city, avg_drivers, avg_surge)
                  VALUES (?, ?, ?, ?, ?)`;
  var params = [day, timeInterval, city, avgDrivers, avgSurge];
  return params;
}

var generateBulkData = function(quantity) {
  for (let i = 0; i < quantity; i++) {
    file.write(aggregatedData() + '\n');    
  }    
}





// generateBulkData(2000000);