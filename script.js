const input = document.getElementById('musicInput');
const img = document.getElementById('musicArt');
const player = document.getElementById('player');

const titleDisplay = document.getElementById("songTitle");
const artistDisplay = document.getElementById("artistName");

const songsList = [];

input.addEventListener('change', (e) => {
  const files = e.target.files;
  Array.from(files).forEach(file => {
    if (file) {
        // Play the audio
        //player.src = URL.createObjectURL(file);
        
        // For music info
        jsmediatags.read(file, {
        onSuccess: (tag) => {
            
            const artist = tag.tags.artist;
            const title = tag.tags.title;
            const picture = tag.tags.picture;

            if (picture) {
            const base64 = btoa(
                picture.data.reduce((data, byte) => data + String.fromCharCode(byte), '')
            );

            //   img.src = `data:${picture.format};base64,${base64}`;
            //   document.getElementById("print").innerHTML = artist + " " + title;

            const song = {
                fileSrc: URL.createObjectURL(file),
                artist: artist,
                title: title,
                art: picture ? `data:${picture.format};base64,${base64}`: "defSongImg.jpeg"
            }
            
                songsList.push(song);
            }
        },
        onError: (error) => {
            console.log('Error reading tags:', error);
        }
        });
    }
  })
    
});

const backButton = document.getElementById("backButton");
const playButton = document.getElementById("playButton");
const nextButton = document.getElementById("nextButton")

const pausePlayButton = document.getElementById("pausePlayButton");
const timeSlider = document.getElementById("timeSlider");
const num = document.getElementById("num");


let index = 0;
let songLength = 0;

// Prereqs
function getSongLength(){
    songLength = player.duration
    num.innerHTML = songLength;
    timeSlider.max = songLength;
}

function loadArtistData(ind) {
    img.src = songsList[ind].art;
    player.src = songsList[ind].fileSrc;
    titleDisplay.innerHTML = songsList[ind].title;
    artistDisplay.innerHTML = songsList[ind].artist;
}


// Playlist control buttons
backButton.addEventListener("click", () => {
    if (songsList.length === 0) return;

    if (index == 0) {
        index = songsList.length-1;
    } else {
        index -= 1;
    }

    loadArtistData(index);
    setPausePlayState();
    
    timeSlider.value = 0;
    player.addEventListener("loadedmetadata", getSongLength);

    player.play();
})

playButton.addEventListener("click", () => {
    if (songsList.length === 0) return;

    loadArtistData(index);
    setPausePlayState();

    timeSlider.value = 0;
    player.addEventListener("loadedmetadata", getSongLength);

    player.play();
})

nextButton.addEventListener("click", () => {
    if (songsList.length === 0) return;

    if (index == songsList.length-1) {
        index = 0;
    } else {
        index += 1;
    }

    loadArtistData(index);
    setPausePlayState();

    timeSlider.value = 0;
    player.addEventListener("loadedmetadata", getSongLength);

    player.play();
})


// Timeslider controls
//      lets timeSlider change audio time
timeSlider.addEventListener("input", () => {
    player.currentTime = timeSlider.value;
})

player.ontimeupdate = function() {
    timeSlider.value = player.currentTime

    if (player.currentTime == songLength) {
        nextButton.click();
    }
}


// Pause Play control
pausePlayButton.addEventListener("click", ()=>{
    if (pausePlayButton.classList.contains("play")) {
        player.play();
        pausePlayButton.classList.remove("play");
        pausePlayButton.classList.add("pause");

        pausePlayButton.innerHTML = "pause";
    } else if (pausePlayButton.classList.contains("pause")) {
        player.pause();
        pausePlayButton.classList.remove("pause");
        pausePlayButton.classList.add("play");

        pausePlayButton.innerHTML = "play";
    }
})

function setPausePlayState() {
    pausePlayButton.innerHTML = "pause";
    pausePlayButton.classList.remove("play");
    pausePlayButton.classList.add("pause");
}