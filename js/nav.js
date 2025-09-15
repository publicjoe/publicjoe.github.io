$(document).ready(function() {
    function loadAndScroll(url) {
        $("#main").load(url, function() {
            $("#main").scrollTop(0);
        });
    }
    $("#paint").on("click", function() { 
        loadAndScroll("paint/paint.html");
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
    $("#aws").on("click", function() { 
        loadAndScroll("software/aws.html");
    });
    $("#azure").on("click", function() { 
        loadAndScroll("software/azure.html");
    });
    $("#csharp").on("click", function() { 
        loadAndScroll("software/csharp.html");
    });
    $("#docker").on("click", function() { 
        loadAndScroll("software/docker.html");
    });
    $("#git").on("click", function() { 
        loadAndScroll("software/git.html");
    });
    $("#javascript").on("click", function() { 
        loadAndScroll("software/javascript.html");
    });
    $("#mysql").on("click", function() { 
        loadAndScroll("software/sql.html");
    });
    $("#python").on("click", function() { 
        loadAndScroll("software/python.html");
    });
    $("#react").on("click", function() { 
        loadAndScroll("software/react.html");
    });
    $("#typescript").on("click", function() { 
        loadAndScroll("software/typescript.html");
    });
    $("#unity").on("click", function() { 
        loadAndScroll("software/unity.html");
    });
    $("#ai").on("click", function() { 
        loadAndScroll("software/ai.html");
    });
});