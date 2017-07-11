var newsSourceSelection = localStorage.getItem("newsSource");
var newsArticleUrl = "https://newsapi.org/v1/articles?source=" + newsSourceSelection + "&apiKey=c1904a9dbf22437eb11e1abcb13c1807";
var sourcesUrl = "https://newsapi.org/v1/sources";
var newsSourceId;
var availableSources = [];


$(document).ready(function() {
    hideHtmlElements();
    checkLocalStorage();
    navigationMenu();
    $("#searchTerm").autocomplete({
        source: availableSources,
        focus: searchTermFocus,
        select: selectedNewsSource
    });
});

function navigationMenu() {
    $('html').click(function() {
        $('.nav-menu').removeClass("active");
    });

    $('.nav-menu ul li').each(function() {
        var delay = $(this).index() * 50 + 'ms';

        $(this).css({
            '-webkit-transition-delay': delay,
            '-moz-transition-delay': delay,
            '-o-transition-delay': delay,
            'transition-delay': delay
        });                  
    });

    $(".drop").click (function(e) {
        e.stopPropagation();
        $('.nav-menu').toggleClass("active");
    });

    $('.nav-menu').click (function(e) {
        e.stopPropagation();
    });
}

function searchTermFocus(event, ui) {
    $("#searchTerm").val(ui.item.label);
}

function selectedNewsSource(event, ui) {
    var searchTerm = ui.item.value;
    $("section").hide().filter(":contains('" + searchTerm + "')").find('section').andSelf().show();
    $(".searchForNewsSource").show();
}

function checkLocalStorage() {
    if (newsSourceSelection) {
        ajaxGetRequest(newsArticleUrl, generateNewsArticleCards);
    } else {
        ajaxGetRequest(sourcesUrl, generateSourceSelectionCards);
    }
}

function setNewsSourceSelection(data) {
    newsSourceId = data.id;
    localStorage.setItem("newsSource", newsSourceId);
    ajaxGetRequest("https://newsapi.org/v1/articles?source=" + newsSourceId + "&apiKey=c1904a9dbf22437eb11e1abcb13c1807", generateNewsArticleCards);
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
        var author = val.author ? val.author : '';
        $(".container").append("<section class='newsArticleItem'><div class='card'><h2>" + author + 
        "</h2><h1>" + val.title + "</h1><hr><h2>" + new Date(val.publishedAt) + "</h2><img src='" + val.urlToImage + "'/>" +
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
        availableSources.push(val.name);
    });
}

function displayErrorMessage(xhr) {
    $("loader", "newsSourceItem", "newsArticleItem").hide();
    $(".container").append("<h2>Error: " + xhr.statusText + "</h2>").css("text-align", "center");
}

/* HTML ELEMENT UTILITIES*/

function hideLoader() {
    $("body").removeClass("loader");
    $("nav").show();
}

function hideHtmlElements() {
    $(".searchForNewsSource, footer").hide();
}

function loadingCards() {
    $(".newsSourceItem, .newsArticleItem, .searchForNewsSource, .resetNewsSource, footer, nav").hide();
    $("body").addClass("loader");
}

function resetNewsSource() {
    localStorage.removeItem("newsSource");
    window.location.reload();
}

function clearNewsSourceSelection() {
    $("section").show();
    $("#searchTerm").val("").focus();
    $(".resetNewsSource").hide();
}