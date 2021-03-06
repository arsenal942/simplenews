var newsSourceSelection = localStorage.getItem("newsSource");
var newsArticleUrl = "https://newsapi.org/v1/articles?source=" + newsSourceSelection + "&apiKey=" + apiKey;
var sourcesUrl = "https://newsapi.org/v1/sources";
var newsSourceId;
var availableSources = [];
var apiKey = "599158f429844f128e0f192dc09c76a1";


$(document).ready(function() {
    hideHtmlElements();
    checkLocalStorage();
    setupAutocomplete();
});

function setupAutocomplete(){
    $("#searchTerm").autocomplete({
        source: availableSources,
        focus: searchTermFocus,
        select: selectedNewsSource
    });
};

function searchTermFocus(event, ui) {
    $("#searchTerm").val(ui.item.label);
};

function selectedNewsSource(event, ui) {
    var searchTerm = ui.item.value;
    $("section").hide().filter(":contains('" + searchTerm + "')").find('section').andSelf().show();
    $(".searchForNewsSource").show();
};

function checkLocalStorage() {
    if (newsSourceSelection) {
        ajaxGetRequest(newsArticleUrl, generateNewsArticleCards);
    } else {
        ajaxGetRequest(sourcesUrl, generateSourceSelectionCards);
    }
};

function setNewsSourceSelection(data) {
    newsSourceId = data.id;
    localStorage.setItem("newsSource", newsSourceId);
    ajaxGetRequest("https://newsapi.org/v1/articles?source=" + newsSourceId + "&apiKey=" + apiKey, generateNewsArticleCards);
};

function ajaxGetRequest(url, successFunction) {
    loadingCards();
    $.ajax({
        url: url,
        type: "GET",
        success: successFunction,
        error: displayErrorMessage
    });
};

function generateNewsArticleCards(data) {
    hideLoader();    
    $(".newsSourceItem").hide();
    $(".newsArticleItem, .resetNewsSource, footer").show();
    $.each(data.articles, function(key, val) {       
        var author = val.author ? val.author : ''; 
        var articleImage = val.urlToImage ? "<img src='" + val.urlToImage + "'/>" : '';  
        $(".container").append("<section class='newsArticleItem'><div class='card'><h2>" + author + 
        "</h2><h1>" + val.title + "</h1><hr><h2>" + new Date(val.publishedAt) + "</h2>" + articleImage +
        "<p>" + val.description + 
        "</p><a class='btn' target='_blank' href='" + val.url + "'>Read More</a><div class='line'></div></div></section>");
    });
};

function generateSourceSelectionCards(data) {
    hideLoader();
    $(".newsArticleItem, .resetNewsSource").hide();
    $(".searchForNewsSource, footer").show();
    $.each(data.sources, function(key, val) {         
        $(".container").append("<section id='" + val.name + "' class='newsSourceItem'><div class='card'><h2>" + val.category + ", " + val.language + 
        "</h2><h1>" + val.name + "</h1><hr>" +
        "<p>" + val.description + 
        "</p><a href='#' onclick='setNewsSourceSelection(this);' id='" + val.id + "' class='btn''>Subscribe</a><div class='line'></div></div></section>");
        availableSources.push(val.name);
    });
    $(".newsSourceItem").hide();
};

function displayErrorMessage(xhr) {
    $("loader", "newsSourceItem", "newsArticleItem").hide();
    $(".container").append("<h2>Error Page is refreshing... " + xhr.statusText + "</h2>").css("text-align", "center");
    hideLoader();
    clearNewsSourceSelection();    
    setTimeout(window.location.reload(), 3000);
};

/* HTML ELEMENT UTILITIES*/

function hideLoader() {
    $("body").removeClass("loader");
    $("nav").show();
};

function hideHtmlElements() {
    $(".searchForNewsSource, footer").hide();
};

function loadingCards() {
    $(".newsSourceItem, .newsArticleItem, .searchForNewsSource, .resetNewsSource, footer, nav").hide();
    $("body").addClass("loader");
};

function clearNewsSourceSelection() {
    localStorage.removeItem("newsSource");
    $("section").show();
    $("#searchTerm").val("").focus();
    $(".resetNewsSource, .newsSourceItem").hide();
    $(".newsArticleItem").remove();
};