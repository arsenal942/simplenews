var newsSourceSelection = localStorage.getItem("newsSource");
var newsArticleUrl = "https://newsapi.org/v1/articles?source=" + newsSourceSelection + "&apiKey=c1904a9dbf22437eb11e1abcb13c1807";
var sourcesUrl = "https://newsapi.org/v1/sources";

$(document).ready(function() {
    hideHtmlElements();
    checkLocalStorage();
});

function checkLocalStorage() {
    if (newsSourceSelection) {
        ajaxGetRequest(newsArticleUrl, generateNewsArticleCards);
    } else {
        ajaxGetRequest(sourcesUrl, generateSourceSelectionCards);
    }
}

function setNewsSourceSelection(data) {
    var id = data.id;
    localStorage.setItem("newsSource", id);
    ajaxGetRequest("https://newsapi.org/v1/articles?source=" + id + "&apiKey=c1904a9dbf22437eb11e1abcb13c1807", generateNewsArticleCards);
}

function ajaxGetRequest(url, successFunction) {
    loadingCards();
    $.ajax({
        url: url,
        type: "GET",
        success: successFunction,
        error: displayErrorMessage
    });
}

function generateNewsArticleCards(data) {
    hideLoader();    
    $(".newsSourceItem").hide();
    $(".newsArticleItem, .resetNewsSource, footer").show();
    $.each(data.articles, function(key, val) {       	 
        $(".container").append("<section class='newsArticleItem'><div class='card'><h2>" + val.author + 
        "</h2><h1>" + val.title + "</h1><hr><img src='" + val.urlToImage + "'/>" +
        "<p>" + val.description + 
        "</p><a class='btn' href='" + val.url + "'>Read More</a><div class='space'></div></div></section>");
    });
}

function generateSourceSelectionCards(data) {
        hideLoader();
        $(".newsArticleItem, .resetNewsSource").hide();
        $(".newsSourceItem, .searchForNewsSource, footer").show();
    $.each(data.sources, function(key, val) {       	 
        $(".container").append("<section id='" + val.name + "' class='newsSourceItem'><div class='card'><h2>" + val.category + ", " + val.language + 
        "</h2><h1>" + val.name + "</h1><hr>" +
        "<p>" + val.description + 
        "</p><a href='#' onclick='setNewsSourceSelection(this);' id='" + val.id + "' class='btn''>Subscribe</a><div class='space'></div></div></section>");
    });
}

function displayErrorMessage(xhr) {
    $("loader", "newsSourceItem", "newsArticleItem").hide();
    $(".container").append("<h2>Error: " + xhr.statusText + "</h2>").css("text-align", "center");
}

/* HTML ELEMENT UTILITIES*/

function hideLoader() {
    $("body").removeClass("loader");
}

function hideHtmlElements() {
    $(".searchForNewsSource, footer").hide();
}

function loadingCards() {
    $(".newsSourceItem, .newsArticleItem, .searchForNewsSource, .resetNewsSource, footer").hide();
    $("body").addClass("loader");
}

function addElements() {
    $(".searchForNewsSource, footer").add();
}

function resetNewsSource() {
    localStorage.removeItem("newsSource");
    ajaxGetRequest(sourcesUrl, generateSourceSelectionCards);
}