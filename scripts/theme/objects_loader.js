// LIBRARY CLASSES
class APS {
    constructor() {
        this.aps_elements = {};
    }

    get_aps(identifier) {
        return this.aps_elements[identifier];
    }


    include_aps(identifier, aps_element) {
        this.aps_elements[identifier] = aps_element;
    }

    remove_aps(identifier) {
        this.aps_elements[identifier].finish();
        delete this.aps_elements[identifier];
    }
}

class APS_Element {
    constructor(identifier) {
        this.html_element = $(identifier);
        this.frames = $(this.html_element).find(".frame");
        this.flags = {};

        this.setup_flags();
        if (this.flags["autoplay"]) {
            this.play();
        }
    }

    setup_flags() {
        let anim_style = $(this.html_element).attr("animation-style");
        let configs = $(this.html_element).attr("animation-configuration").split(" ");
        for (var i in configs) {
            let flag = configs[i];
            this.flags[flag] = true;
        }

        if (this.flags["looping"]) {
            let looping_counter = Math.abs(Number($(this.html_element).attr("looping-counter")));
            this.flags["looping-counter"] = looping_counter ? looping_counter : -1; //N-Looping XOR Infinit looping
        } else {
            this.flags["looping-counter"] = 1; //One time play
        }

        this.flags["animation-style"] = (anim_style ? anim_style : "");
    }

    finish() {
        console.log("Maybe I should do something with this...");
    }

    play() {
        let self = this;
        return new Promise(async function (resolve, reject) {
            switch (self.flags["animation-style"]) {
                case "moveline":
                    resolve();
                default:
                    await self.regular_animation();
                    resolve();
            }
        });
    }
    async regular_animation() {
        let self = this;
        let counter = 0;
        let actual_frame;
        let next_frame;
        let next_frame_duration;

        while (self.flags["looping-counter"] == -1 || counter < self.flags["looping-counter"]) {
            for (var next_frame_number = 0; next_frame_number < self.frames.length; next_frame_number++) {
                next_frame = self.frames[next_frame_number];
                next_frame_duration = Number($(next_frame).attr("frame-duration"));
                try { $(actual_frame).hide() } catch (e) { };
                $(next_frame).show();
                await sleep(next_frame_duration);
                actual_frame = next_frame;
            }

            if (self.flags["palinmation"]) {
                for (var next_frame_number = self.frames.length - 2; next_frame_number >= 0; next_frame_number--) {
                    next_frame = self.frames[next_frame_number];
                    next_frame_duration = Number($(next_frame).attr("frame-duration"));
                    try { $(actual_frame).hide() } catch (e) { };
                    $(next_frame).show();
                    await sleep(next_frame_duration);
                    actual_frame = next_frame;
                }
            }
            counter++;
        }
    }

}

// GLOBAL FUNCTIONS
var sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var set_same_height_collection = function (collection) {
    let new_height = 0;
    $.each($(collection), function (index, object) {
        let temp_height = $(object).outerHeight();
        new_height = temp_height > new_height ? temp_height : new_height;
    });
    $.each($(collection), function (index, object) {
        $(object).height(new_height);
    });
}

var set_static_size = function (text_items, text_box) {
    let min_height = 0;
    for (let i = 0; i < text_items.length - 1; i++) {
        let item_h = $(text_items[i]).outerHeight();
        if (min_height < item_h) {
            min_height = item_h;
        }
    }
    text_box.css("min-height", min_height)
}

var change_scroll_position_by_top_object = function (element, offset_top, margin_top) {
    let y_scroll_position = $(element).offset().top - offset_top - margin_top;
    window.scrollTo(0, y_scroll_position);
}


var refresh_objects_listeners = function () {

    //SETUP
    var aps = new APS();

    //ALMOST PIXAR STUDIO - ANIMATOR
    $.each($(".aps-animator"), function (index, element) {
        let identifier = $(element).attr("id");
        var element = new APS_Element("#" + identifier);
        aps.include_aps(identifier, element);
    });

    //ACCORDION LOADER
    $.each($(".accordion"), function (index, element) {
        let margin_top = $($(".card-header")[0]).height();
        let offset_top = $(".navbar").height();
        let tabs = $(this).find(".card");
        let thread_var;
        let current_tab;
        $(".card").on('show.bs.collapse', function () {
            current_tab = this;
            try { clearInterval(thread_var); } catch (e) { };
            thread_var = setInterval(() => {
                change_scroll_position_by_top_object(current_tab, offset_top, margin_top);
            }, 1);
        }).on('shown.bs.collapse', function () {
            clearInterval(thread_var);
            change_scroll_position_by_top_object(current_tab, offset_top, margin_top);
        });
    });


    //VENTANITA LOADER
    $.each($(".ventanita"), function (index, element) {
        let text_box = $(this).find("#ventanita-objects");
        let text_items = $(text_box).children();
        let active_button = null;
        let active_text_box = $(text_box).find("#ventanita-placeholder");
        let button_collection = $(this).find(".ventanita-show");

        set_same_height_collection(text_items);
        $.each(button_collection, function (default_index, button) {
            let target_id = "#" + button.getAttribute("data-turnon");
            let default_id = text_items[default_index + 1];
            let target_screen_object = target_id != "#null" ? $(text_box).find(target_id) : $(default_id);
            $(button).on("click", function () {
                $(active_button).removeClass("active");
                $(active_text_box).removeClass("active");

                $(this).addClass("active");
                target_screen_object.addClass("active");

                active_button = $(this);
                active_text_box = $(target_screen_object);
            });
        });
    });

    //VENTANITA PIN MARKER LOADER
    $.each($(".ventanitas_pin_marker"), function (index, element) {
        let text_box = $(this).find("#ventanita-objects");
        let text_items = $(text_box).children();
        let active_button = null;
        let active_text_box = $(text_box).find("#ventanita-placeholder");
        let button_collection = $(this).find(".ventanita-show");

        let pin_marker = $(this).find(".pin-marker");
        let pin_half_width = $(pin_marker).width() / 4;
        let pin_half_height = $(pin_marker).height() / 4;
        $(pin_marker).css('top', 0);
        $(pin_marker).css('left', 0);
        set_same_height_collection($(this).find(".ventana"));
        $.each(button_collection, function (default_index, button) {
            let target_id = "#" + button.getAttribute("data-turnon");
            let default_id = text_items[default_index + 1];
            let target_screen_object = target_id != "#null" ? $(text_box).find(target_id) : $(default_id);
            $(button).on("click", function () {
                $(pin_marker).show();
                let this_position = $(this).position();
                let pin_left = (this_position["left"] - pin_half_width);
                let pin_top = (this_position["top"] - pin_half_height);
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


    //CIRCLE SLIDER
    $.each($(".circle_slider"), function (index, element) {
        let i = 2;
        var radius = 200;
        var fields = $($(element).find('.itemDot'));
        var container = $($(element).find('.dotCircle'));
        var width = container.width();
        radius = width / 2;

        var height = container.height();
        var angle = 0, step = (2 * Math.PI) / fields.length;
        fields.each(function () {
            var x = Math.round(width / 2 + radius * Math.cos(angle) - $(this).width() / 2);
            var y = Math.round(height / 2 + radius * Math.sin(angle) - $(this).height() / 2);
            $(this).css({
                left: x + 'px',
                top: y + 'px'
            });
            angle += step;
        });


        $($(element).find('.itemDot')).click(function () {
            var dataTab = $(this).data("tab");
            fields.removeClass('active');
            $(this).addClass('active');

            $($(element).find(('.CirItem'))).removeClass('active');
            $($(element).find(('.CirItem' + dataTab))).addClass('active');
            i = dataTab;
            container.css({
                "transform": "rotate(" + (360 - (i - 1) * 36) + "deg)",
                "transition": "2s"
            });
            fields.css({
                "transform": "rotate(" + ((i - 1) * 36) + "deg)",
                "transition": "1s"
            });
        });
    })




	//Image comparison

 
  
  function drags(dragElement, resizeElement, container) {
      
    // Initialize the dragging event on mousedown.
    dragElement.on('mousedown touchstart', function(e) {
      
      dragElement.addClass('draggable');
      resizeElement.addClass('resizable');
      
      // Check if it's a mouse or touch event and pass along the correct value
      var startX = (e.pageX) ? e.pageX : e.originalEvent.touches[0].pageX;
      
      // Get the initial position
      var dragWidth = dragElement.outerWidth(),
          posX = dragElement.offset().left + dragWidth - startX,
          containerOffset = container.offset().left,
          containerWidth = container.outerWidth();
   
      // Set limits
      minLeft = containerOffset + 10;
      maxLeft = containerOffset + containerWidth - dragWidth - 10;
      
      // Calculate the dragging distance on mousemove.
      dragElement.parents().on("mousemove touchmove", function(e) {
          
        // Check if it's a mouse or touch event and pass along the correct value
        var moveX = (e.pageX) ? e.pageX : e.originalEvent.touches[0].pageX;
        
        leftValue = moveX + posX - dragWidth;
        
        // Prevent going off limits
        if ( leftValue < minLeft) {
          leftValue = minLeft;
        } else if (leftValue > maxLeft) {
          leftValue = maxLeft;
        }
        
        // Translate the handle's left value to masked divs width.
        widthValue = (leftValue + dragWidth/2 - containerOffset)*100/containerWidth+'%';
              
        // Set the new values for the slider and the handle. 
        // Bind mouseup events to stop dragging.
        $('.draggable').css('left', widthValue).on('mouseup touchend touchcancel', function () {
          $(this).removeClass('draggable');
          resizeElement.removeClass('resizable');
        });
        $('.resizable').css('width', widthValue);
      }).on('mouseup touchend touchcancel', function(){
        dragElement.removeClass('draggable');
        resizeElement.removeClass('resizable');
      });
      e.preventDefault();
    }).on('mouseup touchend touchcancel', function(e){
      dragElement.removeClass('draggable');
      resizeElement.removeClass('resizable');
    });
  }


  // Call & init

  $('.ba-slider').each(function(){
    var cur = $(this);
    // Adjust the slider
    var width = cur.width()+'px';
    cur.find('.resize img').css('width', width);
    // Bind dragging events
    drags(cur.find('.handle'), cur.find('.resize'), cur);
  });


// Update sliders on resize. 
// Because we all do this: i.imgur.com/YkbaV.gif

  $('.ba-slider').each(function(){
    var cur = $(this);
    var width = cur.width()+'px';
    cur.find('.resize img').css('width', width);
  });
    // ./comparison

















    //PROGRESS BAR
    function refresh_bar(text_items, bar, current, quantum, i) {
        let bar_val;
        $(text_items[current]).addClass("not-active");
        current = current + i;

        $(text_items[current]).removeClass("not-active");
        bar_val = current == text_items.length - 1 ? 100 : Math.round(quantum + quantum * current);

        bar.attr("aria-valuenow", bar_val);
        bar.css("width", (bar_val + "%"));
        // bar.text((bar_val + "%"));

        return current;
    }



    $.each($(".progress-bar-container"), function (index, element) {
        let current = 0;
        let next_bt = $(this).find(".progress-next");
        let prev_bt = $(this).find(".progress-prev");
        let bar = $(this).find(".progress-bar");
        let text_box = $(this).find(".text-area");
        let text_items = $(this).find(".text-item");
        let max_len = text_items.length;
        let quantum = (100 / text_items.length);
        set_same_height_collection(text_items);
        refresh_bar(text_items, bar, current, quantum, 0);



        next_bt.on("click", function () {
            if (current < max_len - 1) {
                current = refresh_bar(text_items, bar, current, quantum, 1);
            }
        });

        prev_bt.on("click", function () {
            if (current > 0) {
                current = refresh_bar(text_items, bar, current, quantum, -1);
            }
        });
    });

    // SPLIT CAROUSEL
    $.each($(".split_carousel"), function (index, element) {
        let active_button;
        let current = 0;
        let buttons = $(this).find(".split_button");
        let text_items = $(this).find(".text-item");

        set_same_height_collection(text_items);

        for (let i = 0; i < buttons.length; i++) {
            $(buttons[i]).on("click", function () {
                try { active_button.removeClass("active") } catch (e) { }
                active_button = $(this);
                $(this).addClass("active");
                $(text_items[current]).addClass("not-active");
                current = $(this).attr("target-index");
                $(text_items[current]).removeClass("not-active");
            })
        }
    });

    // SPLIT CAROUSEL PIN MARKER
    $.each($(".split_carousel_pin_marker"), function (index, element) {
        let active_button;
        let current = 0;
        let buttons = $(this).find(".split_button");
        let text_items = $(this).find(".text-item");

        let pin_marker = $(this).find(".pin-marker");
        let pin_width = $(pin_marker).width();
        let pin_height = $(pin_marker).height();
        $(pin_marker).css('top', 0);
        $(pin_marker).css('left', 0);

        set_same_height_collection($(this).find(".text-item"));

        $.each(buttons, function (index_bt, button) {
            $(button).on("click", function () {
                $(pin_marker).show();
                let container_cordinates = $(this).parent().position();
                let var_TW = $(this).parent().outerWidth();
                let var_ML = parseInt($(this).parent().css('marginLeft'), 10);
                let var_PL = parseInt($(this).css('paddingLeft'), 10) / 2;
                let var_HB = $(this).innerWidth() / 2;

                let pin_left = (container_cordinates["left"] + var_ML + var_PL) + var_HB;
                let pin_top = container_cordinates["top"] - pin_height / 2;
                $(pin_marker).css('top', pin_top);
                $(pin_marker).css('left', pin_left);

                try { active_button.removeClass("active") } catch (e) { }
                active_button = $(this);
                $(this).addClass("active");
                $(text_items[current]).addClass("not-active");
                current = $(this).attr("target-index");
                $(text_items[current]).removeClass("not-active");
            })
        });
    });

    // JESUS SLIDER
    $.each($(".jesus_slider"), function (index, element) {
        let current = 0;
        let back_buttons = $(this).find(".back_arrow");
        let forward_buttons = $(this).find(".forward_arrow");
        let ball_items = $(this).find(".jesus-set");
        let text_items = $(this).find(".text-item");
        let jesus_head = $(this).find(".jesus-head");
        let item_width = $(this).find(".jesus-set").width();

        set_same_height_collection(text_items);

        forward_buttons.on("click", function () {
            if (current < ball_items.length) {
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
        back_buttons.on("click", function () {
            if (current > 0) {
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

    // JESUS SLIDER BALL
    $.each($(".jesus_slider_ball"), function (index, element) {
        let current = 0;
        let buttons = $(this).find(".slide_ball");
        let ball_items = $(this).find(".jesus-set");
        let text_items = $(this).find(".text-item");
        let jesus_head = $(this).find(".jesus-head");
        let item_width = $(this).find(".jesus-set").width();

        set_same_height_collection(text_items);

        buttons.each(function (index) {
            let this_button = $(buttons[index]);
            this_button.on("click", function () {
                let difference = current - index;
                let margin_offset = parseInt(jesus_head.css("margin-left")) + (item_width * difference) + (32 * difference);
                margin_offset += "px";
                jesus_head.animate({
                    marginLeft: margin_offset
                });
                $(ball_items[current]).removeClass("active");
                $(text_items[current]).removeClass("active");
                current = index;
                $(ball_items[current]).addClass("active");
                $(text_items[current]).addClass("active");

            });
        });
    });

    // JESUS SLIDER NO ARROW
    $.each($(".jesus_slider_no_arrow"), function (index, element) {
        let current = 0;
        let buttons = $(this).find(".slide_ball");
        let ball_items = $(this).find(".jesus-set");
        let text_items = $(this).find(".text-item");
        let jesus_head = $(this).find(".jesus-head");
        let item_width = $(this).find(".jesus-set").width();

        set_same_height_collection(text_items);

        buttons.each(function (index) {
            let this_button = $(buttons[index]);
            this_button.on("click", function () {
                let difference = current - index;
                let margin_offset = parseInt(jesus_head.css("margin-left")) + (item_width * difference) + (32 * difference);
                margin_offset += "px";
                jesus_head.animate({
                    marginLeft: margin_offset
                });
                $(ball_items[current]).removeClass("active");
                $(text_items[current]).removeClass("active");
                current = index;
                $(ball_items[current]).addClass("active");
                $(text_items[current]).addClass("active");

            });
        });
    });

    // JESUS SLIDER NO ARROW IMAGE BACKGROUND
    $.each($(".jesus_slider_no_arrow_image_background"), function (index, element) {
        let current = 0;
        let buttons = $(this).find(".slide_ball");
        let ball_items = $(this).find(".jesus-set");
        let text_items = $(this).find(".text-item");
        let jesus_head = $(this).find(".jesus-head");
        let item_width = $(this).find(".jesus-set").width();

        set_same_height_collection(text_items);

        buttons.each(function (index) {
            let this_button = $(buttons[index]);
            this_button.on("click", function () {
                let difference = current - index;
                let margin_offset = parseInt(jesus_head.css("margin-left")) + (item_width * difference) + (32 * difference);
                margin_offset += "px";
                jesus_head.animate({
                    marginLeft: margin_offset
                });
                $(ball_items[current]).removeClass("active");
                $(text_items[current]).removeClass("active");
                current = index;
                $(ball_items[current]).addClass("active");
                $(text_items[current]).addClass("active");

            });
        });
    });

    // SPLIT CAROUSEL IMG
    $.each($(".split_carousel_img"), function (index, element) {
        let current = 0;
        let buttons = $(this).find(".split_button");
        let text_items = $(this).find(".text-item");
        set_same_height_collection(text_items);
        $(buttons).on("click", function () {
            $(text_items[current]).addClass("not-active");
            current = $(this).attr("target-index");
            $(text_items[current]).removeClass("not-active");
        });
    });

    // CAROUSEL
    $.each($(".carousel"), function (index, element) {
        let text_items = $(this).find(".carousel-item");
        set_same_height_collection(text_items);
    });

    // FLIPSTER FLAT SLIDER
    $.each($(".flipster_slider"), function (index, element) {
        let current = 0;
        let flipster_items = $(this).find(".flipster-set");
        let flipster_head = $(this).find(".flipster-head");
        let item_width = $($(this).find(".flipster-set")[0]).width();
        flipster_items.on("click", function () {
            let order = $(this).attr("order");
            let jump_offset = order - current;
            let margin_offset;
            if (order != 0) {
                margin_offset = -item_width * order + 20 * (order) + 20 * (order - 1);
            } else {
                margin_offset = 0;
            }
            $(flipster_items[current]).removeClass("active");
            current = order;
            $(flipster_items[current]).addClass("active");
            margin_offset += "px";
            flipster_head.animate({
                marginLeft: margin_offset
            });
        });
    });

    // FLIPSTER CAROUSEL SLIDER
    $.each($(".flipster_carousel_slider"), function (index, element) {
        let current = 0;
        let current_fog = $(this).find(".flipster_carousel-head").find(".fog");
        let flipster_items = $(this).find(".flipster_carousel-set");
        let flipster_len = flipster_items.length;
        let flipster_head = $(this).find(".flipster_carousel-head");
        let item_width = $($(this).find(".flipster_carousel-set")[0]).width();
        let margin_rate = item_width - item_width * 0.7;

        $.each(flipster_items, function (index) {
            let new_z = flipster_len - index;
            $(this).css("zIndex", new_z);
        });

        flipster_items.on("click", function (event) {
            let order = $(this).attr("order");
            if (current != order) {
                current_fog.show();
                current_fog = $(this).find(".fog");
                current_fog.hide();
                let this_obj = $(flipster_items[current]);
                let next_obj = $(flipster_items[order]);
                let jump_offset = order - current;
                let margin_offset = parseInt(flipster_head.css("margin-left")) - (margin_rate) * jump_offset;
                let right_iterator = Number(order);
                let left_iterator = Number(order);
                current = order;

                while (right_iterator < flipster_len) {
                    let itr_obj = $(flipster_items[right_iterator]);
                    let new_z = flipster_len - right_iterator;
                    itr_obj.css("zIndex", new_z);
                    itr_obj.removeClass("flip-right");
                    itr_obj.addClass("flip-left");
                    right_iterator++;
                }

                while (left_iterator >= 0) {
                    let itr_obj = $(flipster_items[left_iterator]);
                    let new_z = left_iterator;
                    itr_obj.css("zIndex", new_z);
                    itr_obj.removeClass("flip-left");
                    itr_obj.addClass("flip-right");
                    left_iterator--;
                }

                next_obj.removeClass("flip-left");
                next_obj.removeClass("flip-right");
                next_obj.css("zIndex", flipster_len);
                margin_offset += "px";
                flipster_head.animate({
                    marginLeft: margin_offset
                });
            }
        });
    });

    // FLIP CARD
    $(".flip-card").on("click", function () {
        if ($(this).hasClass("rotate")) {
            $(this).removeClass("rotate");
        } else {
            $(this).addClass("rotate");
        }
    });

    // SPLIT LIST
    $.each($(".split-list"), function () {
        let button_set = $(this).find(".btn-ret").children();
        let text_set = $(this).find(".sl-txt");
        let current_active_button = $(button_set[0]);
        let current_active_text = $(text_set[0]);

        // INITIALIZATION
        // current_active.addClass("active");
        $.each(button_set, function (index) {
            $(this).on("click", function () {
                current_active_button.removeClass("active");
                current_active_text.hide();
                current_active_button = $(this);
                current_active_text = $(text_set[index]);
                current_active_button.addClass("active");
                current_active_text.show();
            });
        });
    });


    // MATCHUP
    $.each($(".matchup"), function (index, element) {
        let open_cards = [];
        let freeze_time = false;

        let switch_settings = (window.innerWidth > 480) ? "settings" : "mobile_settings";
        let matchup_cont = $(this).find(".matchup_container");
        let raw_cards = $(this).find("#cards");
        let raw_json = JSON.parse(raw_cards[0].innerHTML);
        let rows = raw_json[switch_settings]["rows"];
        let columns = raw_json[switch_settings]["columns"];
        let offset = raw_json[switch_settings]["offset"];
        let cards = [];
        let id = 0;
        let card_index = 0;
        let max_height = window.innerHeight;
        let max_width = matchup_cont.width();
        let card_height = (max_height / rows) - (offset / rows);
        let card_width = (max_width / columns);

        let responsive_size = (card_height < card_width) ? card_height : card_width;

        let dimensions_string = 'style="height:' + responsive_size + 'px; width:' + responsive_size + 'px"';
        let card_image_template =
            '<div class="matchup-card" ' + dimensions_string + '>\
                <div class="flip-card-container">\
                    <div class="flip-card matchup-card-active" position="unset">\
                        <div class="flip-card-inner" '+ dimensions_string + '>\
                            <div class="matchup-card-front flip-card-front" >\
                                <img class="logo-fundo" src="assets/images/identity/logos/marca.png">\
                            </div>\
                            <div class="matchup-card-back flip-card-back" '+ dimensions_string + '>\
                                <img class="matchup-card-content" src="" draggable="false">\
                                <div class="frame">\
                                    <div class="molding">\
                                        <i class="fas fa-check fa-2x crush-check"></i>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </div>'

        $(raw_cards).remove();

        $.each(raw_json["cards"], function (index, element) {
            element[0]["id"] = id;
            cards.push(element[0]);
            if (element[1]) {
                element[1]["id"] = id;
                cards.push(element[1]);
            } else {
                cards.push(element[0]);
            }
            id++;
        });
        cards = _.shuffle(cards);
        for (var r = 0; r < rows; r++) {
            let new_row = $.parseHTML('<div class="row d-flex justify-content-center"></div>')[0];
            matchup_cont.append(new_row);
            for (var c = 0; c < columns; c++) {
                let new_card = $.parseHTML(card_image_template)[0];
                $(new_card).find(".matchup-card-content").attr("src", cards[card_index]["card"]);
                $(new_card).find(".flip-card").attr("position", card_index);
                new_row.append(new_card);
                card_index++;
            }
        }

        $(this).find(".matchup-card-active").on("click", function (e) {
            if (!freeze_time) {
                if (!$(this).hasClass("rotate")) {
                    $(this).addClass("rotate");
                    if (open_cards.length >= 1) {
                        open_cards.push($(this));
                        freeze_time = true;

                        let index_first_card = open_cards[0].attr("position");
                        let index_last_card = open_cards[1].attr("position");
                        let isCrush = (cards[index_first_card]["id"] == cards[index_last_card]["id"]);

                        if (!isCrush) {
                            setTimeout(function () {
                                open_cards[0].removeClass("rotate");
                                open_cards[1].removeClass("rotate");
                                open_cards = [];
                                setTimeout(function () {
                                    freeze_time = false;
                                }, 200);
                            }, 1000);
                        } else {
                            let temporary_cards = open_cards;
                            open_cards = [];
                            setTimeout(function () {
                                freeze_time = false;
                            }, 200);
                            setTimeout(function () {
                                temporary_cards[0].removeClass("matchup-card-active");
                                temporary_cards[1].removeClass("matchup-card-active");
                            }, 600)
                        }
                    } else {
                        open_cards.push($(this));
                    }
                }
            }
        });

    });


    // PUZZLE

    function fitin_piece(actualtarget, droptarget, result) {
        let position_target = $(droptarget).position();
        $(actualtarget).css({ top: position_target.top, left: position_target.left });
        $(actualtarget).attr("actual-cell", droptarget.id);
        $(actualtarget).css('zIndex', 1);
        return (result[droptarget.id]["correct"] == $(actualtarget)[0]);
    }

    function reset_piece(actualtarget) {
        $(actualtarget).css({ top: 10, left: 10 });
        $(actualtarget).attr("actual-cell", "");
    }

    $.each($(".puzzle"), function (index, element) {
        let switch_settings = (window.innerWidth > 480) ? "settings" : "mobile_settings";
        let puzzle_cont = $(this).find(".puzzle_container");
        let raw_puzzle = $(this).find("#puzzle_json");
        let puzzle_json = JSON.parse(raw_puzzle[0].innerHTML);
        let puzzle_image = puzzle_json["img"];
        let rows = puzzle_json[switch_settings]["rows"];
        let columns = puzzle_json[switch_settings]["columns"];
        let factor = puzzle_json[switch_settings]["factor_view"];
        let offset = puzzle_json[switch_settings]["offset"];
        let pieces = [];
        let id = 0;
        let piece_index = 0;
        let max_height = window.innerHeight;
        let max_width = puzzle_cont.outerWidth();
        let piece_height = (max_height / rows);
        let piece_width = (max_width / columns);
        let responsive_size = (piece_height < piece_width) ? piece_height : piece_width;
        let responsive_max = (piece_height < piece_width) ? max_height : max_width;

        let result = {};
        let pre_drag_cell = "";
        let false_counter = 0;

        let dimensions_string = 'height:' + responsive_size * factor + 'px; width:' + responsive_size * factor + 'px;';
        let background_string = 'background-image: url(' + puzzle_image + '); background-size: ' + responsive_max * factor + 'px ' + responsive_max * factor + 'px';

        let piece_template = '<div class="puzzle-piece puzzle-dropping" style="' + dimensions_string + background_string + '"></div>'
        let puzzle_cell_template = '<div class="puzzle-cell puzzle-dropping" style="' + dimensions_string + '"></div>'

        $(puzzle_cont).height(piece_height * rows);
        $(puzzle_cont).css("padding-top", piece_height * factor);
        $(raw_puzzle).remove();
        for (var y = 0; y < responsive_max; y += responsive_size) {
            let new_row = $.parseHTML('<div class="row d-flex justify-content-center"></div>')[0];
            puzzle_cont.append(new_row);
            for (var x = 0; x < responsive_max; x += responsive_size) {
                let new_piece = $.parseHTML(piece_template)[0];
                let new_cell = $.parseHTML(puzzle_cell_template)[0];
                let position_bg = -x * factor + 'px ' + -y * factor + 'px';
                let id_sufix = (y / responsive_size) + "-" + (x / responsive_size);
                let cell_id = "cell-" + id_sufix;
                pieces.push(new_piece);

                $(new_cell).attr("id", cell_id);
                new_row.append(new_cell);
                result[cell_id] = { "correct": new_piece, "status": false };

                $(new_piece).css('background-position', position_bg);
                $(new_piece).draggable({

                    start_handler: function (vector) {
                        pre_drag_cell = $(vector).attr("actual-cell");
                        $(vector).css('zIndex', 2);
                        try {
                            false_counter += result[pre_drag_cell]["status"];
                            result[pre_drag_cell]["status"] = false
                        } catch (e) { };
                    },

                    droptarget: '.puzzle-dropping',
                    drop: function (evt, droptarget) {
                        let hand_piece_result = false;
                        let swapped_piece_result = false;
                        let former_boolean = false;

                        if ($(droptarget).hasClass("puzzle-cell")) {
                            // Fit In
                            hand_piece_result = fitin_piece(this, droptarget, result);
                            result[droptarget.id]["status"] = hand_piece_result;
                        } else {
                            let id_cell_target_piece = $(droptarget).attr("actual-cell");
                            if (pre_drag_cell && id_cell_target_piece) {
                                // SWAP
                                hand_piece_result = fitin_piece(this, $("#" + id_cell_target_piece)[0], result);
                                swapped_piece_result = fitin_piece(droptarget, $("#" + pre_drag_cell)[0], result);
                                former_boolean = result[id_cell_target_piece]["status"];
                                result[id_cell_target_piece]["status"] = hand_piece_result;
                                result[pre_drag_cell]["status"] = swapped_piece_result;

                            } else if (!pre_drag_cell && id_cell_target_piece) {
                                // REPLACE
                                hand_piece_result = fitin_piece(this, $("#" + id_cell_target_piece)[0], result);
                                former_boolean = result[id_cell_target_piece]["status"];
                                result[id_cell_target_piece]["status"] = hand_piece_result;
                                reset_piece(droptarget);
                            }
                        }

                        false_counter += former_boolean - (hand_piece_result + swapped_piece_result);
                        if (false_counter == 0) {
                            for (var i in pieces) {
                                let i_piece = $(pieces[i]);
                                let i_cell = $("#" + i_piece.attr("actual-cell"));
                                i_piece.draggable('destroy');
                                i_piece.appendTo(i_cell);
                                i_cell.addClass("complete");
                                i_piece.addClass("complete");
                            }
                        }
                    }

                });

                false_counter++;
            }
        }
        pieces = _.shuffle(pieces);
        for (var index = 0; index < pieces.length; index++) {
            let index_row = Math.floor(index / rows);
            let index_col = index % columns;
            let random_top_seed = Math.random();
            let random_left_seed = Math.random();
            let random_top_offset = (random_top_seed < 0.5 ? -random_top_seed : random_top_seed) * 10;
            let random_left_offset = (random_left_seed < 0.5 ? -random_left_seed : random_left_seed) * 10;

            random_top_seed = (index_row * (piece_height / 10)) + random_top_offset;
            random_left_seed = (index_col * (piece_width / 10)) + random_left_offset;

            puzzle_cont.append(pieces[index]);
            $(pieces[index]).css({ top: random_top_seed, left: random_left_seed });
        };
    });

    //QUIZ
    $.each($(".quiz"), function (index, element) {
        let start_menu_screen = $(this).find(".start-menu-screen");
        let game_screen = $(this).find(".game-screen");
        let gender_choice = $(".moldura");
        let avatar = $(".avatar");

        let width_screen = $(game_screen).width();
        let width_avatar;
        let center_left;

        $(gender_choice).on("click", function () {
            let gender = $(this).attr('mob');
            $(avatar).addClass(gender);
            $(start_menu_screen).hide();
            $(game_screen).show();

            width_avatar = $(avatar).width();
            center_left = (width_screen - width_avatar) / 2;
            $(avatar).css({
                left: center_left + 'px'
            });

        })
    });

    // LSS QUIZ

    function pick_another_question(lss_database, current_question, title_container, choices_container) {
        let round_title = lss_database[current_question]["Title"];
        let round_answers = _.shuffle(lss_database[current_question]["Answers"]);
        $(title_container).text(round_title);
        for (var i in round_answers) {
            $(choices_container[i]).text(round_answers[i]["Title"]);
        }
        return round_answers;
    }

    $.each($(".lss_quiz"), function (index, element) {
        let raw_database = $(this).find("#database");
        let database_json = JSON.parse(raw_database[0].innerHTML);
        let lss_settings = database_json["settings"];
        let lss_database = database_json["questions"];
        let game_rules = database_json["gamemode"];

        let score = 0;
        let current_question = 0;
        let max_questions = lss_settings["questions"];
        let quantum_question = 100 / max_questions;
        let margin_top = 15;

        let processing_next_round = false;

        let round_answers;

        let message_suffix = " de " + max_questions;

        let offset_top = $(".navbar").height();
        let game_box = $(this).find("#game_box");
        let question_box = $(this).find(".questionsBox");
        let choices_wrapper = $(this).find("#choices_group");
        let progress_led = $(this).find("#progress_lettering");
        let title_container = $(this).find("#lettering");
        let choices_container = [];

        let julia_waiting = $(this).find("#julia_waiting");
        let julia_responde = $(this).find("#julia_responde");
        let julia_anim_src = $(julia_responde).attr('src');


        let choice_template =
            '<li>\
            <label>\
                <input\
                    type="checkbox"\
                    name="answerGroup"\
                    class="input-box"\
                />\
                <div class="checkbox-radio-custom">\
                    <i class="check-onradio fa fa-check"></i>\
                </div>\
                <span></span>\
            </label>\
        </li>';


        // GUI Initialization
        $(progress_led).text((current_question + 1) + message_suffix);
        $(progress_led).css({ 'width': quantum_question + '%' });
        for (var i = 0; i < lss_settings["answers"]; i++) {
            let new_choice_container = $.parseHTML(choice_template)[0];
            let input_answer = $(new_choice_container).find("input");
            let answer_box = $(new_choice_container).find("span");
            let check_signal = $(input_answer).parent().find(".check-onradio");
            input_answer.attr("value", i);
            input_answer.attr("id", "answerGroup_" + i);
            $(choices_wrapper).append(new_choice_container);
            choices_container.push(answer_box);

            $(input_answer).on("click", function () {
                if (!processing_next_round) {
                    console.log(game_box.offset().top - offset_top - margin_top)
                    console.log(game_box.offset().top)
                    console.log(offset_top)
                    console.log(margin_top)
                    $("html, body").animate({ scrollTop: (game_box.offset().top - offset_top - margin_top) }, 200);
                    $(question_box).hide();
                    $(julia_waiting).hide();
                    $(julia_responde).show();

                    processing_next_round = true;
                    $(check_signal).show();
                    let choice_number = $(this).val();
                    score += round_answers[choice_number]["Score"];
                    current_question++;

                    aps.get_aps("julia_responde").play().then(function () {
                        $(question_box).show();
                        $(julia_waiting).show();
                        $(julia_responde).hide();
                        if (current_question < max_questions) {
                            round_answers = pick_another_question(lss_database, current_question, title_container, choices_container);
                            progress_led.text((current_question + 1) + message_suffix);

                            $(progress_led).css({ 'width': (current_question + 1) * quantum_question + '%' });
                        } else {
                            let feedback_rule = game_rules["feedback_rule"];
                            let feedback = game_rules["feedbacks"];
                            if (feedback_rule == "min-max") {
                                for (var i in feedback) {
                                    let bounds = feedback[i]["bounds"];
                                    if (score >= bounds[0] && score <= bounds[1]) {
                                        $(game_box).hide();
                                        $("#demo_final").show();
                                        $("#" + feedback[i]["target"]).show();
                                        return true;
                                    }
                                }
                            }
                        }

                        $(check_signal).hide();
                        processing_next_round = false;
                    });
                }
            });

        }
        // Game Pre-Setup
        lss_database = _.shuffle(lss_database);
        // inputs = $(this).find("input[name='answerGroup']");
        round_answers = pick_another_question(lss_database, current_question, title_container, choices_container);


        $(raw_database).remove();
    });
}




