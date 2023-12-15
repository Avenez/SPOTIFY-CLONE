import { token } from "./token.js";
console.log(token);

const params = new URLSearchParams(window.location.search);
console.log("params", params);

const id = params.get("idArtist");
console.log(" id ", id);

window.addEventListener("DOMContentLoaded", () => {
    const options = {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": token,
            "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
        },
    };

    window.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            getrequestToArtistApi(options).then((nameArtist) => {
                console.log("nome artista ", nameArtist);
                getrequest(options, nameArtist);
            });
        }
    });

    getrequestToArtistApi(options).then((nameArtist) => {
        console.log("nome artista ", nameArtist);
        getrequest(options, nameArtist);
    });
});

const getrequestToArtistApi = (options) => {
    const url = `https://deezerdevs-deezer.p.rapidapi.com/artist/${id}`;

    return new Promise((resolve, reject) => {
        fetch(url, options)
            .then((result) => {
                console.log(result);
                if (result.ok) {
                    return result.json();
                } else {
                    reject("Errore nella richiesta API");
                }
            })
            .then((result) => {
                console.log(result);
                const nameArtist = result.name;
                console.log(nameArtist);
                resolve(nameArtist);
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
    });
};

const getrequest = (options, nameArtist) => {
    /* let inputSearch = document.getElementById("input-search").value || JSON.parse(localStorage.getItem("search"));

    localStorage.setItem("search", JSON.stringify(inputSearch)); */

    const encodedString = encodeURIComponent(nameArtist);
    console.log(encodedString);

    const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodedString}`;

    fetch(url, options)
        .then((result) => {
            console.log(result);
            if (result.ok) {
                return result.json();
            }
        })
        .then((result) => {
            console.log(result);
            getNameArtist(result);
            populatePlayerMusicFooter(result);
        })
        .catch((err) => {
            console.log(err);
        });
};

const getNameArtist = (result) => {
    console.log(result);

    const infoResult = result.data;
    console.log(infoResult);

    /* info generali artista  */
    let infoGenerali = infoResult[0].artist;
    console.log(infoGenerali);

    populatingImageTitle(infoGenerali);
    populatePopolarSongs(infoResult);
    populateLikedSongs(infoResult);
    populateMonthFollowers(infoResult);
};

const populatingImageTitle = (infoGenerali) => {
    /* nome principale */
    let nomeAutore = infoGenerali.name;
    const titoloPrincipale = document.getElementById("js-h1-artist");
    titoloPrincipale.innerHTML = nomeAutore;

    /* sfondo autore  */
    const divBackground = document.getElementById("js-img-sfondo-autore");
    divBackground.style.backgroundImage = `url(${infoGenerali.picture_xl})`;
    divBackground.style.objectFit = "contain";
    divBackground.style.backgroundPositionY = "20%";
    divBackground.style.backgroundPositionX = "center";
};

const populatePopolarSongs = (infoResult) => {
    console.log(infoResult);

    const divContainer = document.querySelector("#part2 > #js-box-inner-part2");

    const convertSecondsToMinutes = (secondi) => {
        const minuti = Math.floor(secondi / 60);
        const secondiRimanenti = secondi % 60;
        const formatoSecondi = secondiRimanenti < 10 ? `0${secondiRimanenti}` : secondiRimanenti;

        return `${minuti}:${formatoSecondi}`;
    };

    divContainer.innerHTML = `
                                             <div class="col">
                                                <div class="my-4"><h4 class="text-light">Popolari</h4></div>
                                            </div>
    `;

    for (let i = 0; i < infoResult.length; i++) {
        const singleSong = infoResult[i];

        divContainer.innerHTML += `
                    <div class="row">
                        <div class="col-12">
                            <div class="d-flex text-light justify-content-between my-2">
                                <button class="btn bg-transparent border-0 text-light js-button "> <div class="d-flex gap-2 align-items-center min-width-1">
                                    <div class="mx-1">${i + 1}</div>
                                    <img
                                        aria-hidden="false"
                                        draggable="false"
                                        loading="eager"
                                        src="${singleSong.album.cover_small}"
                                        alt= "canzone di ${singleSong.artist.name} titolo ${
            singleSong.album.title_short
        }"
                                        class="mMx2LUixlnN_Fu45JpFB rkw8BWQi3miXqtlJhKg0 Yn2Ei5QZn19gria6LjZj"
                                        width="40"
                                        height="40"
                                        style="border-radius: 4px"
                                    />
                                    <p>${singleSong.title}</p>
                                </div></button>
                                <div class="min-width-2 "><p> ${singleSong.rank.toLocaleString()}</p></div>
                                <div class="min-width-3 ">${convertSecondsToMinutes(singleSong.duration)}</div>
                            </div>
                        </div>
                    </div>
        `;
    }
};

const populateLikedSongs = (infoResult) => {
    console.log(infoResult);

    const likedSongsIcon = document.querySelectorAll(".js-img-likedSongs");

    const commento1 = document.querySelectorAll(".commento1");
    const commento2 = document.querySelectorAll(".commento2");

    let randomNumber = Math.floor(Math.random() * 50);

    for (let singleAlbum of infoResult) {
        likedSongsIcon.forEach((icon) => {
            icon.src = singleAlbum.artist.picture_small;
        });

        commento1.forEach((comm) => {
            comm.innerHTML = ` Hai messo mi piace a ${randomNumber} brani`;
        });

        commento2.forEach((comm) => {
            comm.innerHTML = `Di ${singleAlbum.artist.name}`;
        });
    }
};

const populateMonthFollowers = (infoResult) => {
    console.group(infoResult);
    let sommaAscoltatori = 0;
    const ascoltatoriTotali = document.getElementById("monthListeners");

    for (let ascoltatoriSIngleAlbum of infoResult) {
        ascoltatoriSIngleAlbum = ascoltatoriSIngleAlbum.rank;

        sommaAscoltatori += ascoltatoriSIngleAlbum;
    }

    ascoltatoriTotali.innerHTML = `ascoltatori mensili: ${sommaAscoltatori.toLocaleString()}`;
};

const populatePlayerMusicFooter = (result) => {
    console.log(result);

    const buttonSong = document.querySelectorAll(".js-button");

    buttonSong.forEach((button, index) => {
        button.addEventListener("click", () => {
            const htmlTitleFooter = document.querySelector(".js-name-choosen-song div h5");
            const imgFooterPlayer = document.querySelector(".js-img-footer img");

            const footerLeft = document.querySelector(".footer-left");
            footerLeft.classList.remove("visually-hidden");

            const footerMiddle = document.querySelector(".footer-middle");
            footerMiddle.classList.remove("visually-hidden");

            const footerRight = document.querySelector(".footer-right");
            footerRight.classList.remove("visually-hidden");

            const nameSong = result.data[index].title;
            const pictureAlbum = result.data[index].album.cover_small;

            htmlTitleFooter.innerHTML = nameSong;
            imgFooterPlayer.src = pictureAlbum;
            playTheMusic(result, index);
        });
    });
};

const playTheMusic = (result, index) => {
    const idSong = result.data[index].id;
    console.log(idSong);

    const options = {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": token,
            "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
        },
    };

    const urlTrackApi = `https://deezerdevs-deezer.p.rapidapi.com/track/${idSong}`;

    fetch(urlTrackApi, options)
        .then((output) => {
            console.log(output);
            if (!output.ok) {
                if (response.status > 400 && response.status < 500) {
                    throw new Error("errore bad request, MEA CULPA", response.status);
                }
                if (response.status > 500 && response.status < 600) {
                    throw new Error("errore lato server, NOT MEA CULPA", response.status);
                }
            } else {
                return output.json();
            }
        })
        .then((data) => {
            console.log(data);
            console.log(data.preview); /* canzone ce l'abbiamo */
            const song = data.preview;
            playSongIntoPlayerMp3(song);
        });
};

const playSongIntoPlayerMp3 = (song) => {
    const audioPlayer = document.getElementById("audio");
    const playBtn = document.getElementById("play-btn");
    const pauseBtn = document.getElementById("pause-btn");
    const volume = document.getElementById("volume");
    const playerBar = document.getElementById("playerBar");
    const toggleAudio = document.getElementById("toggleAudio");
    const volumeIcon = document.getElementById("js-volume-icon");

    audioPlayer.src = song;

    let isPlaying = false;
    let isMute = false;

    toggleAudio.addEventListener("click", () => {
        volumeIcon.classList.toggle("bi-volume-mute-fill");
        toggleMusic(isMute);
    });

    const playSong = () => {
        isPlaying = true;
        audioPlayer.play();
    };

    const pauseSong = () => {
        isPlaying = false;
        audioPlayer.pause();
    };

    const setVolume = () => {
        audioPlayer.volume = volume.value;
    };

    const toggleMusic = () => {
        isMute = !isMute; // Toggle the mute state
        if (isMute) {
            audioPlayer.volume = 0;
        } else {
            audioPlayer.volume = volume.value;
        }
    };

    const updateProgressBar = () => {
        let totalDurationSong = audioPlayer.duration;
        let progress = audioPlayer.currentTime / totalDurationSong;
        playerBar.value = progress * 100;

        console.log("durata totale song", totalDurationSong);
        console.log("progresso", progress);

        const progressNum = document.getElementById("progressoNumber");
        progressNum.innerHTML = Math.round(progress * 100);

        const durataTotale = document.getElementById("durataTotale");
        durataTotale.innerHTML = Math.floor(totalDurationSong);
    };

    playBtn.addEventListener("click", () => {
        playSong();
    });

    pauseBtn.addEventListener("click", () => {
        pauseSong();
    });

    volume.addEventListener("click", () => {
        setVolume();
    });

    playerBar.addEventListener("input", () => {
        const newPosition = playerBar.value;
        audioPlayer.currentTime = newPosition;
    });

    audioPlayer.addEventListener("timeupdate", () => {
        updateProgressBar();
    });
};

/* DA USARE PER CONVERTIRE secondi a timer minuti:secondi */
const convertiSecondiInMinuti = (durataAlbum) => {
    // Calcola il numero di minuti
    var minuti = Math.floor(durataAlbum / 60);

    // Calcola i secondi rimanenti dopo la conversione in minuti
    var restanti = Math.floor(durataAlbum % 60);

    // Restituisce una stringa che rappresenta il tempo in formato "minuti:secondi"
    return minuti + ":" + (restanti < 10 ? "0" : "") + restanti;
};
