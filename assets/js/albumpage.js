import { token } from "./token.js";
console.log(token);

const params = new URLSearchParams(window.location.search);
console.log("params", params);

const id = params.get("idAlbum");
console.log(" id ", id);

window.addEventListener("DOMContentLoaded", () => {
    getAlbumData();
    generateRandomBgGradient();
    //   song.pause();
});

// ------GET ALBUM DATA
async function getAlbumData() {
    const url = "https://deezerdevs-deezer.p.rapidapi.com/album/" + id;
    const options = {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": "bde0ca7a00msh3ab1dec316b8a6bp18dc62jsn449fcf0e2690",
            "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
        },
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);
        // generateRandomBgGradient();
        buildPage(result);
        createPlaylist(result);
        songLink();
        addSkip();
        addPrevious();
        addLoop();
        addShuffle();
        allPlayBtnFun();
    } catch (error) {
        console.error(error);
    }
}

// ------CONVERSIONE SECONDI IN MINUTI
function convertiSecondiInMinuti(durataAlbum) {
    // Calcola il numero di minuti
    var minuti = Math.floor(durataAlbum / 60);

    // Calcola i secondi rimanenti dopo la conversione in minuti
    var restanti = Math.floor(durataAlbum % 60);

    // Restituisce una stringa che rappresenta il tempo in formato "minuti:secondi"
    return minuti + ":" + (restanti < 10 ? "0" : "") + restanti;
}

// ------BUILD PAGE
const buildPage = (result) => {
    //   ----seleziono tutti gli spazi da riempire
    let fotoAlbum = document.querySelector(".fotoAlbum");
    let nomeAlbum = document.querySelector(".nome-album");
    let artistImage = document.querySelector(".artistImage");
    let artistName = document.querySelector(".artistName");
    let releaseYear = document.querySelector(".releaseYear");
    let songsNum = document.querySelector(".songsNum");
    let duration = document.querySelector(".duration");

    let durataAlbum = result.duration;

    convertiSecondiInMinuti(durataAlbum);

    // -------riempio gli spazi con il contenuto dell'aggetto Album
    //   ---foto Album
    fotoAlbum.innerHTML = `                           
<img
src=${result.cover_medium}
class="figure-img img-fluid"
alt="A generic square placeholder image."
/>`;

    // --- Nome Album
    nomeAlbum.innerText = result.title;

    //   ---immagine Artista
    let imageSmall = result.artist.picture_small;

    artistImage.innerHTML = `
  <img
  src=${imageSmall}
  class="rounded-circle"
  alt="A generic square placeholder image."
/>`;

    // --- Nome Artista
    artistName.innerText = result.artist.name;

    // --- Anno Uscita
    releaseYear.innerText = " - " + result.release_date.slice(0, 4) + " - ";

    // ---Num Brani
    songsNum.innerText = result.tracks.data.length.toString();

    //   ---durata
    duration.innerText = convertiSecondiInMinuti(durataAlbum) + " min";
};

// ------CREATE PLAYLIST
let songIdArray = [];
let songSourceArray = [];
let songsObjArray = [];

const createPlaylist = (result) => {
    let count = 1;
    let songsArray = result.tracks.data;

    let songsContainer = document.querySelector(".songsContainer");

    songsArray.forEach((i) => {
        console.log(i);
        let songCont = document.createElement("div");
        songCont.classList.add("row", "songSelect");
        songCont.innerHTML = `

                  <div class="d-flex justify-content-between align-items-center">
                    <div class="col-6">
                      <ul class="list-group d.flex">
                        <li class="text-white bg-transparent border-0 list-group-item">
                          <div class="d-flex">
                            <div class="p-2 m-l-auto h6">
                              <p class="text-right">${count}</p>
                            </div>
                            <div class="ml-2 text-secondary">
                              <a class="songToPlay text-white fw-bold h6" id="${i.id}">${i.title_short}</a>
                              <h3 class="text-muted h6">${i.title}</h3>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div class="col-3">
                      <ul class="list-group">
                        <li class="text-white bg-transparent border-0 list-group-item">
                          <div class="d-flex justify-content-end">
                            <div class="ml-2 text-secondary">
                              <h3 class="text-muted h6">${Math.floor(Math.random() * 100000)}</h3>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div class="col-3">
                      <ul class="list-group">
                        <li class="text-white bg-transparent border-0 list-group-item">
                          <div class="d-flex justify-content-end">
                            <div class="ml-2 text-secondary">
                              <h3 class="text-muted h6">${convertiSecondiInMinuti(i.duration)}</h3>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>

  `;
        songsContainer.appendChild(songCont);
        count++;
        songIdArray.push(i.id);
        songSourceArray.push(i.preview);
        songsObjArray.push(i);
    });
    console.log(songIdArray);
    console.log(songSourceArray);
    console.log(songsObjArray);
};

// ---Rardom Color
const generateRandomBgGradient = () => {
    // Genera valori RGB randomici
    var randomColor1 =
        "rgb(" +
        Math.floor(Math.random() * 256) +
        "," +
        Math.floor(Math.random() * 256) +
        "," +
        Math.floor(Math.random() * 256) +
        ")";

    // seleziono il div e aggiungo uno stile inline
    var div = document.querySelector(".Content-area");
    div.style.background = randomColor1;
    div.style.background = "linear-gradient(180deg, " + randomColor1 + " 0%, " + "rgba(0,0,0,1) 100%)";
};

// ---Like Button
const changeColor = () => {
    let emptyHeart = document.querySelector(".heartButton1");
    let fullHeart = document.querySelector(".heartButton2");

    emptyHeart.classList.toggle("d-none");
    fullHeart.classList.toggle("d-none");
};

const heartBtn = document.querySelector(".heartBtn");
heartBtn.addEventListener("click", changeColor);

// ------- MUSIC PLAYER

let ctrlIcon = document.getElementById("ctrlIcon");

let progress = document.getElementById("progress");
let song = document.getElementById("song");

song.onloadedmetadata = function () {
    progress.max = song.duration;
    progress.value = song.currentTime;
    let songMaxDuration = document.getElementById("max");
    songMaxDuration.innerText = convertiSecondiInMinuti(song.duration);
};

ctrlIcon.addEventListener("click", playPause);

// ---Reset Player
const resetPlayer = () => {
    ctrlIcon.classList.remove("bi-pause-circle");
    ctrlIcon.classList.add("bi-play-circle");
};

function playPause() {
    if (ctrlIcon.classList.contains("bi-pause-circle")) {
        song.pause();
        ctrlIcon.classList.remove("bi-pause-circle");
        ctrlIcon.classList.add("bi-play-circle");
    } else {
        song.play();
        ctrlIcon.classList.remove("bi-play-circle");
        ctrlIcon.classList.add("bi-pause-circle");
    }
}

if (song.play()) {
    setInterval(() => {
        progress.value = song.currentTime;
        let currentPlayTime = document.getElementById("timePlay");
        currentPlayTime.innerText = convertiSecondiInMinuti(song.currentTime);
    }, 1000);

    progress.onchange = function () {
        song.play();
        song.currentTime = progress.value;
        ctrlIcon.classList.add("bi-pause-circle");
        ctrlIcon.classList.remove("bi-play-circle");
    };
}

// ------VOLUME
var volumeControl = document.getElementById("volumeControl");
var audio = document.getElementById("song");
volumeControl.addEventListener("input", function () {
    audio.volume = volumeControl.value;
});

// ----- PLAY SONG
const generateMusicPlayer = (result) => {
    let musicPlayer = document.querySelector(".musicPlayer");
    musicPlayer.classList.remove("d-none");
    let songSource = document.getElementById("source");
    songSource.src = result.preview;
    songSource.srcset = result.id;
    song.load();
    song.pause();
};

const generateSongLabel = (result) => {
    var selectedSongImg = document.getElementById("selectedSongImg");
    var selectedSongTitle = document.getElementById("selectedSongTitle");
    var selectedSongArtist = document.getElementById("selectedSongArtist");
    var songLabelHeart = document.getElementById("songLabelHeart");
    var volumeControlContainer = document.getElementById("volumeControlContainer");

    selectedSongTitle.innerText = result.title;
    selectedSongArtist.innerText = result.artist.name;
    selectedSongImg.innerHTML = `<img src="${result.album.cover_small}" alt="prova prova" />`;
    songLabelHeart.classList.remove("d-none");
    volumeControlContainer.classList.remove("d-none");
};

async function getSongData(songId) {
    const url = "https://deezerdevs-deezer.p.rapidapi.com/track/" + songId;
    const options = {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": "bde0ca7a00msh3ab1dec316b8a6bp18dc62jsn449fcf0e2690",
            "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
        },
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        generateMusicPlayer(result);
        generateSongLabel(result);
        resetPlayer();
        console.log(result);
        return result;
    } catch (error) {
        console.error(error);
    }
}

const songLink = () => {
    let songsToPlay = document.querySelectorAll(".songToPlay");

    songsToPlay.forEach((element) => {
        element.addEventListener("click", function () {
            let songId = element.id;
            console.log("id della canzone:", songId);
            getSongData(songId);
        });
    });
};

// -----restart canzone
song.addEventListener("ended", () => {
    progress.value = 0;
    song.currentTime = 0;
    song.pause();
    nextSong();
});

// ---NEXT SONG

const nextSong = () => {
    let loopBtn = document.getElementById("loop");
    let songPlayedNow = document.getElementById("source");
    let songPlayedNowIndex = songIdArray.indexOf(parseInt(songPlayedNow.srcset));
    let shuffleBtn = document.getElementById("shuffle");

    if (loopBtn.classList.contains("text-success")) {
        song.play();
    } else if (shuffleBtn.classList.contains("text-success")) {
        let randIndex = Math.floor(Math.random() * songIdArray.length);
        let newIndex = randIndex % songIdArray.length;
        songPlayedNow.srcset = songIdArray[newIndex];
        let newSource = songSourceArray[newIndex];
        songPlayedNow.src = newSource;
        changeSongLabel(newIndex);
        console.log(newIndex);
        song.load();
        song.play();
    } else {
        let newIndex = (songPlayedNowIndex + 1) % songIdArray.length;
        songPlayedNow.srcset = songIdArray[newIndex];
        let newSource = songSourceArray[newIndex];
        songPlayedNow.src = newSource;
        changeSongLabel(newIndex);
        console.log(newIndex);
        song.load();
        song.play();
    }
};

const addSkip = () => {
    let skip = document.getElementById("skip");
    skip.addEventListener("click", nextSong);
};

// ---Previous Song

const previousSog = () => {
    let songPlayedNow = document.getElementById("source");
    let songPlayedNowIndex = songIdArray.indexOf(parseInt(songPlayedNow.srcset));
    let newIndex = (songPlayedNowIndex - 1) % songIdArray.length;
    songPlayedNow.srcset = songIdArray[newIndex];
    let newSource = songSourceArray[newIndex];
    songPlayedNow.src = newSource;
    changeSongLabel(newIndex);
    console.log(newIndex);
    song.load();
    song.play();
};

const addPrevious = () => {
    let skip = document.getElementById("prev");
    skip.addEventListener("click", previousSog);
};

const changeSongLabel = (index) => {
    var selectedSongImg = document.getElementById("selectedSongImg");
    var selectedSongTitle = document.getElementById("selectedSongTitle");
    var selectedSongArtist = document.getElementById("selectedSongArtist");

    selectedSongTitle.innerText = songsObjArray[index].title;
    selectedSongArtist.innerText = songsObjArray[index].artist.name;
    selectedSongImg.innerHTML = `<img src="${songsObjArray[index].album.cover_small}" alt="prova prova" />`;
};

// ---LOOP
const addLoop = () => {
    let loopBtn = document.getElementById("loop");
    loopBtn.addEventListener("click", () => {
        loopBtn.classList.toggle("text-success");
    });
};

// ---SHUFFLE
const addShuffle = () => {
    let shuffleBtn = document.getElementById("shuffle");
    shuffleBtn.addEventListener("click", () => {
        shuffleBtn.classList.toggle("text-success");
    });
};

// ---ALLPLAYBTN
const allPlayBtnFun = () => {
    let result2 = songsObjArray[0];
    let allPlayBtn = document.getElementById("allSongsPlay");
    allPlayBtn.addEventListener("click", () => generateMusicPlayer(result2));
    allPlayBtn.addEventListener("click", () => generateSongLabel(result2));
};
