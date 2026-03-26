(function attachUSLocationData(global) {
  const US_LOCATION_DATA = {
    Alabama: { Jefferson: ["Birmingham", "Hoover"], Montgomery: ["Montgomery", "Prattville"], Mobile: ["Mobile", "Prichard"] },
    Alaska: { Anchorage: ["Anchorage", "Eagle River"], Fairbanks_North_Star: ["Fairbanks", "North Pole"], Juneau: ["Juneau", "Douglas"] },
    Arizona: { Maricopa: ["Phoenix", "Mesa"], Pima: ["Tucson", "Oro Valley"], Yavapai: ["Prescott", "Sedona"] },
    Arkansas: { Pulaski: ["Little Rock", "North Little Rock"], Benton: ["Bentonville", "Rogers"], Washington: ["Fayetteville", "Springdale"] },
    California: { Los_Angeles: ["Los Angeles", "Long Beach"], San_Diego: ["San Diego", "Chula Vista"], Orange: ["Anaheim", "Santa Ana"] },
    Colorado: { Denver: ["Denver", "Glendale"], El_Paso: ["Colorado Springs", "Manitou Springs"], Arapahoe: ["Aurora", "Centennial"] },
    Connecticut: { Fairfield: ["Bridgeport", "Stamford"], Hartford: ["Hartford", "New Britain"], New_Haven: ["New Haven", "Waterbury"] },
    Delaware: { New_Castle: ["Wilmington", "Newark"], Kent: ["Dover", "Milford"], Sussex: ["Georgetown", "Seaford"] },
    Florida: { Miami_Dade: ["Miami", "Hialeah"], Orange: ["Orlando", "Winter Park"], Hillsborough: ["Tampa", "Brandon"] },
    Georgia: { Fulton: ["Atlanta", "Sandy Springs"], DeKalb: ["Decatur", "Brookhaven"], Chatham: ["Savannah", "Tybee Island"] },
    Hawaii: { Honolulu: ["Honolulu", "Pearl City"], Hawaii: ["Hilo", "Kailua-Kona"], Maui: ["Kahului", "Lahaina"] },
    Idaho: { Ada: ["Boise", "Meridian"], Canyon: ["Nampa", "Caldwell"], Kootenai: ["Coeur d'Alene", "Post Falls"] },
    Illinois: { Cook: ["Chicago", "Evanston"], DuPage: ["Naperville", "Wheaton"], Sangamon: ["Springfield", "Chatham"] },
    Indiana: { Marion: ["Indianapolis", "Lawrence"], Allen: ["Fort Wayne", "New Haven"], Lake: ["Gary", "Hammond"] },
    Iowa: { Polk: ["Des Moines", "West Des Moines"], Linn: ["Cedar Rapids", "Marion"], Scott: ["Davenport", "Bettendorf"] },
    Kansas: { Johnson: ["Overland Park", "Olathe"], Sedgwick: ["Wichita", "Derby"], Shawnee: ["Topeka", "Auburn"] },
    Kentucky: { Jefferson: ["Louisville", "Shively"], Fayette: ["Lexington", "Nicholasville"], Kenton: ["Covington", "Independence"] },
    Louisiana: { Orleans: ["New Orleans", "Arabi"], East_Baton_Rouge: ["Baton Rouge", "Zachary"], Caddo: ["Shreveport", "Bossier City"] },
    Maine: { Cumberland: ["Portland", "South Portland"], Penobscot: ["Bangor", "Brewer"], York: ["Biddeford", "Sanford"] },
    Maryland: { Baltimore: ["Baltimore", "Towson"], Montgomery: ["Rockville", "Gaithersburg"], Prince_Georges: ["Bowie", "College Park"] },
    Massachusetts: { Suffolk: ["Boston", "Chelsea"], Middlesex: ["Cambridge", "Lowell"], Worcester: ["Worcester", "Leominster"] },
    Michigan: { Wayne: ["Detroit", "Dearborn"], Oakland: ["Troy", "Southfield"], Kent: ["Grand Rapids", "Wyoming"] },
    Minnesota: { Hennepin: ["Minneapolis", "Bloomington"], Ramsey: ["Saint Paul", "Roseville"], St_Louis: ["Duluth", "Hibbing"] },
    Mississippi: { Hinds: ["Jackson", "Clinton"], Harrison: ["Gulfport", "Biloxi"], DeSoto: ["Southaven", "Olive Branch"] },
    Missouri: { St_Louis: ["St. Louis", "Clayton"], Jackson: ["Kansas City", "Independence"], Greene: ["Springfield", "Republic"] },
    Montana: { Yellowstone: ["Billings", "Laurel"], Missoula: ["Missoula", "Lolo"], Gallatin: ["Bozeman", "Belgrade"] },
    Nebraska: { Douglas: ["Omaha", "Ralston"], Lancaster: ["Lincoln", "Waverly"], Sarpy: ["Bellevue", "Papillion"] },
    Nevada: { Clark: ["Las Vegas", "Henderson"], Washoe: ["Reno", "Sparks"], Carson_City: ["Carson City", "Indian Hills"] },
    New_Hampshire: { Hillsborough: ["Manchester", "Nashua"], Rockingham: ["Portsmouth", "Salem"], Merrimack: ["Concord", "Hooksett"] },
    New_Jersey: { Passaic: ["Paterson", "Passaic"], Essex: ["Newark", "East Orange"], Hudson: ["Jersey City", "Union City"] },
    New_Mexico: { Bernalillo: ["Albuquerque", "South Valley"], Santa_Fe: ["Santa Fe", "Eldorado"], Dona_Ana: ["Las Cruces", "Sunland Park"] },
    New_York: { New_York: ["New York City", "Manhattan"], Kings: ["Brooklyn", "Williamsburg"], Erie: ["Buffalo", "Cheektowaga"] },
    North_Carolina: { Mecklenburg: ["Charlotte", "Matthews"], Wake: ["Raleigh", "Cary"], Guilford: ["Greensboro", "High Point"] },
    North_Dakota: { Cass: ["Fargo", "West Fargo"], Burleigh: ["Bismarck", "Lincoln"], Grand_Forks: ["Grand Forks", "East Grand Forks"] },
    Ohio: { Cuyahoga: ["Cleveland", "Lakewood"], Franklin: ["Columbus", "Dublin"], Hamilton: ["Cincinnati", "Norwood"] },
    Oklahoma: { Oklahoma: ["Oklahoma City", "Edmond"], Tulsa: ["Tulsa", "Broken Arrow"], Cleveland: ["Norman", "Moore"] },
    Oregon: { Multnomah: ["Portland", "Gresham"], Washington: ["Hillsboro", "Beaverton"], Lane: ["Eugene", "Springfield"] },
    Pennsylvania: { Philadelphia: ["Philadelphia", "Chestnut Hill"], Allegheny: ["Pittsburgh", "McKeesport"], Dauphin: ["Harrisburg", "Hershey"] },
    Rhode_Island: { Providence: ["Providence", "Cranston"], Kent: ["Warwick", "West Warwick"], Newport: ["Newport", "Middletown"] },
    South_Carolina: { Richland: ["Columbia", "Forest Acres"], Charleston: ["Charleston", "Mount Pleasant"], Greenville: ["Greenville", "Mauldin"] },
    South_Dakota: { Minnehaha: ["Sioux Falls", "Brandon"], Pennington: ["Rapid City", "Box Elder"], Lincoln: ["Tea", "Harrisburg"] },
    Tennessee: { Davidson: ["Nashville", "Belle Meade"], Shelby: ["Memphis", "Germantown"], Knox: ["Knoxville", "Farragut"] },
    Texas: { Harris: ["Houston", "Pasadena"], Dallas: ["Dallas", "Irving"], Travis: ["Austin", "Pflugerville"] },
    Utah: { Salt_Lake: ["Salt Lake City", "West Valley City"], Utah: ["Provo", "Orem"], Davis: ["Layton", "Bountiful"] },
    Vermont: { Chittenden: ["Burlington", "South Burlington"], Rutland: ["Rutland", "Killington"], Washington: ["Montpelier", "Barre"] },
    Virginia: { Fairfax: ["Fairfax", "Reston"], Virginia_Beach: ["Virginia Beach", "Sandbridge"], Henrico: ["Richmond", "Highland Springs"] },
    Washington: { King: ["Seattle", "Bellevue"], Pierce: ["Tacoma", "Lakewood"], Spokane: ["Spokane", "Spokane Valley"] },
    West_Virginia: { Kanawha: ["Charleston", "South Charleston"], Monongalia: ["Morgantown", "Star City"], Cabell: ["Huntington", "Barboursville"] },
    Wisconsin: { Milwaukee: ["Milwaukee", "West Allis"], Dane: ["Madison", "Fitchburg"], Brown: ["Green Bay", "De Pere"] },
    Wyoming: { Laramie: ["Cheyenne", "Pine Bluffs"], Natrona: ["Casper", "Mills"], Teton: ["Jackson", "Teton Village"] }
  };

  function formatLabel(value) {
    return String(value).replaceAll("_", " ");
  }

  function getStates() {
    return Object.keys(US_LOCATION_DATA).map(formatLabel).sort();
  }

  function getStateKey(state) {
    return String(state || "").trim().replaceAll(" ", "_");
  }

  function getCountiesByState(state) {
    const stateEntry = US_LOCATION_DATA[getStateKey(state)] || {};
    return Object.keys(stateEntry).map(formatLabel).sort();
  }

  function getCitiesByStateAndCounty(state, county) {
    const stateEntry = US_LOCATION_DATA[getStateKey(state)] || {};
    const cities = stateEntry[getStateKey(county)] || [];
    return cities.slice().sort();
  }

  global.USLocationData = {
    data: US_LOCATION_DATA,
    getStates,
    getCountiesByState,
    getCitiesByStateAndCounty
  };
}(window));
