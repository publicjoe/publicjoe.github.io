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
    $("#software").on("click", function() { 
        loadAndScroll("software/software.html");
    });
    $("#AI").on("click", function() { 
        loadAndScroll("software/ai.html");
    });
    $("#AWS").on("click", function() { 
        loadAndScroll("software/aws.html");
    });
    $("#Azure").on("click", function() { 
        loadAndScroll("software/azure.html");
    });
    $("#Csharp").on("click", function() { 
        loadAndScroll("software/csharp.html");
    });
    $("#Docker").on("click", function() { 
        loadAndScroll("software/docker.html");
    });
    $("#Git").on("click", function() { 
        loadAndScroll("software/git.html");
    });
    $("#JavaScript").on("click", function() { 
        loadAndScroll("software/javascript.html");
    });
    $("#Python").on("click", function() { 
        loadAndScroll("software/python.html");
    });
    $("#React").on("click", function() { 
        loadAndScroll("software/react.html");
    });
    $("#SQL").on("click", function() { 
        loadAndScroll("software/sql.html");
    });
    $("#TypeScript").on("click", function() { 
        loadAndScroll("software/typescript.html");
    });
    $("#Unity").on("click", function() { 
        loadAndScroll("software/unity.html");
    });
});