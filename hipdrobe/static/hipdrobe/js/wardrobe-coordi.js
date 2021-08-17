$(document).ready(function(){
    // 로고 검은색
    changeLogColor('black')

    // 제목 및 액티브 효과 적용
    setTitle(["나만의 옷장 :", "코디 작성"]);
    setActive(["main-ln-wardrobe", "ln-coordi"]);

    $('#id-coordi-timeline .nav-link').click(function() {
        if (g_windowResized) {
            g_windowResized = false;
            setTimeout(_ => _setTimelineCoordHeight(), 300);
        }
    });

    setTimeout(function() {
        getCoordi(false, 1);
        getCoordi(true, 1);
    }, 100);
    
});




const CARDS_IN_ROW = 2;
const CARDS_EACH_PAGE = 4;
var g_coordiDailyPage = 0;
var g_coordiNormalPage = 0;
var g_coordiDailyLoading = false;
var g_coordiNormalLoading = false;
/* ----------------------------------------------------------------------------
 * 사용자가 저장한 Coordi List를 요청하여 받기
 */
function getCoordi(is_daily, page_num) {
    // 이미 요청 중이면 리턴
    if (is_daily) {
        if (g_coordiDailyLoading)
            return;
        else 
            g_coordiDailyLoading = true;
    } else {
        if (g_coordiNormalLoading)
            return;
        else 
            g_coordiNormalLoading = true;
    }

    $('.spin-page-bottom').css('visibility', 'visible');
    axios.get('/apis/coordi/', {
        params: {
            is_daily: is_daily,
            'page_num': page_num
        }
    })
    .then(function (response) {
        data = response.data;
        if ( data['result'] == false )
            return;

        if (is_daily) {
            g_coordiDailyPage = data['page_num']
            pushCoordisToBottom(data['coordis'], $('#id-coordi-timeline-daily'), 
                `#page-d-${data['page_num']}`);
            // window.location.hash = `#page-d-${data['page_num']}`;
        } else {
            g_coordiNormalPage = data['page_num']
            pushCoordisToBottom(data['coordis'], $('#id-coordi-timeline-normal'),
                `#page-n-${data['page_num']}`);
            // window.location.hash = `#page-n-${data['page_num']}`;
        }
    })
    .catch(function (error) {
        console.log(error);
    })
    .finally(function () {
        if (is_daily)
            g_coordiDailyLoading = false;
        else 
            g_coordiNormalLoading = false;
        setTimeout(_ => $('.spin-page-bottom').css(
            'visibility', 'collapse'), 100);
        
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


$(window).scroll(function() {
    if($(window).scrollTop() + $(window).height() >= $(document).height()-2) {
        const is_daily = $('.nav-link.active').attr('href') 
            == '#id-coordi-timeline-daily';
        let page_num = is_daily ? g_coordiDailyPage : g_coordiNormalPage;
        getCoordi(is_daily, page_num + 1);
    }
 });
