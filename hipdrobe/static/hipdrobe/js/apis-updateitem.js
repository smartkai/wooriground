/*
 * apis-updateitem.js
 */


/*-----------------------------------------------------------------------------
 * 페이지 로드시 필수 실행
 * 페이지가 업로드 되었을 경우 업로드 버튼을 활성화하고
 * 필수항목 validator를 구성
 */
$('document').ready(function(){
    _setUploadTrigger($('#id-btn-updateitem'), $('#id-form-updateitem'));
    _makeValidator_clothes_update();
});


/*-----------------------------------------------------------------------------
 * 업데이트 모달 띄우기 
 */
function openUpdateItem(event) {
    _eraseOption('#id-updateitem-part');
    _eraseOption('#id-updateitem-cate1')
    _eraseOption('#id-updateitem-cate2')
    eraseErrorLabel($('#id-modal-updateitem'));
    
    $.ajax({
        type: "GET",
        url: "/apis/parts/",
        success: function (data) {
            _clearModal($('#id-modal-updateitem'), $('#id-updateitem-id'));
            _addOption('#id-updateitem-part', data['parts']);
            $('#id-modal-updateitem').modal('toggle');
        },
        error: function (e) {
            console.log("ERROR : ", e);
            alert("fail");
        }
   });
}


/*-----------------------------------------------------------------------------
 * Validator에서 모든 체크가 완료되면 실질적으로 AJAX POST를 진행한다. 
 * form에 있는 모든 정보를 서버로 전송한다.
 */
 function postUpdateItem() {
    enableLoading();

    $('#id-btn-updateitem').prop("disabled", true);
    var data = $('#id-form-updateitem').serialize();
    
    $.ajax({
        type: "POST",
        url: "/apis/updateitem/",
        data: data,
        // contentType: false,
        success: function (data) {
            disableLoading();
            $('#id-btn-updateitem').prop("disabled", false);
            alert('아이템 정보가 변경되었습니다.')
            $('#id-modal-updateitem').modal('hide');
            $('#id-modal-updateitem').on('hidden.bs.modal', function (e) {
                // refresh modal content
                $('#cate').text(" 종류 : " + data['cate1_name'] + " ▶ " + data['cate2_name']);
                $('#descript').text(" 옷 설명 : " + data['descript']);
                $('#brand').text(" 브랜드 : " + data['brand']);
                $("#color input[name='color']").val(data['color']);
                $('#pattern').text(" 패턴 : " + data['pattern'])
                $('#texture').text(" 재질 : " + data['texture']);
                $('#season').text(" 계절 : " + data['season']);
                $("#detail_modal").load();
                
                // updateitem페이지 초기화
                _clearModal($('#id-modal-updateitem'), $('#id-updateitem-id'));

            })
        },
        error: function (e) {
            console.log("ERROR : ", e);
            alert("fail");
            $('#id-btn-updateitem').prop("disabled", false);
            disableLoading();
        }
    });
}


/*-----------------------------------------------------------------------------
 * validator
 * 필수 항목을 모두 맞게 잘 넣었는지 체크
 * ref: 
 *  https://jqueryvalidation.org/
 *      
 */
function _makeValidator_clothes_update() {
    $("#id-form-updateitem").validate({
        rules: {
          part: {required: true },
          cate1: {required: true },
          cate2: {required: true },
        },
        messages: {
        },
        submitHandler: function (frm) {
            // 이미지 선택 form의 validation으로 넘김
            postUpdateItem();
        },
        success: function (e) {
            //ToDo: Nonthing To Do...
        }
    });
}
