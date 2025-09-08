$(document).ready(function() {
    function loadAndScroll(url) {
        $("#main").load(url, function() {
            $("#main").scrollTop(0);
        });
    }
    $("#paint").on("click", function() { 
        loadAndScroll("paint/index.html");
    });
    $("#2020").on("click", function() { 
        loadAndScroll("paint/2020.html");
    });
    $("#2021").on("click", function() { 
        loadAndScroll("paint/2021.html");
    });
    $("#2022").on("click", function() { 
        loadAndScroll("paint/2022.html");
    });
    $("#2023").on("click", function() { 
        loadAndScroll("paint/2023.html");
    });
    $("#2024").on("click", function() { 
        loadAndScroll("paint/2024.html");
    });
    $("#2025").on("click", function() { 
        loadAndScroll("paint/2025.html");
    });
});