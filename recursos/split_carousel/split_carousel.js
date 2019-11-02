$.each($(".split_carousel"),function(index, element){
    let current     = 0;
    let buttons     = $(this).find(".split_button");
    let text_items  = $(this).find(".text-item");
   
    for(let i = 0; i < buttons.length; i++){
        $(buttons[i]).on("click", function(){
            $(text_items[current]).addClass("not-active");
            current = $(this).attr("target-index");
            $(text_items[current]).removeClass("not-active");
        })
    }
});