
function processGeolocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const userLatitude = position.coords.latitude;
            const userLongitude = position.coords.longitude;


            const mapElement = document.getElementById("map");
            console.log(userLatitude, userLongitude);

            fetch(`https://api.filmprojekt1.de/api/audio?userLatitude=${userLatitude}&userLongitude=${userLongitude}`)
                .then(response => response.json())
                .then(data => {
                    // Verarbeiten Sie die API-Antwort, die Audio-URLs enthält
                    const audioFiles = data.audioFiles;


                    const radius = 5; // Der Radius in Kilometern
                    const audioToPlay = audioFiles.filter(audio => {
                        const audioLatitude = audio.latitude;
                        const audioLongitude = audio.longitude;

                        const distance = calculateDistance(userLatitude, userLongitude, audioLatitude, audioLongitude);

                        return distance <= radius;
                    });

                    const playButton = document.getElementById("playButton");
                    playButton.addEventListener("click", function () {
                        let loader = document.getElementById("loader");
                        loader.style.display = "block";
                        console.log("Audio wird geladen.")
                        if (audioToPlay.length > 0) {
                            const audioElement = document.getElementById("audio");
                            audioElement.src = audioToPlay[0].audio_url;
                            audioElement.play();
                            loader.style.display = "none";
                            console.log("Audio wird abgespielt.")
                        } else {
                            console.log("Keine passenden Audio-Dateien im Radius gefunden.");
                        }

                    });
                })
                .catch(error => {
                    console.error("Fehler bei der API-Anfrage: " + error);
                });
        });
    } else {
        console.error("Geolocation wird vom Browser nicht unterstützt.");
    }
}


processGeolocation();



function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Erdradius in Kilometern
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}
