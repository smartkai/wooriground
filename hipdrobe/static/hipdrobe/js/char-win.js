/* 
 * char-win.js
 * 
 * ref:
 * - displace.js    https://catc.github.io/displace/#demo
 */

var g_moveables = [];
var g_moveables_set = [];
var g_clothes = [];

$(document).ready(function(){
    setPartsHeights();
    setPartsDefaultImage();

    setPartsButtons();
    _makeValidator_post();
});


/* ----------------------------------------------------------------------------
 * 코디하기 화면에서 아이템들을 이동시킬 수 있게 등록해주는 함수
 */
function enableDnD() {
    const elems = document.querySelectorAll('.moveable');
    const options = { constrain: true };

    for(let i = 0; i < elems.length; i++) {
        let isNew = true;
        for (let j = 0; j < g_moveables_set.length; j++) {
            if (elems[i] == g_moveables_set[j]) {
                isNew = false;
                break;
            }
        }

        if (isNew) {
            displacejs(elems[i], options);
            g_moveables_set.push(elems[i]);
        }
    }
}

/* ----------------------------------------------------------------------------
 * 부위 설정 / 코디 하기 모드 전환 함수
 */
function changeCoordMode(mode) {

    

    // 옷 설정 모드
    if (mode === 0) {
        $('#id-div-char-win').css('display', 'flex');
        $('#id-div-coord-win').css('display', 'none');

        const $parent = $('#id-div-mode-change');
        $parent.find('.btn-light').addClass('active')
        $parent.find('.btn-dark').removeClass('active')

        setTimeout(function(){
            setPartsHeights();
        }, 20)
    }
    // 코디하기 모드
    else {
        $('#id-div-char-win').css('display', 'none');
        $('#id-div-coord-win').css('display', 'flex');

        const $parent = $('#id-div-mode-change');
        $parent.find('.btn-light').removeClass('active')
        $parent.find('.btn-dark').addClass('active')

        setTimeout(function(){
            enableDnD();
        }, 300);

        setTimeout(function(){
            setPartsHeights();
        }, 20)  
    }
}


/* ----------------------------------------------------------------------------
 * 성별에 맞게 각 부위의 기본 이미지를 설정 (성별기능 아직 없음)
 * 
 */
function setPartsDefaultImage() {
    let imgTags = $('.clickable').find('img');
    
    imgTags.each(function(i, tag) {
        let dummyUrl = $(tag).attr('src');
        $(tag).attr('value', dummyUrl);
    });

}

/*-----------------------------------------------------------------------------
 * 각 부위에 맞는 리스트창을 열도록 버튼을 설정
 * 이미지 선택 취소 버튼도 같이 설정한다.
 */
let g_currentPart = null;
function setPartsButtons() {
    parts = $('.clickable');

    parts.each(function(i, part){
        $(part).on('click', function(e) {
            g_currentPart = part;
            getItemUrlsAndOpenList(
                $(this).attr('value'), 
                'setPartsImage(g_currentPart, this)'
            );
        });

        $(part).find('.del').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.cancelbubble = true;

            unsetPartsImage(part, 'id');
        });
    });

    // 코디하기 div에 클릭 이벤트 등록
    // 빈 공간을 클릭하면 기존에 선택된 파트가 있다면 선택을 해제시킨다.
    $('#id-div-coord-win').click(function() {
        if(g_$currentCoortPart == null)
            return;
        
        g_$currentCoortPart.removeClass('outline');
        g_$currentCoortPart = null;
    });

    // 코디하기 모드에서 아이템들의 크기나 레이어를 조절하기 위한 버튼들
    $('#id-btn-minus').click(function(e) {
        e.stopPropagation();

        if (g_$currentCoortPart == null) 
            return;

        let divWidth = parseFloat(g_$currentCoortPart.parent().css('width'));
        let width = parseFloat(g_$currentCoortPart.css('width'));
        g_$currentCoortPart.css({
            'width': (width/divWidth)*95 + '%',
            'height': 'auto'
        });

        _reInitCoordPart();
    });

    $('#id-btn-plus').click(function(e) {
        e.stopPropagation();

        if (g_$currentCoortPart == null) 
            return;

        let divWidth = parseFloat(g_$currentCoortPart.parent().css('width'));
        let width = parseFloat(g_$currentCoortPart.css('width'));
        g_$currentCoortPart.css({
            'width': (width/divWidth)*105 + '%',
            'height': 'auto'
        });

        _reInitCoordPart();
    });

    $('#id-btn-down').click(function(e) {
        e.stopPropagation();

        if (g_$currentCoortPart == null) 
            return;

        const curIndex = parseInt(g_$currentCoortPart.css('z-index'));
        if (curIndex > 1)
            g_$currentCoortPart.css('z-index', curIndex - 1);
    });

    $('#id-btn-up').click(function(e) {
        e.stopPropagation();

        if (g_$currentCoortPart == null) 
            return;

        const curIndex = parseInt(g_$currentCoortPart.css('z-index'));
        if (curIndex < 15)
            g_$currentCoortPart.css('z-index', curIndex + 1);
    });

    // 모드 변경 버튼 (부위 설정/ 코디하기)
    $("div.row.control .btn-group > .btn").click(function(){
        $("div.row.control .btn-group > .btn").removeClass("active");
        $(this).addClass("active");
    });

    // 배경 선택 버튼
    $("#id-div-coord-win .btn-group > .btn").click(function(){
        $("#id-div-coord-win .btn-group > .btn").removeClass("active");
        $(this).addClass("active");

        let imgtype = $(this).attr('imgtype');
        $('#id-div-coord-win').attr('class', "coord-win coord-post mb-3");
        $('#id-div-coord-win').addClass(imgtype);
    });
}


/*-----------------------------------------------------------------------------
 * 코디하기 윈도우에서 DOM size 변경시 새로 설정한다.
 */
function _reInitCoordPart() {
    const $div = g_$currentCoortPart.clone();
    unsetPartsImage(g_$currentCoortPart, 'pid');
    const $img = $div.find('img');
    $img.click(function(e) {
        e.stopPropagation();
        if (g_$currentCoortPart != null) {
            g_$currentCoortPart.removeClass('outline');
        }
        g_$currentCoortPart = $img.parent();
        g_$currentCoortPart.addClass('outline');
    });
    // unsetPartsImage(g_$currentCoortPart, 'pid');
    // g_$currentCoortPart.remove();
    $div.appendTo($('#id-div-coord-win'))
    g_moveables.push($div);
    g_$currentCoortPart = $div;

    enableDnD();
}



/*-----------------------------------------------------------------------------
 * 각 파트에 선택한 이미지를 등록하거나 혹은 취소하여 원복시킴
 */
let g_$currentCoortPart = null;
function  setPartsImage(part, imgTag) {
    unsetPartsImage(part, 'id');

    let imgUrl = $(imgTag).attr('src');
    let $imgTag = $(part).find('img');
    
    $imgTag.attr('src', imgUrl);
    $(part).removeClass('blank')

    // 선택한 이미지를 코디하기 창에도 넣어준다. (좀 크게 넣어준다.)
    setTimeout(function() {
        const $div = $('<div>').addClass('coord-part').addClass('moveable');
        $div.attr('pid', $(part).attr('id'));
        
        const $parent = $('#id-div-char-win');
        const divWidth = parseFloat($parent.css('width'));
        const divHeight = parseFloat($parent.css('height'));
        const width = parseFloat($imgTag.parent().css('width'));
        $div.css({
            'width': (width/divWidth)*130 + '%',
            'height': 'auto'
        });
        
        const $img = $('<img>').attr('src', imgUrl);
        $img.attr('src', imgUrl);

        // 클릭되었을 경우 선택된 것으로 인식도록 outline을 설정한다.
        $img.click(function(e) {
            e.stopPropagation();
            if (g_$currentCoortPart != null) {
                g_$currentCoortPart.removeClass('outline');
            }
            g_$currentCoortPart = $img.parent();
            g_$currentCoortPart.addClass('outline');
        });

        $div.append($img);

        $('#id-div-coord-win').append($div);
        $div.css({
            'left': (parseFloat($(part).css('left'))/divWidth)*100 + '%',
            'top': (parseFloat($(part).css('top'))/divHeight)*100 + '%'
        });

        // 등록되고나면 글로벌 변수 array에 넣어준다.
        g_moveables.push($div);
        $('.save-group .btn').attr('disabled', false);
    }, 500);


    $('#itemlist').modal('hide');
}

function unsetPartsImage(part, strAttr) {
    let pid = $(part).attr(strAttr);
    g_moveables.forEach(function(elem, i) {
        let $elem = $(elem);
        if ($elem.attr('pid') == pid) {
            $elem.remove();
            delete g_moveables[i];
        }
    });
    g_moveables = g_moveables.filter(el => el != null);

    g_moveables_set.forEach(function(elem, i) {
        let $elem = $(elem);
        if ($elem.attr('pid') == pid) {
            $elem.remove();
            delete g_moveables_set[i];
        }
    });
    g_moveables_set = g_moveables_set.filter(el => el != null);

    if (g_moveables.length == 0 && strAttr == 'id') 
        $('.save-group .btn').attr('disabled', true);

    $(part).addClass('blank');
    let imgTag = $(part).find('img');
    imgTag.attr('src', imgTag.attr('value'));
}



/*-----------------------------------------------------------------------------
 * 브라우저 화면 사이즈에 따라 비율에 맞게 height 조절
 */
function setPartsHeights() {
    // Container Div
    _setPartHeight($('#id-div-char-win'), 1);
    _setPartHeight($('#id-div-coord-win'), 1);
    
    // Head
    _setPartHeight( $('#id-coord-head'), 1);

    // Top
    _setPartHeight($('#id-coord-top1'), 1.2);
    _setPartHeight( $('#id-coord-top2'), 1.2);

    // Bottom
    _setPartHeight($('#id-coord-bottom1'), 1.4);
    _setPartHeight($('#id-coord-bottom2'), 1.4);

    // Bottom
    _setPartHeight($('#id-coord-foot1'), 1);
    _setPartHeight($('#id-coord-foot2'), 1);

    // Acc
    _setPartHeight($('#id-coord-acc1'), 1);
    _setPartHeight($('#id-coord-acc2'), 1);
    _setPartHeight($('#id-coord-acc3'), 4.4);
    _setPartHeight($('#id-coord-acc4'), 1.3);
    _setPartHeight($('#id-coord-acc5'), 1);
    _setPartHeight($('#id-coord-acc6'), 1);

    // Outer
    _setPartHeight($('#id-coord-outer'), 2);

    // Post Modal
    _setPartHeight($('#id-div-post-win'), 1);
}


function _setPartHeight(target, ratio) {
    const partheight = parseInt(target.css('width')) * ratio;
    target.css('height', `${partheight}px`);
}


/*-----------------------------------------------------------------------------
 * 데일리룩 / 코디 저장 (데일리 룩은 기획을 더 해야해서 미완)
 */
var g_coordiData = null;
function openPostModal(e, bDaily, bNew) {
    e.stopPropagation();

    const $modal = $('#id-modal-post');
    eraseErrorLabel($modal);
    $modal.find('input').val('');
    $modal.find('textarea').val('');
    $modal.modal('toggle');

    // 제목/버튼 변경 및 개별 동작
    if (bDaily) {
        $('#id-coordi-save-title').html('데일리룩 저장하기');
        $('#id-btn-coord-post').html('데일리룩 저장하기')
            .attr('class', 'btn btn-primary');
        $modal.find('.daily').css('display', 'block');

        getAndSetDailyStatus();
    } else {
        $('#id-coordi-save-title').html('코디 저장하기');
        $('#id-btn-coord-post').html('코디 저장하기')
            .attr('class', 'btn btn-success');
        $modal.find('.daily').css('display', 'none');
    }

    const arrItem = [];
    g_moveables.forEach(function($elem, i) {
        const obj = _divToObject($elem);
        arrItem.push(obj);
    });

    g_coordiData = {
        is_daily: bDaily,
        elem_list : arrItem,
        bg_type : $('#id-div-coord-win .btn.active').attr('imgtype')
    }

    const $coordWin = _objToCoordWind( '100%', 'auto', g_coordiData );
    $coordWin.attr('id', 'id-div-post-win');
    $modal.find('.coord-post').remove();
    $modal.find('.win-wrapper').append($coordWin);

    if (!bNew) {
        $('#id-btn-coord-post').attr('onclick', 'coordSubmitUpdate(event)');
        $('.form-group.daily').css('display', 'none');
        $('#id-post-input-title').val(g_coordi['title']);
        $('#id-post-textarea').val(g_coordi['content']);

        console.log( $('#id-post-input-title')[0])
    }
}

/*-----------------------------------------------------------------------------
 * 단일 아이템 Jqeury DOM Element를 Ojbect로 전환
 */
function _divToObject($elem) {
    const divWidth = parseFloat($('#id-div-coord-win').css('width'));
    const divHeight = parseFloat($('#id-div-coord-win').css('height'));

    const width = parseFloat($elem.css('width'));
    const left = parseFloat($elem.css('left'));
    const top = parseFloat($elem.css('top'));
    const zindex = $elem.css('z-index');
    const imgurl = $elem.find('img').attr('src');
    const pid = $elem.attr('pid');

    const item = {
        'width': (width/divWidth)*100 + '%',
        'left': (left/divWidth)*100 + '%',
        'top': (top/divHeight)*100 + '%',
        'zindex': zindex,
        'imgurl': imgurl,
        'pid' : pid
    };

    return item;
}


/*-----------------------------------------------------------------------------
 * 코디 전체 Object 를 Jqeury DOM Element로 복원하여 생성
 */
function _objToCoordWind(width, height, obj) {
    const list = obj['elem_list'];
    const bg = obj['bg_type'];

    const $coordWin = $('<div>').attr('class', `coord-win coord-post ${bg}`)
        .css('display', 'flex').css('width', width).css(height, 'auto');

    const arrDiv = [];
    list.forEach( elem => {
        const $div = $('<div>').attr('class', "coord-part")
                .attr('pid', elem['pid']);
        $div.css({
            'width': elem['width'],
            'height': 'auto',
            'left': elem['left'],
            'top': elem['top'],
            'z-index': elem['zindex']
        });
        const $img = $('<img>').attr('src', elem['imgurl']);
        $div.append($img);
        $coordWin.append($div);

        const fn = _ => { 
            setTimeout(_ => {
                if(  $coordWin.css('width') == "100%" ) 
                    fn();
                else
                    _setPartHeight( $coordWin, 1);
            }, 100);
        };
        fn();
    });

    return $coordWin;
}


/*-----------------------------------------------------------------------------
 * Form Submit 동작을 취하여 validator로 제어권을 넘긴다.
 */
function coordSubmit(e, bDaily) {
    e.stopPropagation();
    e.preventDefault();

    $('#id-modal-post form').submit();
}


/*-----------------------------------------------------------------------------
 * validation 만족할 경우 서버로 포스트하는 함수를 실행한다.
 */
function _makeValidator_post() {
    $("#id-modal-post form").validate({
        rules: {
            title: {required: true },
            content: {required: true },
        },
        submitHandler: function (frm) {
            //ToDo: 코디 저장 구현 (데일리룩 미완)
            postCoordi(g_coordiData, '/apis/coordi/new/')
        },
        success: function (e) {
            //ToDo: Nonthing To Do...
        }
    });
}


/*-----------------------------------------------------------------------------
 * 저장할 코디 데이터를 서버로 보낸다
 */
function postCoordi(coordiData, url) {

    // Spinner 활성화 및 버튼 비활성화
    $('#id-modal-post .btn').attr('disabled', true);
    $('#id-modal-post .spinner-border').css('display', 'inherit');

    coordiData['title'] = $('#id-modal-post [name=title]').val();
    coordiData['content'] = $('#id-modal-post [name=content]').val();

    // 업데이트의 경우 현재 코디의 아이디가 필요하다.
    if (url == '/apis/coordi/edit/') {
        coordiData['c_id'] = g_coordi['id'];
    }

    // 
    if(coordiData['is_daily']) {
        coordiData['daywhen'] = 
            $('#id-modal-post').find('[name=daywhen]:checked').attr('data');
    }

    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';
    axios.post(
        url, 
        JSON.stringify(
            { data : coordiData }
        )
    )
    .then(response => {
        result = response.data['result'];
        
        if (result) {
            $('#id-modal-success').modal('show');
            setTimeout(_ => {
                $('#id-modal-success').modal('hide')
                $('#id-modal-post').modal('hide');

                // update의 경우 detail 페이지로 돌아간다
                if (url == '/apis/coordi/edit/') {
                    window.location.href = 
                        `/wardrobe/coordi/${g_coordi['id']}/detail/`;
                }
            }, 1000);

            if(coordiData['is_daily']) {
                g_coordiDailyPage = 0;
                $('#id-coordi-timeline-daily').html('')
            } else {
                g_coordiNormalPage = 0;
                $('#id-coordi-timeline-normal').html('')
            }
        } else {
            // ToDo: 실패할 경우 사용자에게 알림 구현...
            console.log("코디 업로드 실패...");
        }

    })
    .catch(function (error) {
        console.log(error);
    })
    .finally(function(){
        // Spinner 비활성화 및 버튼 활성화
        $('#id-modal-post .btn').attr('disabled', false);
        $('#id-modal-post .spinner-border').css('display', 'none');
    });
}


/*-----------------------------------------------------------------------------
 * 오늘과 내일의 데일리룩이 이미 설정되었는지 확인한다.
 */
function getAndSetDailyStatus() {
    axios.get(
        '/apis/daily-status/', {
            params: {
                // 보낼 정보가 없네...
            }
        }
    )
    .then(response => {
        data = response.data    
        if (data['result']) {
            if(data['today'])
                $('#id-sm-today').html(
                    '(이미 저장된 데일리 룩이 있습니다 > 덮어쓰기)');
            if(data['tomorrow']) 
                $('#id-sm-tomorrow').html(
                    '(이미 저장된 데일리 룩이 있습니다 > 덮어쓰기)');
        } else {
            // ToDo: 
            console.log(data['reason']);
        }
    })
    .catch(function (error) {
        console.log(error);
    })
    .finally(function(){
        // ToDo: 
    });
}


/* ----------------------------------------------------------------------------
 * 서버에서 날아온 Coordi Object를 DOM Element로 복원하여 화면에 심어준다.
 */
function pushCoordisToBottom(data, $parent, tag) {
    
    const length = data.length;
    const rowToGo = Math.ceil(parseFloat(length)/CARDS_IN_ROW);

    let cardsIndex = 0;
    for (let i = 0; i < rowToGo; i++) {
        const $cardGroup = $('<div>').attr('class', 'card-group');
        $cardGroup.appendTo($parent)

        if (i == 0) {
            $cardGroup.attr('name', tag);
        }
        
        let slotRemained = CARDS_IN_ROW;
        for (let j = 0; j < slotRemained; j++) {
            const $card = $('<div>').attr('class', 'card')
                .css('visibility', 'collapse');
            $card.appendTo($cardGroup);

            if (cardsIndex >= length)  
                return;

            // Coordi Win
            const $coordiWin = _objToCoordWind(
                    '100%', 'auto', data[cardsIndex]);
            $coordiWin.appendTo($card);

            // Card Body
            const $cardBody = $('<div>').attr('class', 'card-body');
            $cardBody.appendTo($card);
            // Title
            const $title = $('<h4>').attr('class', 'card-title');
            $title.appendTo($cardBody);
            const $a = $('<a>')
                .attr('href', `/wardrobe/coordi/${data[cardsIndex]['id']}/detail/`)
                .html(data[cardsIndex]['title']);
            $a.appendTo($title);
            
            // Content
            const $content = $('<p>').attr('class', 'card-text').html(
                    data[cardsIndex]['content']);
            $content.appendTo($cardBody);
            // DateTime
            const $cardFooter = $('<div>').attr('class', 'card-footer');
            $cardFooter.appendTo($card);
            const $small = $('<small>').attr('class', 'text-muted').html(
                    data[cardsIndex]['created_at']);
            $small.appendTo($cardFooter);

            setTimeout(_ => $card.css('visibility', 'visible'), 300);

            cardsIndex++;
        }
    }
}








/*-----------------------------------------------------------------------------
 * 브라우저 화면 사이즈가 바뀌면 그에 맞게 조정한다.
 */
$(window).resize(function() {
    setPartsHeights();
});
