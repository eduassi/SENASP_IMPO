$.each($(".matchup"),function(index, element){
    let open_cards     = [];
    let freeze_time    = false;

    let matchup_cont   = $(this).find(".matchup_container");
    let raw_cards      = $(this).find("#cards");
    let raw_json       = JSON.parse(raw_cards[0].innerHTML);
    let rows           = raw_json["settings"]["rows"];
    let columns        = raw_json["settings"]["columns"];
    let cards          = [];
    let id             = 0;
    let card_index     = 0;
    let max_height     = window.innerHeight;
    let max_width      = matchup_cont.width();
    let card_height    = (max_height/rows) - 50;
    let card_width     = (max_width/columns);
    
    /* Using "card_height" as card width (to make a square card) */
    let dimensions_string   = 'style="height:'+ card_height +'px; width:'+ card_height +'px"';
    let card_image_template = 
    '<div class="matchup-card" '+ dimensions_string +'>\
        <div class="flip-card-container">\
            <div class="flip-card matchup-card-active" position="unset">\
                <div class="flip-card-inner" '+ dimensions_string +'>\
                    <div class="matchup-card-front flip-card-front" >\
                        <img class="logo-fundo" src="assets/images/identity/logos/marca.png">\
                    </div>\
                    <div class="matchup-card-back flip-card-back" '+ dimensions_string +'>\
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

    $.each(raw_json["cards"], function(index, element) {
        element[0]["id"] = id;
        cards.push(element[0]);
        if(element[1]){
            element[1]["id"] = id;
            cards.push(element[1]);
        }else{
            cards.push(element[0]);
        }
        id++;
    });
    cards = _.shuffle(cards);
    for(var r = 0; r < rows; r++){
        let new_row = $.parseHTML('<div class="row d-flex justify-content-center"></div>')[0];
        matchup_cont.append(new_row);
        for(var c = 0; c < columns; c++){
            let new_card = $.parseHTML(card_image_template)[0];
            $(new_card).find(".matchup-card-content").attr("src",cards[card_index]["card"]);
            $(new_card).find(".flip-card").attr("position",card_index);
            new_row.append(new_card)
            card_index++;
        } 
    }
    
    $(this).find(".matchup-card-active").on("click",function(e){
        if(!freeze_time){
            if(!$(this).hasClass("rotate")){
                $(this).addClass("rotate");
                if(open_cards.length >= 1){
                    open_cards.push($(this));
                    freeze_time          = true;

                    let index_first_card = open_cards[0].attr("position");
                    let index_last_card  = open_cards[1].attr("position");
                    let isCrush          = (cards[index_first_card]["id"] == cards[index_last_card]["id"]); 
                    
                    if(!isCrush){
                        setTimeout(function(){
                            open_cards[0].removeClass("rotate");
                            open_cards[1].removeClass("rotate");
                            open_cards   = [];
                            setTimeout(function(){
                                freeze_time  = false;
                            },200);  
                        },1000);  
                    }else{
                        let temporary_cards = open_cards;
                        open_cards   = [];
                        setTimeout(function(){
                            freeze_time  = false;
                        },200);  
                        setTimeout(function(){
                            temporary_cards[0].removeClass("matchup-card-active");
                            temporary_cards[1].removeClass("matchup-card-active");
                        },600)
                    }
                }else{
                    open_cards.push($(this));
                }
            }
        }
    });
});