/*
 * apis-additem.js
 */


/*-----------------------------------------------------------------------------
 * 페이지 로드시 필수 실행
 * 페이지가 업로드 되었을 경우 업로드 버튼을 활성화하고
 * 필수항목 validator를 구성
 */
$('document').ready(function(){
    _setUploadTrigger($('#id-btn-additem'), $('#id-form-additem'));
    _makeValidator();
});


/*-----------------------------------------------------------------------------
 * 다이얼로그를 새로 열였을 경우 모든 기존 데이터를 삭제하고 
 * DB로부터 part에 해당하는 데이터를 받아와 채워줌
 */
function openAddItemDialog(event) {
    _eraseOption('#id-additem-cate1')
    _eraseOption('#id-additem-cate2')
    eraseErrorLabel($('#id-modal-additem'));
    
    $.ajax({
        type: "GET",
        url: "/apis/parts/",
        success: function (data) {
            _clearModal($('#id-modal-additem'), $('#id-additem-url') )
            _addOption('#id-additem-part', data['parts'])
            $('#id-modal-additem').modal('toggle');
        },
        error: function (e) {
            console.log("ERROR : ", e);
            alert("fail");
        }
    });
}


/*-----------------------------------------------------------------------------
 * 부위가 변경되면 카테고리1의 항목값을 DB에서 받아와 채워줌
 */
function onPartChange(type) {
    let part_name = "";
    if (type == 'add')
        part_name = $('#id-additem-part option:selected').val();
    else
        part_name = $('#id-updateitem-part option:selected').val();

    if (part_name == "") {
        if (type == 'add') {
            _eraseOption('#id-additem-cate1');
            _eraseOption('#id-additem-cate2');
        } else {
            _eraseOption('#id-updateitem-cate1')
            _eraseOption('#id-updateitem-cate2')
        }
        return;
    }      

    $.ajax({
        type: "GET",
        url: "/apis/cate1/",
        contentType: "application/json",
        data: {part: part_name},
        success: function (data) {
            if (type == 'add')
                _addOption('#id-additem-cate1', data['cate1'])
            else
                _addOption('#id-updateitem-cate1', data['cate1'])
        },
        error: function (e) {
            console.log("ERROR : ", e);
            alert("fail");
        }
   });
}


/*-----------------------------------------------------------------------------
 * 카테고리1이 변경되면 카테고리2의 항목값을 DB에서 받아와 채워줌
 */
function onCate1Change(type) {
    let cate1_name = "";
    if (type == 'add')
        cate1_name = $('#id-additem-cate1 option:selected').val();
    else
        cate1_name = $('#id-updateitem-cate1 option:selected').val();

    if (cate1_name == "") {
        if (type == 'add')
            _eraseOption('#id-additem-cate2');
        else
            _eraseOption('#id-updateitem-cate2')
        return;
    }
        
    $.ajax({
        type: "GET",
        url: "/apis/cate2/",
        contentType: "application/json",
        data: {cate1: cate1_name},
        success: function (data) {
            if (type == 'add')
                _addOption('#id-additem-cate2', data['cate2'])
            else
                _addOption('#id-updateitem-cate2', data['cate2'])
        },
        error: function (e) {
            console.log("ERROR : ", e);
            alert("fail");
        }
   });
}


/*-----------------------------------------------------------------------------
 * 이미지 파일이 변경되었을 경우 기존 이미지를 지우고 체크도 지우고 disabled 시킴
 * 제대로 된 이미지를 입력하였을 경우 자동으로 uploadImage()를 호출
 */
function onImageFileChange() {
    let imgs = $('#id-modal-additem').find('img');
    for (let i = 0; i < imgs.length; i++) {
        $(imgs[i]).attr('src', "/static/hipdrobe/img/no-image.png");
    }

    let radios = $("#id-div-imgselect").find('[name=image-select]');
    for (let i = 0; i < radios.length; i++) {
        $(radios[i]).prop('disabled', true);
        $(radios[i]).prop('checked', false);
    }
    
    $('#id-btn-image').prop("disabled", false);

    if ( $('#id-form-image input[type=file]').val() != "" )
        uploadImage();
}


/*-----------------------------------------------------------------------------
 * 이미지 선택 radio button을 눌렀을 경우 해당하는 이미지의 경로를
 * main form의 hidden input에 심어준다.
 * 이미지가 전송되는 것이 아닌 이미지의 경로만 전송됨(이미 전송되어 있으므로)
 */
function onImageSelect(input) {
    if ( $(input).prop('id') == $('#id-additem-image1').prop('id') ) 
        $('#id-additem-url').val($('#id-additem-preview1').prop('src'));
    else
        $('#id-additem-url').val($('#id-additem-preview2').prop('src'));
}


/*-----------------------------------------------------------------------------
 * 파일선택 창에서 이미지가 선택되었을 경우 자동으로 이미지를 업로드 시키고 
 * 원본의 리사이즈된 이미지와 기초적인 투명화가 적용된 이미지를 반환하여 보여줌
 */
function uploadImage(event) {
    // event.stopPropagation();
    // event.preventDefault();

    enableLoading();

    $('#id-btn-image').prop("disabled", true);
    
    var form = $('#id-form-image')[0];
    var data = new FormData(form);

    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: "/apis/upload/",
        data: data,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 600000,
        success: function (data) {
            $('#id-div-imgselect').css('display', 'block');
            $('#id-additem-preview1').prop(
                'src', "/clothes_tmp/" + data['org']);
            $('#id-additem-preview2').prop(
                'src', "/clothes_tmp/" + data['mod']);

            let radios = $("#id-div-imgselect").find('[name=image-select]');
            for(let i = 0; i < radios.length; i++) {
                $(radios[i]).prop('disabled', false);
            }
            disableLoading();
        },
        error: function (e) {
            console.log("ERROR : ", e);
            alert("fail");
            $('#id-btn-image').prop("disabled", false);
            disableLoading();
        }
   });
 }


/*-----------------------------------------------------------------------------
 * Validator에서 모든 체크가 완료되면 실질적으로 AJAX POST를 진행한다. 
 * form에 있는 모든 정보를 서버로 전송한다.
 */
 function postAddItem() {
    enableLoading();

    $('#id-btn-additem').prop("disabled", true);
    
    var data = $('#id-form-additem').serialize();
    $.ajax({
        type: "POST",
        url: "/apis/additem/",
        data: data,
        // contentType: false,
        success: function (data) {
            disableLoading();
            $('#id-btn-additem').prop("disabled", false);
            if (data['result'] == 'success') {
                $('#id-modal-success').modal('show');
                setTimeout(_ => {
                    $('#id-modal-success').modal('hide')
                    $('#id-modal-additem').modal('hide');
                }, 1000);         
            }
            else {
                alert("fail");
            }
        },
        error: function (e) {
            console.log("ERROR : ", e);
            alert("fail");
            $('#id-btn-additem').prop("disabled", false);
            disableLoading();
        }
    });
}


/*-----------------------------------------------------------------------------
 * target으로 주어진 select-box에 data로 주어진 항목들을 채움
 */
function _addOption(target, data) {
    var select = $(target).html("");
    select.append("<option value='' selected>선택하세요</option>");

    for(let i = 0; i < data.length; i++) {
        opt = data[i];
        select.append("<option value='" + opt + "'>" + opt + "</option>");
    }
}


/*-----------------------------------------------------------------------------
 * target으로 주어진 select-box의 모든 항목을 지우고 안내 문구만 남김
 */
function _eraseOption(target) {
    let select = $(target).html("");
    select.append("<option selected>선택하세요</option>");
}


/*-----------------------------------------------------------------------------
 * 의상 등록 다이얼로그를 새로 띄웠을 경우 기존 데이터를 모두 지움
 */
function _clearModal($modal, $elem) {
    let forms = $modal.find('form');
    for(let i = 0; i < forms.length; i++) {
        forms[i].reset();
    }

    let imgs = $('#id-modal-additem').find('img');
    for(let i = 0; i < imgs.length; i++) {
        $(imgs[i]).attr('src', "/static/hipdrobe/img/no-image.png");
    }

    $elem.val("");
}


/*-----------------------------------------------------------------------------
 * 최종 업로드 버튼
 */
function _setUploadTrigger($btn, $form) {
    $btn.click(function(event){
        event.stopPropagation();
        event.preventDefault();

        // 버튼이 클릭되면 validator로 결정권을 넘김
        $form.submit();
    });
}


/*-----------------------------------------------------------------------------
 * validator
 * 필수 항목을 모두 맞게 잘 넣었는지 체크
 * ref: 
 *  https://jqueryvalidation.org/
 *      
 */
function _makeValidator() {
    $("#id-form-image").validate({
        rules: {
            image: {required: true },
            'image-select': {required: true },
          },
          submitHandler: function (frm) {
              //ToDo: 업로드 구현
              postAddItem();
          },
          success: function (e) {
              //ToDo: Nonthing To Do...
          }
    });
    
    $("#id-form-additem").validate({
        rules: {
          part: {required: true },
          cate1: {required: true },
          cate2: {required: true },
        },
        messages: {
        },
        submitHandler: function (frm) {
            // 이미지 선택 form의 validation으로 넘김
            $("#id-form-image").submit()
        },
        success: function (e) {
            //ToDo: Nonthing To Do...
        }
    });
}
