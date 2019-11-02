// PUZZLE
function fitin_piece(actualtarget,droptarget,result){
    let position_target = $(droptarget).position();
    $(actualtarget).css({top: position_target.top, left: position_target.left});
    $(actualtarget).attr("actual-cell",droptarget.id);
    $(actualtarget).css('zIndex',1);
    return (result[droptarget.id]["correct"] == $(actualtarget)[0]);
}

function reset_piece(actualtarget){
    $(actualtarget).css({top: 10, left: 10});
    $(actualtarget).attr("actual-cell","");
}

$.each($(".puzzle"), function (index, element) {
    let switch_settings = (window.innerWidth > 480)?"settings":"mobile_settings";
    let puzzle_cont     = $(this).find(".puzzle_container");
    let raw_puzzle      = $(this).find("#puzzle_json");
    let puzzle_json     = JSON.parse(raw_puzzle[0].innerHTML);
    let puzzle_image    = puzzle_json["img"];
    let rows            = puzzle_json[switch_settings]["rows"];
    let columns         = puzzle_json[switch_settings]["columns"];
    let factor          = puzzle_json[switch_settings]["factor_view"];
    let offset          = puzzle_json[switch_settings]["offset"];
    let pieces          = [];
    let id              = 0;
    let piece_index     = 0;
    let max_height      = window.innerHeight;
    let max_width       = puzzle_cont.outerWidth();
    let piece_height    = (max_height / rows);
    let piece_width     = (max_width / columns);
    let responsive_size = (piece_height < piece_width)?piece_height:piece_width;
    let responsive_max  = (piece_height < piece_width)?max_height:max_width;
    
    let result          = {};
    let pre_drag_cell   = "";
    let false_counter   = 0;

    let dimensions_string = 'height:' + responsive_size*factor + 'px; width:' + responsive_size*factor + 'px;';
    let background_string = 'background-image: url('+ puzzle_image +'); background-size: ' + responsive_max*factor + 'px ' + responsive_max*factor +'px';

    let piece_template       = '<div class="puzzle-piece puzzle-dropping" style="' + dimensions_string + background_string + '"></div>'
    let puzzle_cell_template = '<div class="puzzle-cell puzzle-dropping" style="' + dimensions_string + '"></div>'
    
    $(puzzle_cont).height(piece_height*rows);
    $(puzzle_cont).css("padding-top", piece_height*factor);
    $(raw_puzzle).remove();
    for (var y = 0; y < responsive_max; y += responsive_size) {
        let new_row = $.parseHTML('<div class="row d-flex justify-content-center"></div>')[0];
        puzzle_cont.append(new_row);
        for (var x = 0; x < responsive_max; x += responsive_size) {
            let new_piece    = $.parseHTML(piece_template)[0];
            let new_cell     = $.parseHTML(puzzle_cell_template)[0];
            let position_bg  = -x*factor + 'px ' + -y*factor + 'px';
            let id_sufix     = (y/responsive_size) + "-" + (x/responsive_size);
            let cell_id      = "cell-"+ id_sufix;
            pieces.push(new_piece);
            
            $(new_cell).attr("id",cell_id);
            new_row.append(new_cell);
            result[cell_id] = {"correct": new_piece, "status": false};

            $(new_piece).css('background-position', position_bg);
            $(new_piece).draggable({

                start_handler: function(vector){
                    pre_drag_cell = $(vector).attr("actual-cell");
                    $(vector).css('zIndex',2);
                    try{
                        false_counter += result[pre_drag_cell]["status"];
                        result[pre_drag_cell]["status"] = false
                    }catch(e){};
                },

                droptarget: '.puzzle-dropping',
                drop: function(evt, droptarget) {
                    let hand_piece_result = false;
                    let swapped_piece_result = false;
                    let former_boolean = false;

                    if($(droptarget).hasClass("puzzle-cell")){
                        // Fit In
                        hand_piece_result = fitin_piece(this,droptarget,result);
                        result[droptarget.id]["status"] = hand_piece_result;
                    }else{
                        let id_cell_target_piece = $(droptarget).attr("actual-cell");
                        if(pre_drag_cell && id_cell_target_piece){
                            // SWAP
                            hand_piece_result = fitin_piece(this,$("#"+id_cell_target_piece)[0],result);
                            swapped_piece_result = fitin_piece(droptarget,$("#"+pre_drag_cell)[0],result);
                            former_boolean = result[id_cell_target_piece]["status"];
                            result[id_cell_target_piece]["status"] = hand_piece_result;
                            result[pre_drag_cell]["status"]        = swapped_piece_result;  

                        }else if(!pre_drag_cell && id_cell_target_piece){
                            // REPLACE
                            hand_piece_result = fitin_piece(this,$("#"+id_cell_target_piece)[0],result);
                            former_boolean = result[id_cell_target_piece]["status"];
                            result[id_cell_target_piece]["status"] = hand_piece_result;
                            reset_piece(droptarget);
                        }
                    }

                    false_counter += former_boolean - (hand_piece_result + swapped_piece_result);
                    if(false_counter == 0){
                        for(var i in pieces){
                            let i_piece = $(pieces[i]);
                            let i_cell = $("#"+i_piece.attr("actual-cell"));
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
    for(var index = 0; index < pieces.length; index++){
        let index_row  = Math.floor(index/rows);
        let index_col  = index%columns;
        let random_top_seed    = Math.random();
        let random_left_seed   = Math.random();
        let random_top_offset  = (random_top_seed  < 0.5 ? -random_top_seed  : random_top_seed)*10;
        let random_left_offset = (random_left_seed < 0.5 ? -random_left_seed : random_left_seed)*10;
        
        random_top_seed  = (index_row*(piece_height/10)) + random_top_offset;
        random_left_seed = (index_col*(piece_width/10))  + random_left_offset;

        puzzle_cont.append(pieces[index]);
        $(pieces[index]).css({top: random_top_seed, left: random_left_seed});
    };
});