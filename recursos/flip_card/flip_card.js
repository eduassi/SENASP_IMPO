$(".flip-card").on("click",function(){
    if($(this).hasClass("rotate")){
        $(this).removeClass("rotate");
    }else{
        $(this).addClass("rotate");
    }
});