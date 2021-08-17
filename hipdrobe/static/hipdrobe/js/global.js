/*
 *  global.js
 */

$(document).ready(function() {
    setDefaultValidMessage()
});
 
/* ----------------------------------------------------------------------------
 * 페이지 제목 넣어주기
 */
function setTitle(titles) {
    $("#page-title").html(titles[0]);
    $("#page-title-sub").html(titles[1]);
}


/* ----------------------------------------------------------------------------
 * 활성화 효과 주기
 */
function setActive(ids) {
    for(let i = 0; i < ids.length; i++) {
        let id = ids[i];
        $("#"+id).addClass('active');
    }
}


function changeLogColor(color) {
    $('#brand-main').css('color', color);
    $('#brand-main-narrow').css('color', color);
    $('#brand-main-hangeul-narrow').css('color', color);

    if( color == 'black')
        $('#brand-main-hangeul img').attr(
            'src', '/static/hipdrobe/img/brand-g-bl.svg');
}


// text effect
var textWrapper = document.querySelector('.ml7 .letters');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({loop: true})
  .add({
    targets: '.ml7 .letter',
    translateY: ["1.1em", 0],
    translateX: ["0.55em", 0],
    translateZ: 0,
    rotateZ: [180, 0],
    duration: 750,
    easing: "easeOutExpo",
    // delay: (el, i) => 50 * i
  }).add({
    targets: '.ml7',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 2000
  });



/* ----------------------------------------------------------------------------
 * loading
 */
function enableLoading() {
    $('#loading').css('visibility', 'visible' )
}

function disableLoading() {
    $('#loading').css('visibility', 'collapse' )
}


/*-----------------------------------------------------------------------------
 * var csrf_token = getCookie('csrftoken');
 */
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


function openmodal(){
    $('.login-info').openmodal
}


function setDefaultValidMessage() {
    $.extend( $.validator.messages, { 
        required: "필수 항목입니다.", 
        remote: "항목을 수정하세요.", 
        email: "유효하지 않은 E-Mail주소입니다.", 
        url: "유효하지 않은 URL입니다.", 
        date: "올바른 날짜를 입력하세요.", 
        dateISO: "올바른 날짜(ISO)를 입력하세요.", 
        number: "유효한 숫자가 아닙니다.", 
        digits: "숫자만 입력 가능합니다.", 
        creditcard: "신용카드 번호가 바르지 않습니다.", 
        equalTo: "같은 값을 다시 입력하세요.", 
        extension: "올바른 확장자가 아닙니다.", 
        maxlength: $.validator.format( "{0}자를 넘을 수 없습니다. " ), 
        minlength: $.validator.format( "{0}자 이상 입력하세요." ), 
        rangelength: $.validator.format( "문자 길이가 {0} 에서 {1} 사이의 값을 입력하세요." ), 
        range: $.validator.format( "{0} 에서 {1} 사이의 값을 입력하세요." ),
        max: $.validator.format( "{0} 이하의 값을 입력하세요." ), 
        min: $.validator.format( "{0} 이상의 값을 입력하세요." ) 
    });
}


/*-----------------------------------------------------------------------------
 * 기존에 작동된 validation 결과를 삭제함
 */
function eraseErrorLabel($target) {
    let error_labels =  $target.find('label.error');
    for(let i = 0; i < error_labels.length; i++) {
        $(error_labels[i]).remove();
    }
}

/* ----------------------------------------------------------------------------
 * 로고 제네레이터 
 * https://danmarshall.github.io/google-font-to-svg-path/
 * Rock Salt
 */
