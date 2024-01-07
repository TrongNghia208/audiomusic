document.addEventListener("DOMContentLoaded", function () {
  // Check if the user is logged in
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (loggedInUser) {
    // Display the information of the logged-in user
    displayUserInformation(loggedInUser);
  } else {
    // Handle the case when no user is logged in
    console.log("No user logged in.");
  }
});

function displayUserInformation(user) {
  // Display the user's information
  document.querySelector(".imgprofile").src = user.avatar;
  document.querySelector(".imgprofile").alt = "User Avatar";
  document.querySelector(".yourName").innerHTML = user.username;
}

const searchQuery = document.querySelector(".searchQuery");
const aside = document.querySelector(".aside");
const songList = document.querySelector(".article");

const clientId = "13b5d8d0dd19428787f9d1d5c43ac223";
const clientSecret = "031938e1d3464855bb31fb00539ed719";
const redirectUri = "http://127.0.0.1:5500/index.html";

const myAudio = document.querySelector("#myAudio");

const out = document.querySelector(".out");

const existUsers = JSON.parse(localStorage.getItem("audio"));
const listAudio = existUsers || [];
const listUser = JSON.parse(localStorage.getItem("users"));

///get user profile
// index

// Exchange the code for an access token
const currentUrl = window.location.href;
const authHeader = "Basic " + btoa(clientId + ":" + clientSecret);

searchQuery.addEventListener("input", (e) => {
  // aside.classList.add("hide");
  // songList.classList.add("show");
  if (searchQuery.value == "") {
    aside.style.display = "block";
    // songList.classList.remove("show");
    songList.style.display = "none";
  } else {
    songList.style.display = "block";
    aside.style.display = "none";

    // aside.classList.add("hide");
    // songList.classList.remove("show");
  }
  const inputValue = e.target.value;
  // const inputValue = searchQuery.trim().value;

  fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: authHeader,
    },
    body: "grant_type=client_credentials",
  })
    .then((response) => response.json())
    .then((data) => {
      const accessToken = data.access_token;
      // console.log("Access Token:", accessToken);
      songList.innerHTML = "";
      // Now you can use the access token for Spotify API requests

      fetch(
        "https://api.spotify.com/v1/search?q=" + inputValue + "&type=track",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          // Handle the search results
          // console.log(data);

          data.tracks.items.forEach((tracks) => {
            const imageUrl = tracks.album.images[2]?.url || "defaultImageUrl";
            const trackName = tracks.name || "Unknown Track";
            const artistName = tracks.artists[0]?.name || "Unknown Artist";
            const previewUrl = tracks.preview_url || "#";
            const hrefs = tracks.href || "#";

            listSong(imageUrl, trackName, artistName, previewUrl);
          });
          // myAudio.addEventListener("play", () => {});
          myAudio.addEventListener("play", () => {
            const listplay = {
              img: imageUrl,
              name: trackName,
              art: artistName,
              prev: previewUrl,
            };
            listAudio.push(listplay);
            localStorage.setItem("audio", JSON.stringify(listAudio));
            console.log(listAudio);
          });
        });
    });
});

function listSong(img, name, nameArt, prev) {
  const musicPopular = `      <div class="content-act">
    <div class="sum">

    <img src="${img}" alt="" />
    <div class="infor">
      <p class="song">${name}</p>
      <p class="artist">${nameArt}</p>
    </div>
    <audio controls  id="myAudio"><source src="${prev}" type="audio/mp3" ></audio>
    
    <!-- <div class="control">

    <i class="bi bi-download"></i>
      <i class="bi bi-skip-start"></i>
      <i class="bi bi-skip-end"></i>
    </div> -->
    </div>

    </div>`;
  songList.insertAdjacentHTML("beforeend", musicPopular);
  // console.log(listSong);
}

const slide = document.querySelectorAll(".slide");
const slides = document.querySelectorAll(".popularmusic-aside");
let currentSlide = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    if (i === index) {
      slide.style.opacity = 1;
    } else {
      slide.style.opacity = 0;
    }
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function startSlider() {
  setInterval(nextSlide, 3000); // Adjust the interval as needed
}

startSlider();

out.addEventListener("click", () => {
  window.location.href = "./register/login.html";
});
