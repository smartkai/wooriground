$(document).ready(function(){
    // 로고 검은색
    changeLogColor('black')

    // 제목 및 액티브 효과 적용
    setTitle(["나만의 옷장 :", "코디 수정"]);
    // setActive(["main-ln-wardrobe", "ln-coordi"]);

    setCoordiForUpdate();
    _makeValidator_update();
});




var g_coordi = null;
function setCoordiForUpdate() {
    // 코디 정보를 가져와 오브젝트로 만들고
    const dataRaw = $('#hidden-data').val()
            .replace(/'/gi, '"')
            .replace(/True/gi, 'true')
            .replace(/False/gi, 'false')
            .replace(/None/gi, null);
    g_coordi = JSON.parse(dataRaw);
    $('#hidden-data').val('');

    // 각각의 부위를 char-win 과 coord-win에 심어준다.
    const $coordiWin = _objToCoordWind('100%', 'auto', g_coordi);
    const $srcParts = $coordiWin.find('.coord-part');
    $srcParts.each(function(i, srcPart) {
        const id = $(srcPart).attr('pid');
        const imgTag = $(srcPart).find('img');
        const $part = $('#id-div-char-win').find(`#${id}`)
        g_currentPart = $part[0];
        
        setPartsImage(g_currentPart, imgTag);
    });

    // 위치 복원
    const fn = function() {
        setTimeout(function() {
            const $parts = $('#id-div-coord-win').find('.coord-part');
            if($parts.length == 0) {
                fn();
                return;
            }

            $parts.each(function(i, part) {
                const $part = $(part);
                const elem_list = g_coordi['elem_list'];
                for (let j = 0; j <elem_list.length; j++) {
                    const coordi = elem_list[j];
                    if ($part.attr('pid') == coordi['pid']) {
                        $part.css({
                            'width': coordi['width'],
                            'top': coordi['top'],
                            'left': coordi['left'],
                            'z-index': coordi['zindex']
                        })
                        break;
                    }
                }
            });
        }, 50);
    };
    fn();

    // 배경 설정
    const $btnGroup =  $('#id-div-coord-win .btn-group');
    $btnGroup.find('.active').removeClass('active');
    $btnGroup.find(`[imgtype=${g_coordi['bg_type']}]`).addClass('active');
    $('#id-div-coord-win').attr('class', 
        'coord-win coord-post main mb-3 ' + g_coordi['bg_type']);

    // 데일리룩인지 아닌지에 따라 버튼을 설정한다
    if (g_coordi['is_daily']) {
        $('.save-group').find('.btn-success').css('display', 'none');
        $('.save-group').find('.btn-primary')
            .html('데일리룩 수정하기')
            .attr('onclick', 'openPostModal(event, true, false)')
    } else {
        $('.save-group').find('.btn-primary').css('display', 'none');
        $('.save-group').find('.btn-success')
            .html('데일리룩 수정하기')
            .attr('onclick', 'openPostModal(event, false, false)')
    }
}


function coordSubmitUpdate(e) {
    e.stopPropagation();
    e.preventDefault();

    $('#id-modal-post form').submit();
}


function _makeValidator_update() {
    $("#id-modal-post form").validate().destroy();
    $("#id-modal-post form").validate({
        rules: {
            title: {required: true },
            content: {required: true },
        },
        submitHandler: function (frm) {
            postCoordi(g_coordiData, '/apis/coordi/edit/');
        },
        success: function (e) {
            //ToDo: Nonthing To Do...
        }
    });
}


function _setTimelineCoordHeight() {
    const targetList = $('.tab-pane.active .card .coord-post');
    targetList.each(function(i, target) {
        _setPartHeight($(target), 1);
    });
}


var g_windowResized = false;
$(window).resize(function() {
    _setTimelineCoordHeight()
    g_windowResized = true;
});
