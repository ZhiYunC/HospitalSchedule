function setupNavLinks(pageId) {
    console.log("setupNavLinks function called"); // Add this line for debugging
    $('.nav-link.active').removeClass('active');
    $(pageId).addClass('active');
}