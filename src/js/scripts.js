const indexDisplayTime = document.querySelector("#index-layer-display tspan");
const indexPlayer = document.querySelector("#index-player");
const indexPlayerAudio = document.querySelector("#index-player-audio");
const indexTrackButtons = Array.from(document.querySelectorAll("[data-reel-track]"));
const indexTrackData = document.querySelector("#index-player-track-data");
const indexEasterEgg = document.querySelector(".index-easter-egg");
const bannerLogo = document.querySelector("#banner-logo");

const applyThemePreference = (theme) => {
if (theme === "dark") {
document.documentElement.setAttribute("data-theme", "dark");
return;
}

document.documentElement.removeAttribute("data-theme");
};

const toggleThemePreference = () => {
const nextTheme = document.documentElement.getAttribute("data-theme") === "dark"
? null
: "dark";

applyThemePreference(nextTheme);

try {
if (nextTheme) {
window.localStorage.setItem("theme", nextTheme);
return;
}

window.localStorage.removeItem("theme");
} catch (error) {
console.error("Theme preference could not be saved.", error);
}
};

if (indexEasterEgg) {
indexEasterEgg.addEventListener("click", () => {
toggleThemePreference();
});

indexEasterEgg.addEventListener("keydown", (event) => {
if (event.key !== "Enter" && event.key !== " ") {
return;
}

event.preventDefault();
toggleThemePreference();
});
}

if (indexDisplayTime) {
const timeFormatter = new Intl.DateTimeFormat(undefined, {
hour: "2-digit",
minute: "2-digit",
hour12: false
});

const renderTime = () => {
indexDisplayTime.textContent = timeFormatter.format(new Date());
};

const scheduleNextTick = () => {
const now = new Date();
const delay = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

window.setTimeout(() => {
renderTime();
scheduleNextTick();
}, delay);
};

renderTime();
scheduleNextTick();
}

if (indexPlayer && indexPlayerAudio && indexTrackButtons.length) {
let indexTracks = [];

if (indexTrackData) {
try {
indexTracks = JSON.parse(indexTrackData.textContent);
} catch (error) {
console.error("Home reel track data could not be parsed.", error);
}
}

const syncIndexPlayer = () => {
const isPlaying = !indexPlayerAudio.paused && !indexPlayerAudio.ended && Boolean(indexPlayerAudio.currentSrc);
const activeTrackIndex = indexPlayerAudio.getAttribute("data-track-index");

indexPlayer.classList.toggle("is-playing", isPlaying);

if (bannerLogo) {
bannerLogo.classList.toggle("is-playing", isPlaying);
}

indexTrackButtons.forEach((button) => {
const isActive = button.getAttribute("data-track-index") === activeTrackIndex && isPlaying;
button.setAttribute("aria-pressed", String(isActive));
});
};

const resetIndexTrack = () => {
indexPlayerAudio.pause();
indexPlayerAudio.removeAttribute("src");
indexPlayerAudio.removeAttribute("data-track-index");
indexPlayerAudio.load();
syncIndexPlayer();
};

const playIndexTrack = async (button) => {
const trackIndex = button.getAttribute("data-track-index");

if (trackIndex === null) {
return;
}

const isCurrentTrack = indexPlayerAudio.getAttribute("data-track-index") === trackIndex;

if (isCurrentTrack && !indexPlayerAudio.paused && !indexPlayerAudio.ended) {
resetIndexTrack();
return;
}

if (!isCurrentTrack) {
const track = indexTracks[Number(trackIndex)];

if (!track || !track.audioFile) {
return;
}

indexPlayerAudio.src = track.audioFile;
indexPlayerAudio.setAttribute("data-track-index", trackIndex);
}

try {
await indexPlayerAudio.play();
} catch (error) {
console.error("Home reel playback failed.", error);
}
};

indexTrackButtons.forEach((button) => {
button.addEventListener("click", () => {
void playIndexTrack(button);
});
});

indexPlayerAudio.addEventListener("play", syncIndexPlayer);
indexPlayerAudio.addEventListener("pause", syncIndexPlayer);
indexPlayerAudio.addEventListener("ended", syncIndexPlayer);

syncIndexPlayer();
}

const portfolioCassette = document.querySelector(".portfolio-cassette");
const portfolioAudio = document.querySelector("audio");
const portfolioCassetteToggle = document.querySelector(".portfolio-cassette-toggle");

if (portfolioCassette && portfolioAudio) {
const syncCassettePlayback = () => {
const isPlaying = !portfolioAudio.paused && !portfolioAudio.ended;

portfolioCassette.classList.toggle("is-playing", isPlaying);

if (bannerLogo) {
bannerLogo.classList.toggle("is-playing", isPlaying);
}
};

const toggleCassettePlayback = async () => {
if (portfolioAudio.paused || portfolioAudio.ended) {
try {
await portfolioAudio.play();
} catch (error) {
console.error("Audio playback failed.", error);
}

return;
}

portfolioAudio.pause();
};

portfolioAudio.addEventListener("play", syncCassettePlayback);
portfolioAudio.addEventListener("pause", syncCassettePlayback);
portfolioAudio.addEventListener("ended", syncCassettePlayback);

if (portfolioCassetteToggle) {
portfolioCassetteToggle.addEventListener("click", () => {
void toggleCassettePlayback();
});
}

syncCassettePlayback();
}
