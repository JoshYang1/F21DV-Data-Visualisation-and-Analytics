// Info button popover will appear when clicked
//https://codepen.io/nwalton3/pen/DmwPJe
$('.icon-info-sign').popover({html: true, 
                                placement:"left", 
                                content:"ICT - A single combined score for three key areas: Influence, Creativity and Threat.<br /><br />FD Index - Player Form / Difficulty of Next 5 Fixtures", 
                                title:"Help" });


$(':not(#anything)').on('click', function (e) {
    $('.icon-info-sign').each(function () {
        //the 'is' for buttons that trigger popups
        //the 'has' for icons and other elements within a button that triggers a popup
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
            $(this).popover('hide');
            return;
        }
    });
});