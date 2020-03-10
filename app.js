window.addEventListener("load", () => {
    //Latitude and Longitude variables
    let long;
    let lat;

    // Current variables
    let temperatureDescription = document.querySelector('.temperature-description' );
    let temperatureDegree = document.querySelector('.temperature-degree');
    let locationTimezone = document.querySelector('.location-timezone');
    let temperatureSection = document.querySelector('.temperature');
    const temperatureSpan = document.querySelector('.temperature span')

    // Tomorrow variables 
    let tm_temperatureDescription = document.querySelector('.tm-temperature-description');
    let tm_highTemperatureDegree = document.querySelector('.tm-high-temperature-degree');
    let tm_lowTemperatureDegree = document.querySelector('.tm-low-temperature-degree');

    //Geolocate position 
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;

            //API - proxy is used to get over origin error
            const proxy = `https://cors-anywhere.herokuapp.com/`;
            const api = `${proxy}https://api.darksky.net/forecast/e53186504d6928107ab352f0070f492f/${lat},${long}`;


            //Retrieve api data and fill 
            fetch(api)
                .then(response => {
                    return response.json();
            })
                .then(data => {
                    console.log(data);
                    const {temperature, summary, icon} = data.currently;
                    //Set elements from API
                    temperatureDegree.textContent = "Current temperature: " + Math.floor(temperature);
                    temperatureDescription.textContent = ('It is ' + summary.toLowerCase() + ' outside');
                    locationTimezone.textContent = data.timezone.replace(/America/g, "").replace('/', '').replace('_', ' ');

                    //Set tomorrow elements from API
                    const {temperatureHigh, temperatureLow} = data.daily.data[0];
                    tm_highTemperatureDegree.textContent = "High of: " + Math.floor(temperatureHigh);
                    tm_lowTemperatureDegree.textContent = "Low of: " + Math.floor(temperatureLow);

                    //set icons
                    setIcons(icon, document.querySelector('.icon'));

                    //Formula for F -> C degrees
                    let celsius = (temperature - 32) * (5/9);

                    //Change temperature C/F
                    temperatureSection.addEventListener('click', () =>{
                        if(temperatureSpan.textContent === "F"){
                            temperatureSpan.textContent = "C";
                            temperatureDegree.textContent = Math.floor(celsius);
                        } else {
                            temperatureSpan.textContent = "F";
                            temperatureDegree.textContent = Math.floor(temperature);
                        }
                    })
            });
        });
    }
    //Sets icons from skycons
    function setIcons(icon, iconID){
        const skycons = new Skycons({color: "white"});
        const currentIcon = icon.replace(/-/g, "_").toUpperCase();
        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon]);
    }
});
