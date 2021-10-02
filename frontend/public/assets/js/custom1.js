jQuery(document).ready(function () {
  jQuery("#politics").owlCarousel({
    items: 3,
    loop: true,
    margin: 0,
  });

  $("#playButton").click(function () {
    playPause("video1");
    console.log("click");
  });
});
