/*
  Follow these steps:
 ● Create a module for finding current information on a particular city.
 Information for the city, including coordinates, can be found using this
 API.
 ● We will make use of (node.js)Fetch
 ● You can work under the assumption that the city is always in South Africa.
 ● The following details are to be shown:
 o Population
 o Elevation
 o Current temperature (using this weather API)
 ● All potential errors should be appropriately handled.
 */

//This function is used to delay the fetch.
const sleep = (milliseconds) => {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
};

//This function fetch the a city passed by argument and return a promise with wikiDataId of it.
const getCityWikiDataId = async (city) => {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "4014f4df86msh81d1786af7680c7p1e8ac3jsn00cf5859314c",
      "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(
      `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=10&countryIds=ZA&minPopulation=1&maxPopulation=10000000&namePrefix=${city}&namePrefixDefaultLangResults=true`,
      options
    );

    const data = await response.json();

    const wikiDataId = data.data[0].wikiDataId;

    return wikiDataId;
  } catch (error) {
    if (error instanceof TypeError) {
      console.log("Insert a city located in South Africa");
    }
  }
};

//This function fetch a city name by it's wikiDataId passed as argument and return a promise with the city details.
const getCityDetails = async (wikiDataId) => {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "4014f4df86msh81d1786af7680c7p1e8ac3jsn00cf5859314c",
      "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(
      `https://wft-geo-db.p.rapidapi.com/v1/geo/cities/${wikiDataId}`,
      options
    );
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("getCityDetails error ", error);
  }
};

//This function fetch a city by it's coordinate and return a promise with city current temperature.
const getCurrentWeather = async (latitude, longitude) => {
  const key = "2a4722bddd3b4cbb80f125820222212";

  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${key}&q=${latitude},${longitude}&aqi=no`
    );

    const data = await response.json();

    return data.current.temp_c;
  } catch (error) {
    console.error("getCurrentWeather error", error);
  }
};

//This function receive as argument a city name and output the population, elevation and current temperature of those.
const outputInformation = async (city) => {
  try {
    const cityWikiDataId = await getCityWikiDataId(city);

    sleep(1500);

    const cityDetails = await getCityDetails(cityWikiDataId);

    const latitude = cityDetails.data.latitude;
    const longitude = cityDetails.data.longitude;

    const weather = await getCurrentWeather(latitude, longitude);

    document.getElementById(
      "city"
    ).innerHTML = `City - ${cityDetails.data.name}`;

    document.getElementById(
      "country"
    ).innerHTML = `Country - ${cityDetails.data.country}`;

    document.getElementById(
      "population"
    ).innerHTML = `Population - ${cityDetails.data.population} People`;

    document.getElementById(
      "elevation"
    ).innerHTML = `Elevation - ${cityDetails.data.elevationMeters} Meters`;

    document.getElementById(
      "current-temp"
    ).innerHTML = `Temperature - ${weather}° Celcius`;
  } catch (error) {
    if (error instanceof TypeError) {
      console.log(`You have entered: ${city}`);
    }
  }
};

//Cities must to be located in South Africa.
const city = "pretoria";

outputInformation(city);
