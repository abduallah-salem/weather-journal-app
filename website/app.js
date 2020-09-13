/* Global Variables */
const generate = document.getElementById('generate');
let zip = document.getElementById('zip');

//openweathermap base URL and API key
const weatherURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const APIKey = '4e911865934a97bd3b005ef594b8ce10';
const loader = document.getElementById('overlay');
const progress = document.getElementById('progress');

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = (d.getMonth() + 1) + '.' + d.getDate() + '.' + d.getFullYear();

/*Dynamic alert error messages using hangover.js alert with the error message provided
https://github.com/paulkr/overhang.js
Takes one arugment @errorText => error text message
*/
const alertMain = (errorText) => {
    //disable loader
    loader.style.display = "none";
    //Call the overhang method to display the error message
    $("body").overhang({
        type: "error",
        message: errorText,
        duration: 2
    });
}


/*
This function uses a Zip Code validation API called Zippopotam to validate the Zip Code before sending a fetch the OpenWeatherMap API
Takes one argument @zipCode => entered zipCode
*/
const validateZip = async (zipCode) => {
    //Below is a basic regex to validate that the entered ZipCode only contains numbers is not longer than 5 digits
    let usZipCoderegx = /(^\d{5}$)/;
    //Test if the ZipCode is matching the regex and return an alert if it doesn't match
    if (!usZipCoderegx.test(zipCode)) {
        return alertMain('Please enter a valid US zip code');
    }
    //Start fetch
    const request = await fetch(`http://api.zippopotam.us/us/${zipCode}`);
    try {
        /*check the returned status code
            - Valid -> return zipCode.
            - invalid -> display error and return error to stop the postGet function.
        */
        if (!request.ok) {
            alertMain('Invalid Zip Code');
            return 'invalid';
        } else {
            return zipCode;
        }
    } catch (error) {
        console.log("error", error);
        //display alert in case of error
        alertMain('Invalid Zip Code');
        return 'invalid';
    }
}

/* Retrieve Weather Data from the OpenWeatherMap API, takes 3 arguments
- @baseURL => API base url
- @zipCode => validated zip code
- @appid => API key
*/
const retrieveWeatherData = async (baseURL, zipCode, appid) => {
    //Concatenate fetch URL below will retrieve the data in mertic units
    const url = `${baseURL}${zipCode}&units=metric&appid=${appid}`;
    //Start fetch
    const request = await fetch(url);
    try {
        // Transform received data into JSON
        const weatherData = await request.json();
        /*check the returned status code
            - Valid -> return zipCode.
            - invalid -> display error and return error to stop the postGet function.
        */
        if (!request.ok) {
            alertMain(`No weather data found, please try a different US zip code`);
        } else {
            console.log(weatherData.main.temp);
            return weatherData.main.temp;
        }
    } catch (error) {
        console.log('Invalid Zip Code');
    }
};

/* Post the required data to the server
requires 2 arguments
- @url => post route
- @data => {temprature: weatherData, date: newDate, userResponse: feelings}
*/
const postData = async (url = '', data = {}) => {
    //start fetch with the correct options
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    try {
        //wait for the response and return it
        const confirmation = await response.json();
        return confirmation;
    } catch (error) {
        console.log("error", error);
    }
};
/* Get the most recent entry from the server's end point then update the entry holder with the retrieved data
requires 1 argument @url => get route
*/
const updateUI = async (url = '') => {
    //Save the entryHolder div element in a variable
    const entryHolder = document.getElementById('entryHolder');
    //start fetch
    const request = await fetch(url);
    try {
        const allData = await request.json()
        //Update the innerHTML property with the retrieved data, The below method should improve performance slightly instead of assigning for each child element separately
        entryHolder.innerHTML = `<div id = "date">Date: ${allData.date}</div> 
        <div id = "temp">Temprature: ${allData.temprature}°C</div>
        <div id = "content">Feeling: ${allData.userResponse}</div>`;
        //animate the entry if no entries are there
        entryHolder.classList.add('showHolder')
        return allData;
    } catch (error) {
        console.log("error", error);
    }
};
/* Start the app logic */
const getPost = async (e) => {
    //display loader
    loader.style.display = "block";

    //save the zipCOde and feelings elements values in 2 variables
    const zipCode = zip.value;
    const feelings = document.getElementById('feelings').value;
    //check that both fields aren't empty, return alert should one or both are empty 
    if (!zipCode || !feelings) {
        return alertMain('Please enter a zip code and how you are feeling today first!');
    }
    //call the validateZip function and wait for it be completed
    await validateZip(zipCode)
        .then((zipCode) => {
            /* chain the retrieveWeatherData function 
                check the returned zipCode value
                if it equals invalid return invalid and exit function
            */
            if (zipCode == 'invalid') {
                return console.log('invalid');
            } else {
                //change the loader progress text
                progress.textContent = 'Checking the Weather...';
                //call the retrieveWeatherData function
                return retrieveWeatherData(weatherURL, zipCode, APIKey)
            }
        })
        .then((weatherData) => {
            /* chain the postData function 
                check if weatherData exists
            */
            if (weatherData) {
                //change the loader progress text
                progress.textContent = 'Almost there...';
                //call the postData function
                return postData('/newEntry', {
                    temprature: weatherData,
                    date: newDate,
                    userResponse: feelings
                });
            }
        })
        .then((confirmation) => {
            /* chain the UpdateUI function
                check if the confirmation response is received
            */
            if (confirmation) {
                //call the updateUI function
                return updateUI('/all');
            }
        })
    loader.style.display = "none";
    progress.textContent = 'Validating zipcode...';
}
//Add a click event listener to Generate button
generate.addEventListener('click', getPost);