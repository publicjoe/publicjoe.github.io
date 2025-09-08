$(document).ready(function() {
    $("#paint").on("click", function() { 
        $("#main").load("paint/index.html", function() {
            window.scrollTo(0, 0);
        });
    });
    $("#2020").on("click", function() { 
        $("#main").load("paint/2020.html", function() {
            window.scrollTo(0, 0);
        });
    });
    $("#2021").on("click", function() { 
        $("#main").load("paint/2021.html", function() {
            window.scrollTo(0, 0);
        });
    });
    $("#2022").on("click", function() { 
        $("#main").load("paint/2022.html", function() {
            window.scrollTo(0, 0);
        });
    });
    $("#2023").on("click", function() { 
        $("#main").load("paint/2023.html", function() {
            window.scrollTo(0, 0);
        });
    });
    $("#2024").on("click", function() { 
        $("#main").load("paint/2024.html", function() {
            window.scrollTo(0, 0);
        });
    });
    $("#2025").on("click", function() { 
        $("#main").load("paint/2025.html", function() {
            window.scrollTo(0, 0);
        });
    });
});