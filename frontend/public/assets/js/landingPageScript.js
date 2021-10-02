function playPause(id) {
  var myVideo = document.getElementById(id);
  if (myVideo.paused) myVideo.play();
  else myVideo.pause();
}

$("#basic").flagStrap();
$("#origin").flagStrap({
  placeholder: {
    value: "",
    text: "Country of origin",
  },
});
$("#options").flagStrap({
  countries: {
    AU: "Australia",
    GB: "United Kingdom",
    US: "United States",
  },
  buttonSize: "btn-sm",
  buttonType: "btn-info",
  labelMargin: "10px",
  scrollable: false,
  scrollableHeight: "350px",
});
$("#advanced").flagStrap({
  buttonSize: "btn-lg",
  buttonType: "btn-primary",
  labelMargin: "20px",
  scrollable: false,
  scrollableHeight: "350px",
  onSelect: function (value, element) {
    alert(value);
    console.log(element);
  },
});
