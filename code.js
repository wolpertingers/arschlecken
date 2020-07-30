document.addEventListener("click", getPoints);


$(document).ready(function() {
    $("#points").hide();
});

function getPoints(event) {
    console.log("x: " + event.clientX + ", y: " + event.clientY)
    showPoints(100);
}

function showPoints(points) {
    var element = $("#points");
    element.html(`+${points}`)
    element.slideToggle(1000, () => element.slideToggle(1000));
}