function refresh_bar(text_items,bar,current,quantum,i){
    let bar_val;
    $(text_items[current]).addClass("not-active");
    current = current + i;

    $(text_items[current]).removeClass("not-active");
    bar_val = current==text_items.length-1 ? 100 : Math.round(quantum + quantum*current); 

    bar.attr("aria-valuenow",bar_val);
    bar.css("width", (bar_val+"%"));
    bar.text((bar_val+"%"));

    return current;
}

function set_static_size(text_items,text_box){
    let min_height = 0;
    for(let i = 0; i < text_items.length-1; i++){
        let item_h = $(text_items[i]).height();
        if(min_height < item_h){
            min_height = item_h;
        }
    }
    text_box.css("min-height",min_height)
}

$.each($(".progress-bar-container"),function(index, element){
    let current     = 0;
    let next_bt     = $(this).find(".progress-next");
    let prev_bt     = $(this).find(".progress-prev");
    let bar         = $(this).find(".progress-bar");
    let text_box    = $(this).find(".text-area");
    let text_items  = $(this).find(".text-item");
    let max_len     = text_items.length;
    let quantum     = (100/text_items.length);
    let bar_val;
    refresh_bar(text_items,bar,current,quantum,0);
    set_static_size(text_items,text_box);

    next_bt.on("click",function(){
        if(current < max_len-1){
            current = refresh_bar(text_items,bar,current,quantum,1);
        }
    });

    prev_bt.on("click",function(){
        if(current > 0){
            current = refresh_bar(text_items,bar,current,quantum,-1);
        }
    });

    
});