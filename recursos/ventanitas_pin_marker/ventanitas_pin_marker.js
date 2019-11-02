$.each($(".ventanitas_pin_marker"), function(index, element) {
    let text_box = $(this).find("#ventanita-objects");
    let text_items = $(text_box).children();
    let active_button = null;
    let active_text_box = $(text_box).find("#ventanita-placeholder");
    let button_collection = $(this).find(".ventanita-show");
    
    let pin_marker = $(this).find(".pin-marker");
    let pin_half_width = $(pin_marker).width()/4;
    let pin_half_height = $(pin_marker).height()/4;
    $(pin_marker).css('top', 0);
    $(pin_marker).css('left', 0);
        

    $.each(button_collection, function(default_index, button) {
        let target_id = "#" + button.getAttribute("data-turnon");
        let default_id = text_items[default_index + 1];
        let target_screen_object = target_id != "#null" ? $(text_box).find(target_id) : $(default_id);
        $(button).on("click", function() {
            $(pin_marker).show();
            let this_position = $(this).position();
            let pin_left = (this_position["left"] - pin_half_width);
            let pin_top  = (this_position["top"] - pin_half_height);
            $(pin_marker).css('top', pin_top);
            $(pin_marker).css('left', pin_left);

            $(active_button).removeClass("active");
            $(active_text_box).removeClass("active");

            $(this).addClass("active");
            target_screen_object.addClass("active");

            active_button = $(this);
            active_text_box = $(target_screen_object);
        });
    });
});