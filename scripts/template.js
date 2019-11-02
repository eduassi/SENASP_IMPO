let reload = function(){
    setTimeout(function(){
        try{
            console.log("Loading Objects..."); 
            refresh_objects_listeners();
            AOS.init();
        }catch(e){
            console.log(e);
            reload();
        }
    },1000);
}

$(document).ready(function(){

    // Popover
    $('[data-toggle="popover"]').popover();

    // modal
    $("#btnModal1").click(function() {$("#modal-1").modal();});
    $("#carouselExampleIndicators").carousel();
    
    
    $("#ventanitas").load("recursos/ventanitas/ventanitas.html"); 
    $("#ventanitas_pin_marker").load("recursos/ventanitas_pin_marker/ventanitas_pin_marker.html"); 
    $("#saibamais").load("recursos/saiba_mais/saiba_mais.html"); 
    $("#tabs").load("recursos/tabs/tabs.html");
    $("#tabs_traffic").load("recursos/tabs_traffic/tabs_traffic.html"); 
    $("#accordion").load("recursos/accordion/accordion.html"); 
    $("#circle_slider").load("recursos/circle_slider/circle_slider.html"); 
    $("#progress_bar").load("recursos/progress_bar/progress_bar.html"); 
    $("#carousel").load("recursos/carousel/carousel.html"); 
    $("#split_carousel").load("recursos/split_carousel/split_carousel.html"); 
    $("#split_carousel_img").load("recursos/split_carousel_img/split_carousel_img.html"); 
    $("#split_carousel_pin_marker").load("recursos/split_carousel_pin_marker/split_carousel_pin_marker.html"); 
    $("#jesus_slider").load("recursos/jesus_slider/jesus_slider.html"); 
    $("#jesus_slider_ball").load("recursos/jesus_slider_ball/jesus_slider_ball.html"); 
    $("#jesus_slider_no_arrow").load("recursos/jesus_slider_no_arrow/jesus_slider_no_arrow.html"); 
    $("#jesus_slider_no_arrow_image_background").load("recursos/jesus_slider_no_arrow_image_background/jesus_slider_no_arrow_image_background.html"); 
    $("#para_pensar").load("recursos/para_pensar/para_pensar.html"); 
    $("#citacao").load("recursos/citacao/citacao.html"); 
    $("#destaque").load("recursos/destaque/destaque.html"); 
    $("#flipcard").load("recursos/flip_card/flip_card.html"); 
    $("#flipster_flat").load("recursos/flipster_flat/flipster_flat.html"); 
    $("#flipster_carousel").load("recursos/flipster_carousel/flipster_carousel.html"); 
    $("#matchup_game").load("recursos/matchup_game/matchup_game.html"); 
    $("#puzzle_game").load("recursos/puzzle/puzzle.html"); 
    $("#html_stuffs").load("recursos/html_stuffs/html_stuffs.html"); 
    $("#quiz").load("recursos/quiz/quiz.html");
    $("#lss_quiz").load("recursos/lss_quiz/lss_quiz.html");
    reload();
});




    



