var check_all_images_complete = function(callback){
    // We are listening for lazy images, when all images have a real size on DOM, we fire our callback function
    let images_container = $("#content-viewer").find("img");
    let number_images = images_container.length;
    let progress = 0;
    
    $(images_container).one("load", function() {
        progress++;
        if(progress >= number_images){
            setTimeout(function(){
                callback();
                already_loaded = true;
            },1000);
        }
    });   
    
}

var initial_setup = function() {
    // Maybe we want to execute some custom scripts
    $('[data-toggle="popover"]').popover();
};

var libraries_starter = function(){
    // We should start our libraries here
    refresh_objects_listeners();
    AOS.init();
}

var load_page = function(url,callback) {
	$("#content-viewer").load(url, function() {
        initial_setup();
        check_all_images_complete(libraries_starter);
        callback();
        $("html, body").animate({ scrollTop: 0 }, 500);
	});
};