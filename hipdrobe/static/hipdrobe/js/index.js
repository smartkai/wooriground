/*
 *  index.js
 */


$(document).ready(function(){
    // Index page는 로고 흰색
    changeLogColor('white')

    // Index page는 페이지 제목 없음
    setTitle("");

    // Carousel 밑의 컨텐츠 시작 위치 맞추기
    fitBottomPromise();
});

window.onresize = function(event) {
    fitBottom();
};


/* ----------------------------------------------------------------------------
 * index page에서 이미지 밑 부분의 컨텐츠 시작 위치를 맞추기 위한 함수
 */
function fitBottomPromise() {
    setTimeout(function() {
        let imgheight = parseInt($(".carousel-item.active img").css('height'));   
        if (imgheight <= 10)
        fitBottomPromise();
        else {
            $("#sidebar").css({
                'height': imgheight + 'px'
            });
        }
    }, 10); 
}

function fitBottom() {
    let imgheight = $(".carousel-item.active img").css('height');
    $("#sidebar").css({
        'height': imgheight
    });
}


