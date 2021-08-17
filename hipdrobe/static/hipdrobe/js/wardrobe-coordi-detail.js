
$(document).ready(function(){
    // 로고 검은색
    changeLogColor('black')

    // 제목 및 액티브 효과 적용
    setTitle(["나만의 옷장 :", "코디 자세히보기"]);
    // setActive(["main-ln-wardrobe", "ln-coordi"]);

    setCoordi();

});

let g_coordi = null;
function setCoordi() {
    
    const dataRaw = $('#hidden-data').val()
            .replace(/'/gi, '"')
            .replace(/True/gi, 'true')
            .replace(/False/gi, 'false')
            .replace(/None/gi, null);
    g_coordi = JSON.parse(dataRaw);
    $('#hidden-data').val('');

    const $coordiWin = _objToCoordWind('100%', 'auto', g_coordi);

    const $card = $('.card');

    $coordiWin.appendTo($card);

    // Card Body
    const $cardBody = $('<div>').attr('class', 'card-body');
    $cardBody.appendTo($card);
    // Title
    const $title = $('<h4>').attr('class', 'card-title');
    $title.appendTo($cardBody);
    const $a = $('<a>')
        .attr('href', `/wardrobe/coordi/${g_coordi['id']}/detail/`)
        .html(g_coordi['title']);
    $a.appendTo($title);
    
    // Content
    const $content = $('<p>').attr('class', 'card-text').html(
        g_coordi['content']);
    $content.appendTo($cardBody);
    // DateTime
    const $cardFooter = $('<div>').attr('class', 'card-footer');
    $cardFooter.appendTo($card);
    const $small = $('<small>').attr('class', 'text-muted').html(
        g_coordi['created_at']);
    $small.appendTo($cardFooter);
}

function confirmDelete() {
    $('#id-modal-delete').modal('show');
}


function deleteCoordi() {
    enableLoading();

    const data = {
        'c_id': g_coordi['id']
    }

    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';
    axios.post(
        '/apis/coordi/delete/', 
        JSON.stringify(
            { data : data }
        )
    )
    .then(response => {
        result = response.data['result'];
        
        if (result) {
            $('#id-modal-success').modal('show');
            setTimeout(_ => {
                $('#id-modal-delete').modal('hide');
                $('#id-modal-success').modal('hide')
                window.location.href = '/wardrobe/coordi/'
            }, 1500);  
        } else {
            // ToDo: 실패할 경우 사용자에게 알림 구현...
            console.log("코디 삭제 실패...");
        }
    })
    .catch(function (error) {
        console.log(error);
    })
    .finally(function(){
        disableLoading();
    });
}


function _setTimelineCoordHeight() {
    const targetList = $('.card .coord-post');
    targetList.each(function(i, target) {
        _setPartHeight($(target), 1);
    });
}


var g_windowResized = false;
$(window).resize(function() {
    _setTimelineCoordHeight()
    g_windowResized = true;
});
