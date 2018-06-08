'use strict';
function showPodcastLink() {
  var isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;
  if /* if we're on iOS, open in Apple Maps */
    (isMac ||
     (navigator.platform.indexOf("iPhone") != -1) ||
     (navigator.platform.indexOf("iPad") != -1) ||
     (navigator.platform.indexOf("iPod") != -1))
    {
      var podcastLink = document.getElementById("podcast-link");
      podcastLink.style.display = "block"
    }
}

showPodcastLink();

function updatePageWithSermons(sermon_data) {
  addIndividualSermons(sermon_data);
  addSermonSeries(sermon_data);
}

function addSermonSeries(sermon_data) {
  var allSeries = sermon_data.map(sermon => sermon.series);
  var uniqueSeriesNames = [...new Set(allSeries)];

  var sermonSeriesSection = document.getElementById("sermon-series");
  var seriesName;
  for (seriesName of uniqueSeriesNames) {
    var seriesEl = document.createElement("div");
    seriesEl.textContent = seriesName;
    sermonSeriesSection.appendChild(seriesEl);
  }
}

function addIndividualSermons(sermon_data) {

  //Grab the sermon section...
  var sermonSection = document.getElementById("sermons");

  //Grab the template from the page...
  var sermonTemplate = document.getElementById('sermon_template');
  
  //Iterate over the sermon data...
  var sermon;
  for (sermon of sermon_data) {

    //Copy the template into a new isntance
    var sermonDiv = document.importNode(sermonTemplate.content, true);

    var sermonDate = new Date(Date.parse(sermon.date));
    // console.log(sermonDate);
    var dateString = sermonDate.toLocaleDateString();
    // console.log(dateString);

    //var dateString = Date.parse(sermon.date).toLocaleDateString();

    //Set the values
    sermonDiv.querySelector(".sermon-title").textContent = sermon.title;
    sermonDiv.querySelector(".sermon-speaker").textContent = sermon.speaker;
    sermonDiv.querySelector(".sermon-passage").textContent = sermon.passage;
    sermonDiv.querySelector(".sermon-series").textContent = sermon.series;
    sermonDiv.querySelector(".sermon-service").textContent = sermon.service;
    sermonDiv.querySelector(".sermon-date").textContent = dateString;
    sermonDiv.querySelector(".sermon-graphic").setAttribute("style",`background-image: url(${sermon.imageURL});`);
    sermonDiv.querySelector(".sermon-download").setAttribute("href",sermon.audioFileURL);
    sermonDiv.querySelector(".sermon-player").setAttribute("src",sermon.audioFileURL);

    sermonSection.appendChild(sermonDiv);
  }
}

//Location of the sermon data.
var sermon_data_url = "http://ccmtalkstest.s3-website-eu-west-1.amazonaws.com/sermondata.json";
if (document.URL.includes("localhost")) {
  sermon_data_url = "/sermondata.json";
}

//Fetch the data and pass it to the function to draw it into the page.
var sermon_data = fetch(sermon_data_url)
  .then(function(response) {
    return response.json();
  })
  .then(updatePageWithSermons)
  .catch(function(rejection){
    console.log(rejection);
  });
