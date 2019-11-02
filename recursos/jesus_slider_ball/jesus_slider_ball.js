$.each($(".jesus_slider"),function(index, element){
    let current           = 0;
    let back_buttons      = $(this).find(".back_arrow");
    let forward_buttons   = $(this).find(".forward_arrow");
    let ball_items        = $(this).find(".jesus-set");
    let text_items        = $(this).find(".text-item");
    let jesus_head        = $(this).find(".jesus-head");
    let item_width        = $(this).find(".jesus-set").width();

    forward_buttons.on("click",function(){
        if(current < ball_items.length){
            let margin_offset = parseInt(jesus_head.css("margin-left")) - item_width - 32;
            margin_offset += "px";
            jesus_head.animate({
                marginLeft: margin_offset
            });
            $(ball_items[current]).removeClass("active");
            $(text_items[current]).removeClass("active");
            current++;
            $(ball_items[current]).addClass("active");
            $(text_items[current]).addClass("active");
        }
    });
    back_buttons.on("click",function(){
        if(current > 0){
            let margin_offset = parseInt(jesus_head.css("margin-left")) + item_width + 32;
            margin_offset += "px";
            jesus_head.animate({
                marginLeft: margin_offset
            });
            $(ball_items[current]).removeClass("active");
            $(text_items[current]).removeClass("active");
            current--;
            $(ball_items[current]).addClass("active");
            $(text_items[current]).addClass("active");
        }
    });
});