document.addEventListener("click", getPoints);

function getPoints(event) {
    console.log("x: " + event.clientX + ", y: " + event.clientY)
}