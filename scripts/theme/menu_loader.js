// WARNING: THEME_STARTER MOST BE IMPORTED FIRST

// CONFIGURACOES

var max_level;
var min_level;
var current_level;
var page_name;
var menu_items;
var current_active_item;
var current_active_ball_item;

var set_active_item = function () {
    $(current_active_item).removeClass("active");
    $(current_active_ball_item).removeClass("active");

    current_active_item = menu_items[current_level];
    current_active_ball_item = ball_items[current_level];

    $(current_active_item).addClass("active");
    $(current_active_ball_item).addClass("active");
};

var menu_page_loader = function (next_page) {
    $("#content-viewer").empty();

    load_page(next_page, set_active_item);

    $("#backward_arrow").css("visibility", "visible");
    $("#forward_arrow").css("visibility", "visible");
    $("#content-next-mod-bt").css("visibility", "visible");

    if (current_level == min_level) {
        $("#backward_arrow").css("visibility", "hidden");
    }
    if (current_level == max_level) {
        $("#forward_arrow").css("visibility", "hidden");
        $("#content-next-mod-bt").css("visibility", "hidden");
    }
};

$(document).ready(function () {
    $.getJSON("scripts/user/menu.json", function (json) {
        let information = json["information"];
        let configuration = json["configuration"];
        let target_selector = configuration["target"];
        let ball_holder = $("#ball-item-holder");
        let open_width = configuration["open-width"];
        let pages = json["pages"];
        let menu_item_template =
            '<li>\
            <a \
                class="linker menu-item pmd-ripple-effect pmd-sidebar-toggle"\
                href="javascript:void(0);"\
                data-target="basicSidebar"\
                ">\
            </a>\
        </li>';

        let menu_ball_template =
            '<li class="ball-item"><a class="capitulo-link"></a></li>';

        let cache_module = sessionStorage.getItem("chapter");

        max_level       = configuration["max-level"];
        min_level       = configuration["min-level"];
        page_name       = configuration["prefix-name"];
        current_level   = cache_module? Number(cache_module) : configuration["start-level"];

        // ASSIGN MENU ITEMS ON DOM
        for (let i = min_level; i < pages.length; i++) {
            let new_ball_item = $.parseHTML(menu_ball_template)[0];
            let new_li_item = $.parseHTML(menu_item_template)[0];

            let new_ball_a = $(new_ball_item).find(".capitulo-link");
            let new_li_a = $(new_li_item).find(".linker");


            // $(new_ball_a).text(i + 1);
            $(new_li_a).text(pages[i]["placeholder"]);
            $(ball_holder).append(new_ball_item);
            $(target_selector).append(new_li_item);
        }

        menu_items = $(".linker");
        ball_items = $(".ball-item");
        current_active_item = menu_items[current_level];
        current_active_ball_item = ball_items[current_level];

        // START PROPELLER
        $().pmdSidebar();

        // GIVE LISTENER
        $.each($(".linker"), function (index, element) {
            let this_level = Number(index + min_level); // ADJUST OFFSET
            let new_url = pages[this_level]["url"];
            $(element).on("click", function () {
                current_level = this_level;
                menu_page_loader(new_url);
            });
        });

        $.each($(".ball-item"), function (index, element) {
            let this_level = Number(index + min_level); // ADJUST OFFSET
            let new_url = pages[this_level]["url"];
            $(element).on("click", function () {
                if(this_level != current_level){
                    current_level = this_level;
                    menu_page_loader(new_url);
                }
            });
        });

        $(current_active_item).addClass("active");

        // CARREGAR A PÁGINA
        menu_page_loader((page_name + current_level + ".html"));

        // TÍTULOS DO MÓDULO
        $(".header_titulo_modulo").html(information["modulo-nome"]);
        $(".header_numero_modulo").html(information["modulo-numero"]);
        $(".header_numero_modulo_resumido").html(information["modulo-resumido"]);


        // LINKS DA NAVEGAÇÃO
        $("#backward_arrow").css("visibility", "hidden");
        $("#backward_arrow").on("click", function () {
            current_level = current_level > min_level ? current_level - 1 : 0;
            menu_page_loader((page_name + current_level + ".html"));
        });

        $("#forward_arrow").on("click", function () {
            current_level = current_level < max_level ? current_level + 1 : max_level;
            menu_page_loader((page_name + current_level + ".html"));
        });
        
        $("#content-next-mod-bt").on("click", function () {
            current_level = current_level < max_level ? current_level + 1 : max_level;
            menu_page_loader((page_name + current_level + ".html"));
        });

    });
});