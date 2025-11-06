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
                renderListItems();
            }
        },
        onError: (error) => {
            console.log('Error reading tags:', error);
        }
        });
    }
  })
    
});

const songsUl = document.getElementById("songsUl");

function renderListItems() {
    songsUl.innerHTML = "";
    songsList.forEach(song => {
        const htmlPreset = `<li>
                    <div class="songLIDiv">
                        <button class="delButton">✖</button>
                        <p>${song.title}</p>
                    </div>
                </li>`
        songsUl.innerHTML = songsUl.innerHTML + htmlPreset;
        
    });

    document.querySelectorAll(".delButton").forEach((item, index) => {
        item.addEventListener("click", ()=>{
            songsList.splice(index, 1);
            renderListItems();
        })
});

    document.querySelectorAll(".songLIDiv").forEach((item, iindex) => {
        item.addEventListener("click", () => {
            if (first === true) {
                first = false;
            }
            
            index = iindex;
            loadArtistData(iindex);
            setPausePlayState();

            timeSlider.value = 0;
            player.addEventListener("loadedmetadata", getSongLength);
        })
});
}





const backButton = document.getElementById("backButton");
// const playButton = document.getElementById("playButton");
const nextButton = document.getElementById("nextButton")

const pausePlayButton = document.getElementById("pausePlayButton");
const timeSlider = document.getElementById("timeSlider");
const volSlider = document.getElementById("volSlider");
const num = document.getElementById("num");


let index = 0;
let songLength = 0;

timeSlider.value = 0;
let first = true;
let shuffle = true;

// Prereqs
function getSongLength(){
    songLength = player.duration
    // num.innerHTML = songLength;
    timeSlider.max = songLength;
}

function loadArtistData(ind) {
    img.src = songsList[ind].art;
    player.src = songsList[ind].fileSrc;
    titleDisplay.innerHTML = songsList[ind].title;
    artistDisplay.innerHTML = songsList[ind].artist;

    player.removeEventListener("loadedmetadata", getSongLength);
    player.addEventListener("loadedmetadata", getSongLength);

    player.play();
}

function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }


// function getRandomSong(ind) {
//     if (songsList.length === 0) return;

//     let ranIndex = getRandomInt(songsList.length);

//     while (ranIndex ===  ind) {
//         if (ranIndex === songsList.length - 1) {
//             ranIndex = 0;

//         } else if (ranIndex === 0) {
//             ranIndex = ranIndex + 1;
//         }
//     }

//     loadArtistData(ranIndex);
// }

// Playlist control buttons
backButton.addEventListener("click", () => {
    if (songsList.length === 0) return;

    if (index == 0) {
        index = songsList.length-1;
    } else {
        index -= 1;
    }

    // if (shuffle === true) {
    //     getRandomSong(index);
    // } else {
    //     loadArtistData(index);
    // }

    loadArtistData(index);

    setPausePlayState();
    
    timeSlider.value = 0;
    player.addEventListener("loadedmetadata", getSongLength);

    // player.play();
})


// Pause Play control
pausePlayButton.addEventListener("click", ()=>{
    if (first === true) {
        if (songsList.length === 0) return;
        first = false;

        // if (shuffle === true) {
        //     getRandomSong(index);
        // } else {
        //     loadArtistData(index);
        // }

        loadArtistData(index);
        
        setPausePlayState();

        timeSlider.value = 0;
        player.addEventListener("loadedmetadata", getSongLength);

        // player.play();

    } else if (pausePlayButton.classList.contains("play")) {
        player.play();
        pausePlayButton.classList.remove("play");
        pausePlayButton.classList.add("pause");

        pausePlayButton.innerHTML = "❚❚";
    } else if (pausePlayButton.classList.contains("pause")) {
        player.pause();
        pausePlayButton.classList.remove("pause");
        pausePlayButton.classList.add("play");

        pausePlayButton.innerHTML = "▶";
    }
})


nextButton.addEventListener("click", () => {
    if (songsList.length === 0) return;

    if (index == songsList.length-1) {
        index = 0;
    } else {
        index += 1;
    }

    // if (shuffle === true) {
    //     getRandomSong(index);
    // } else {
    //     loadArtistData(index);
    // }

    loadArtistData(index);

    setPausePlayState();

    timeSlider.value = 0;
    player.addEventListener("loadedmetadata", getSongLength);

    // player.play();
})


// Timeslider controls
//      lets timeSlider change audio time
timeSlider.addEventListener("input", () => {
    player.currentTime = timeSlider.value;
})

player.ontimeupdate = function() {
    timeSlider.value = player.currentTime
}

player.onended = function() {
    nextButton.click();
}

volSlider.addEventListener("input", () => {
    player.volume = volSlider.value;
})

player.onvolumechange = function() {
    volSlider.value = player.volume
}

function setPausePlayState() {
    pausePlayButton.innerHTML = "❚❚";
    pausePlayButton.classList.remove("play");
    pausePlayButton.classList.add("pause");
}


// playButton.addEventListener("click", () => {
//     if (songsList.length === 0) return;

//     loadArtistData(index);
//     setPausePlayState();

//     timeSlider.value = 0;
//     player.addEventListener("loadedmetadata", getSongLength);

//     player.play();
// })
