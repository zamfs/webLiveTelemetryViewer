const video = document.getElementById("bgVideo");
const button = document.getElementById("soundToggle");
const icon = document.getElementById("soundIcon");

button.addEventListener("click", () => {

    video.muted = !video.muted;
    
    if (video.muted) {
        icon.src = "/media/icons/SoundOFF.png";
    } else {
        icon.src = "/media/icons/SoundON.png";
    }

});