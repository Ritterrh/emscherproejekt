const audioPlayer = document.getElementById("audioPlayer");
const musicList = document.getElementById("songList");
const playPauseBtn = document.getElementById("playPauseBtn");
const progressSlider = document.getElementById("progressSlider");
const progressTime = document.getElementById("progressTime");
const speedSelect = document.getElementById("speedSelect");
const audioInfo_code = document.getElementById("audioInfoCode");
const audioInfo_titel = document.getElementById("audioInfo");
const controls = document.getElementById("controls");
const disalbeinput = document.getElementById("disalbeinput");

window.addEventListener('load', function () {
    setTimeout(function () {
        
        // Show content

    }, 2000);
});
const serverUrl = "http://api.ruhrkulturerlebnis.de"
let isPlaying = false;
let isSeeking = false;
document.querySelector('.loader').classList.add('show');
function togglePlay() {
  if (isPlaying) {
    audioPlayer.pause();
    playPauseBtn.textContent = "Play";
  } else {
    audioPlayer.play();
    playPauseBtn.textContent = "Pause";
  }
  isPlaying = !isPlaying;
}

function updateProgressSlider() {
  if (!isSeeking) {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    const progress = (currentTime / duration) * 100;
    progressSlider.value = currentTime;
    progressTime.textContent = `${formatTime(currentTime)} / ${formatTime(
      duration
    )}`;
  }
}

function addDownloadButton(li, songName) {
  const downloadDiv = document.createElement("div");
  downloadDiv.className = "download-div";

  const downloadBtn = document.createElement("button");
  downloadBtn.textContent = "Download";
  downloadBtn.className = "download-btn";
  downloadBtn.setAttribute("data-song", songName);

  // Event listener for the download button
  downloadBtn.addEventListener("click", function () {
    const songSrc = `music/${this.getAttribute("data-song")}.mp3`;
    const link = document.createElement("a");
    link.href = songSrc;
    link.download = `${this.getAttribute("data-song")}.mp3`;
    link.click();
  });

  downloadDiv.appendChild(downloadBtn);
  li.appendChild(downloadDiv);
  const songNameDiv = document.createElement("div");
  songNameDiv.textContent = songName;
  songNameDiv.className = "song-name";

  // Event listener for the song name
  songNameDiv.addEventListener("click", function () {
    const currentSong = document.querySelector(".song-name.darken");
    if (currentSong) {
      currentSong.classList.remove("darken");
    }
    audioPlayer.src = `${serverUrl}/api/v1/file/${songName}.mp3`;
    audioPlayer.play();
    isPlaying = true;
    playPauseBtn.textContent = "Pause";
    songNameDiv.classList.add("darken");
  });

  li.appendChild(songNameDiv);
  musicList.appendChild(li);
}
function disalbeinputs() {
    controls.style.visibility = "hidden";
    disalbeinput.style.pointerEvents = "none";

}
function enableinput() {    
    disalbeinput.style.pointerEvents = "auto";
}
disalbeinputs();
if (navigator.geolocation) {
  var options = {
    enableHighAccuracy: true,
  };
  
  navigator.permissions.query({ name: "geolocation" }).then(function (result) {
    if (result.state === "granted") {
      audioInfo_titel.textContent =
        "Du hast der Bentzung von Geolocation zugestimmt und die Audio Infos werden geladen";
      audioInfo_code.textContent = "Erro Code: G1";
    } else if (result.state === "prompt") {
      audioInfo_titel.textContent =
        "Bitte erlaube die Benutzung von Geolocation";
      audioInfo_code.textContent = "Erro Code: G2";
    } else if (result.state === "denied") {
      console.log("Geolocation is denied");
      audioInfo_titel.textContent =
        "Geolocation ist nicht erlaubt. Bitte erlaube die Benutzung von Geolocation in den Einstellungen deines Browsers um den Audio Guid zu benutzen.";
      audioInfo_code.textContent = "Erro Code: G3";
    }
    result.onchange = function () {
      console.log(result.state);
    };
  });
  navigator.geolocation.getCurrentPosition(
    loadAudio,
    () => console.error("Error getting geolocation"),
    options
  );
} else {
  audioInfo_titel.textContent = "Geolocation is not supported by this browser.";
}

function loadAudio(position) {

   fetch(`${serverUrl}/api/v1/audio?userLatitude=${position.coords.latitude}&userLongitude=${position.coords.longitude}`)
  //fetch(`http://localhost:3000/api/v1/audio?userLatitude=0&userLongitude=0`)
    .then((response) => response.json())
    .then((data) => {
      const audioFiles = data.audioFiles;
      const erro = data.err;
      const erro_code = data.err_code;
      const isError = data.isError;
      console.log(isError);
      console.log(erro_code && erro);
      if (isError === "true") {
        audioInfo_titel.textContent = "";
        audioInfo_code.textContent = "";
        document.querySelector('.loader').classList.add('hide');
        audioInfo_titel.textContent = erro;
        audioInfo_code.textContent = erro_code;
      } else {
        enableinput();
        playPauseBtn.style.visibility = "visible";
        controls.style.visibility = "visible";
        audioInfo_titel.textContent = "";
        audioInfo_code.textContent = "";
        document.querySelector('.loader').classList.add('hide');
        audioInfo_titel.textContent =
          "Alle verfügbaren audio Guids in deiner nähe wurden geladen";
        audioInfo_code.textContent = "Audio Infos wurden erfolgreich geladen";
      }


      audioFiles.forEach((audioData) => {
        const audioName = audioData.AudioName;
        console.trace(audioData);
        console.count();

        const songSrc = `${serverUrl}/api/v1/file/${audioName}.mp3`;
        const li = document.createElement("li");
        li.setAttribute("data-src", songSrc);
        addDownloadButton(li, audioName);
      });
    })
    .catch((error) => {
        document.querySelector('.loader').classList.add('hide');
        audioInfo_titel.textContent = "Es ist ein Fehler aufgetreten";
        audioInfo_code.textContent = "Error Code" + error;
      console.error("Error fetching data:", error);
    });
}

// Fetch the list of songs from the server

// Add event listeners to each list item to play the corresponding song
musicList.addEventListener("click", function (event) {
  if (event.target.tagName === "LI") {
    const songSource = event.target.getAttribute("data-src");
    audioPlayer.src = songSource;
    audioPlayer.play();
    isPlaying = true;
    playPauseBtn.textContent = "Pause";
  }
});

// Event listener for the play/pause button
playPauseBtn.addEventListener("click", togglePlay);

// Event listener for the progress slider (when the user drags the slider)
progressSlider.addEventListener("input", function () {
  const seekTime = parseFloat(this.value);
  audioPlayer.currentTime = seekTime;
  progressTime.textContent = `${formatTime(seekTime)} / ${formatTime(
    audioPlayer.duration
  )}`;
  isSeeking = true;
});

// Event listener for the progress slider (when the user releases the slider)
progressSlider.addEventListener("change", function () {
  isSeeking = false;
});

// Event listener for the audio time update to update the progress slider
audioPlayer.addEventListener("timeupdate", updateProgressSlider);

// Event listener for the speed selection
speedSelect.addEventListener("change", function () {
  audioPlayer.playbackRate = parseFloat(this.value);
});

// Helper function to format time in MM:SS format
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}
