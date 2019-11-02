$.each($(".split_carousel_img"),function(index, element){
    let current     = 0;
    let buttons     = $(this).find(".split_button");
    let text_items  = $(this).find(".text-item");
   
    $(buttons).on("click", function(){
        console.log($(this).attr("target-index"))

        // $(text_items[current]).addClass("not-active");
        // current = $(this).attr("target-index");
        // $(text_items[current]).removeClass("not-active");
    })
});