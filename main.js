//function to sanitize the article data
var sanitizeHTML = function (str) {
  var temp = document.createElement("div");
  temp.textContent = str;
  return temp.innerHTML;
};
//store api key
var apiKey = "dAA9q6pvIOeZy6SNeo7yPZpCAiZjo2iR";

//make variable for number of sections so it can be changed easily.
var numberOfSections = 3;
//grab the pull down list
var number = document.querySelector("#number");

//grab the app to inject html into
var app = document.querySelector("#app");
//limit the news stories grabed to the top 3 in each section
var firstFewArticles = function (articles) {
  return articles.slice(0, numberOfSections);
};

//querySelectors for the default checkBoxes
const arts = document.querySelector("#arts");
const automobiles = document.querySelector("#automobiles");
const books = document.querySelector("#books");

//querySelector for submit button
const submit = document.querySelector("#submit");

var sections = [];
//set first three checkboxes to check to give page some content display on load
arts.checked = true;
automobiles.checked = true;
books.checked = true;

function sectionCheck() {
  //change value of numberOfSections to reflect user's  choice
  numberOfSections = number.value;
  //set apps content to nothing so when we resumbit the section choice it does not leave the old sections
  app.innerHTML = " ";
  //grab all of the checkboxes and turn them to array to run forEach
  var checkboxes = document.querySelectorAll(`[type*="checkbox"]`);

  Array.prototype.slice.call(checkboxes).forEach((checkbox) => {
    if (checkbox.checked === true) {
      sections.push(checkbox.id);
    }
  });
  //get the articles for each section and run the api calls.
  sections.forEach(function (section) {
    getNews(section);
  });
}

//helper function to render the news with
const renderNews = function (articles, section) {
  //clear an element off the array so we don't have repeats in next search
  sections.shift();

  app.innerHTML +=
    "<h2>" +
    section.toUpperCase() +
    "</h2>" +
    articles
      .map(function (story) {
        html =
          "<div class='story'><h3>" +
          '<a href="' +
          sanitizeHTML(story.url) +
          '">' +
          sanitizeHTML(story.title) +
          " </a></h3><p  class='auth'>" +
          sanitizeHTML(story.byline) +
          "</p>" +
          "<p>" +
          sanitizeHTML(story.abstract) +
          "</p><hr></div>";

        return html;
      })
      .join("");
};
//api promise call
var getNews = function (section) {
  fetch(
    "https://api.nytimes.com/svc/topstories/v2/" +
      section +
      ".json?api-key=" +
      apiKey
  )
    .then(function (response) {
      // The API call was successful!
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(response);
      }
    })
    .then(function (data) {
      // This is the JSON from our response
      //get the first few articles

      var firstArticles = firstFewArticles(data.results);

      //render into the dom
      renderNews(firstArticles, section);
    })
    .catch(function (err) {
      // There was an error
      console.warn("Something went wrong.", err);
    });
};

//run first section check for page load
sectionCheck();
//listen for clicks on submit button and re-run the api calls for new sections
submit.addEventListener("click", sectionCheck, false);
