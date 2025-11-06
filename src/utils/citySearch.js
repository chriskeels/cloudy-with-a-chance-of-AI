// State to cities mapping for random city selection
const STATE_CITIES = {
  // Major US States with popular cities
  'alabama': ['Birmingham', 'Montgomery', 'Mobile', 'Huntsville'],
  'alaska': ['Anchorage', 'Fairbanks', 'Juneau'],
  'arizona': ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale'],
  'arkansas': ['Little Rock', 'Fort Smith', 'Fayetteville'],
  'california': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'Oakland', 'Fresno'],
  'colorado': ['Denver', 'Colorado Springs', 'Aurora', 'Boulder'],
  'connecticut': ['Hartford', 'New Haven', 'Stamford', 'Bridgeport'],
  'delaware': ['Wilmington', 'Dover', 'Newark'],
  'florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'],
  'georgia': ['Atlanta', 'Augusta', 'Columbus', 'Savannah'],
  'hawaii': ['Honolulu', 'Hilo', 'Kailua'],
  'idaho': ['Boise', 'Meridian', 'Nampa'],
  'illinois': ['Chicago', 'Aurora', 'Rockford', 'Joliet'],
  'indiana': ['Indianapolis', 'Fort Wayne', 'Evansville'],
  'iowa': ['Des Moines', 'Cedar Rapids', 'Davenport'],
  'kansas': ['Wichita', 'Overland Park', 'Kansas City', 'Topeka'],
  'kentucky': ['Louisville', 'Lexington', 'Bowling Green'],
  'louisiana': ['New Orleans', 'Baton Rouge', 'Shreveport'],
  'maine': ['Portland', 'Lewiston', 'Bangor'],
  'maryland': ['Baltimore', 'Frederick', 'Rockville', 'Gaithersburg'],
  'massachusetts': ['Boston', 'Worcester', 'Springfield', 'Cambridge'],
  'michigan': ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights'],
  'minnesota': ['Minneapolis', 'Saint Paul', 'Rochester', 'Duluth'],
  'mississippi': ['Jackson', 'Gulfport', 'Southaven'],
  'missouri': ['Kansas City', 'Saint Louis', 'Springfield', 'Columbia'],
  'montana': ['Billings', 'Missoula', 'Great Falls'],
  'nebraska': ['Omaha', 'Lincoln', 'Bellevue'],
  'nevada': ['Las Vegas', 'Henderson', 'Reno', 'Carson City'],
  'new hampshire': ['Manchester', 'Nashua', 'Concord'],
  'new jersey': ['Newark', 'Jersey City', 'Paterson', 'Elizabeth'],
  'new mexico': ['Albuquerque', 'Las Cruces', 'Rio Rancho', 'Santa Fe'],
  'new york': ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse'],
  'north carolina': ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem'],
  'north dakota': ['Fargo', 'Bismarck', 'Grand Forks'],
  'ohio': ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron'],
  'oklahoma': ['Oklahoma City', 'Tulsa', 'Norman'],
  'oregon': ['Portland', 'Salem', 'Eugene', 'Gresham'],
  'pennsylvania': ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie'],
  'rhode island': ['Providence', 'Warwick', 'Cranston'],
  'south carolina': ['Charleston', 'Columbia', 'North Charleston'],
  'south dakota': ['Sioux Falls', 'Rapid City', 'Aberdeen'],
  'tennessee': ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga'],
  'texas': ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth', 'El Paso'],
  'utah': ['Salt Lake City', 'West Valley City', 'Provo', 'West Jordan'],
  'vermont': ['Burlington', 'Essex', 'South Burlington'],
  'virginia': ['Virginia Beach', 'Norfolk', 'Chesapeake', 'Richmond'],
  'washington': ['Seattle', 'Spokane', 'Tacoma', 'Vancouver'],
  'west virginia': ['Charleston', 'Huntington', 'Morgantown'],
  'wisconsin': ['Milwaukee', 'Madison', 'Green Bay'],
  'wyoming': ['Cheyenne', 'Casper', 'Laramie'],
  
  // Common abbreviations
  'ca': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento'],
  'ny': ['New York City', 'Buffalo', 'Rochester', 'Syracuse'],
  'tx': ['Houston', 'San Antonio', 'Dallas', 'Austin'],
  'fl': ['Miami', 'Orlando', 'Tampa', 'Jacksonville'],
  'il': ['Chicago', 'Aurora', 'Rockford'],
  'pa': ['Philadelphia', 'Pittsburgh', 'Allentown'],
  'oh': ['Columbus', 'Cleveland', 'Cincinnati'],
  'ga': ['Atlanta', 'Augusta', 'Columbus'],
  'nc': ['Charlotte', 'Raleigh', 'Greensboro'],
  'mi': ['Detroit', 'Grand Rapids', 'Warren'],
  'nj': ['Newark', 'Jersey City', 'Paterson'],
  'va': ['Virginia Beach', 'Norfolk', 'Richmond'],
  'wa': ['Seattle', 'Spokane', 'Tacoma'],
  'az': ['Phoenix', 'Tucson', 'Mesa'],
  'ma': ['Boston', 'Worcester', 'Springfield'],
  'tn': ['Nashville', 'Memphis', 'Knoxville'],
  'in': ['Indianapolis', 'Fort Wayne', 'Evansville'],
  'mo': ['Kansas City', 'Saint Louis', 'Springfield'],
  'md': ['Baltimore', 'Frederick', 'Rockville'],
  'wi': ['Milwaukee', 'Madison', 'Green Bay'],
  'co': ['Denver', 'Colorado Springs', 'Aurora'],
  'mn': ['Minneapolis', 'Saint Paul', 'Rochester'],
  'sc': ['Charleston', 'Columbia', 'North Charleston'],
  'al': ['Birmingham', 'Montgomery', 'Mobile'],
  'la': ['New Orleans', 'Baton Rouge', 'Shreveport'],
  'ky': ['Louisville', 'Lexington', 'Bowling Green'],
  'or': ['Portland', 'Salem', 'Eugene'],
  'ok': ['Oklahoma City', 'Tulsa', 'Norman'],
  'ct': ['Hartford', 'New Haven', 'Stamford'],
  'ut': ['Salt Lake City', 'West Valley City', 'Provo'],
  'ia': ['Des Moines', 'Cedar Rapids', 'Davenport'],
  'nv': ['Las Vegas', 'Henderson', 'Reno'],
  'ar': ['Little Rock', 'Fort Smith', 'Fayetteville'],
  'ms': ['Jackson', 'Gulfport', 'Southaven'],
  'ks': ['Wichita', 'Overland Park', 'Kansas City'],
  'nm': ['Albuquerque', 'Las Cruces', 'Santa Fe'],
  'ne': ['Omaha', 'Lincoln', 'Bellevue'],
  'id': ['Boise', 'Meridian', 'Nampa'],
  'wv': ['Charleston', 'Huntington', 'Morgantown'],
  'hi': ['Honolulu', 'Hilo', 'Kailua'],
  'me': ['Portland', 'Lewiston', 'Bangor'],
  'nh': ['Manchester', 'Nashua', 'Concord'],
  'ri': ['Providence', 'Warwick', 'Cranston'],
  'mt': ['Billings', 'Missoula', 'Great Falls'],
  'de': ['Wilmington', 'Dover', 'Newark'],
  'sd': ['Sioux Falls', 'Rapid City', 'Aberdeen'],
  'nd': ['Fargo', 'Bismarck', 'Grand Forks'],
  'ak': ['Anchorage', 'Fairbanks', 'Juneau'],
  'vt': ['Burlington', 'Essex', 'South Burlington'],
  'wy': ['Cheyenne', 'Casper', 'Laramie']
};

/**
 * Processes search input to handle state names and return a city
 * If a state name is entered, returns a random city from that state
 * Otherwise returns the original input
 * 
 * @param {string} input - User's search input
 * @returns {string} - City name to search for
 */
export function processSearchInput(input) {
  if (!input || typeof input !== 'string') {
    return input;
  }

  // Clean and normalize the input
  const cleanInput = input.trim().toLowerCase();
  
  // Check if the input matches a state name or abbreviation
  if (STATE_CITIES[cleanInput]) {
    const cities = STATE_CITIES[cleanInput];
    // Return a random city from the state
    return cities[Math.floor(Math.random() * cities.length)];
  }

  // If not a state, return the original input (assuming it's a city)
  return input.trim();
}

export default processSearchInput;