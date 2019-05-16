$(function(){
    $(".ecrw-ready-but").mouseover(function(){
        $(this).addClass("ecrw-ready-but-sel");
        $(".ecrw-ready-search-wrap").show();
    });

    $(document).click(function(e) {
        if($(e.target).closest(".ecrw-ready-search-wrap").length == 0) {
            $(".ecrw-ready-but").removeClass("ecrw-ready-but-sel");
            $(".ecrw-ready-search-wrap").hide();
        }
    });
});