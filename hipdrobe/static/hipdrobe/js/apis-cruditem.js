/*
 * apis-cruditem.js
 */

var g_data = null;


/*-----------------------------------------------------------------------------
 * getItemUrlsAndOpenList
 */
function getItemUrlsAndOpenList(name, fnStr) {
 
    $.ajax({
        type: "GET",
        url: "/apis/clothes/",
        contentType: "application/json",
        data: {name: name},
        success: function (data) { 
            if ( typeof data == 'string') {
                window.location.href = '/login/';
                return;
            }
                

            g_data = data['url'];
            var g_data_len = Object.keys(g_data).length;
            $('div.carousel-inner').html('');
            $('#img_list > h5').remove();
            $('#img_list > p').remove();
            
            // url 개수가 3보다 작은 경우
            if(0 < g_data_len && g_data_len <= 3) {
                $('div.carousel-inner').append("<div class='carousel-item active'></div>")
                for(var i=0; i<=g_data_len-1; i++) {
                    $('div.carousel-item.active').append(`<img class='d-block w-100' onclick='${fnStr}' src='` +
                    g_data[i] + "' />")
                }
            } // if end
            
            // url 개수가 3보다 큰 경우
            else if(g_data_len>3) {
                $('div.carousel-inner').append("<div class='carousel-item active'></div>")
                $('div.carousel-inner').append("<div class='carousel-item></div>")
                
                for(var i=0; i<=g_data_len-1; i++) {
                    // 처음 3개 item은 .active에 추가
                    if (i<=2) {
                        $('div.carousel-item.active').append(`<img class='d-block w-100' onclick='${fnStr}' src='` +
                        g_data[i] + "' />")                            
                    } else if (i>2 && i%3==0) { // 그 이후부터 아이템 3개 단위로 div 추가하고 이미지 추가
                        $('div.carousel-inner').append("<div class='carousel-item'></div>")
                        $('div.carousel-inner').children().eq((i/3)).append(`<img class='d-block w-100' onclick='${fnStr}' src='` + g_data[i] + "' />")
                    } else if (i>2 && i%3!=0) {
                        $('div.carousel-inner').children().eq(parseInt(i/3)).append(`<img class='d-block w-100' onclick='${fnStr}' src='` + g_data[i] + "' />")
                    }    
                } //for end
            } // else if1 end
            else {
                $('#img_list').append($('<h5>').html('이 카테고리의 패션 아이템이 하나도 없어요.'));
                $('#img_list').append($('<p>').html('아이템을 추가해보세요!'));
            }
            
            $('.modal-title.item').text(name + ' 리스트')
                
            $('#itemlist').modal();

            // setTimeout(function(){  
            // }, 500);
            
            if(fnStr==="") {
                var url = null;
                // 이미지 클릭시 실행 함수 start
                $('div.carousel-item img').click(function() {
                    
                    

                    url = $(this).attr('src');
                    $.ajax({
                        type: "GET",
                        url: "/apis/clothes_detail",
                        contentType: "application/json",
                        data: {userid: "user01@test.com", url: url},
                        success: function(data) {
                            console.log(data)
                            $('.modal-title.detail').text('아이템 상세정보');
                            $('#d_image_wrap').append("<img src='"+ data['url'] + "' />");
                            $('#cate').text(" 종류 : " + data['cate1_name'] + " ▶ " + data['cate2_name']);
                            $('#descript').text(" 옷 설명 : " + data['descript']);
                            $('#brand').text(" 브랜드 : " + data['brand']);
                            $("#color input[name='color']").val(data['color']);
                            $('#pattern').text(" 패턴 : " + data['pattern'])
                            $('#texture').text(" 재질 : " + data['texture']);
                            $('#season').text(" 계절 : " + data['season']);
                            $('#count').text(" 입은 횟수 : " + data['worn'] + "회")
                            
                            // 모달 닫을 때 입력값 초기화 되는 세팅 추가로 해야 함
                            $('#detail_modal').modal();
                            $('#detail_modal').on('hidden.bs.modal', function (e) {
                                // 모달 초기화
                                let forms = $('#detail_modal').find('form');
                                for(let i = 0; i < forms.length; i++) {
                                    forms[i].reset();
                                }
                                let imgs = $('#detail_modal').find('img');
                                for(let i = 0; i < imgs.length; i++) {
                                    $(imgs[i]).attr('src', "");
                                }
                            });

                            // 삭제 버튼 누를 시 이벤트
                            $('#delete_btn').click(function() {
                                axios.defaults.xsrfCookieName = 'csrftoken';
                                axios.defaults.xsrfHeaderName = 'X-CSRFToken';
                                axios.post(
                                    '/apis/delete_clothes/', 
                                    JSON.stringify(
                                        { data : data }
                                    )
                                )
                                .then(response => {
                                    result = response.data['result'];
                                    alert("성공")
                                    $('#detail_modal').modal('hide');
                                    // 리스트 닫고 다시 켜기
                                    $('#itemlist').modal('hide');
                                    // if(data['part']=='상의' || data['part']=='하의' || data['part']=='머리' || data['part']=='발') {
                                    //     $(".cont_wrap input[value='" + data['part'] + "']" ).trigger("click")
                                    // }


                                })
                                .catch(function (error) {
                                    console.log(error);
                                })
                                .finally(function(){
                                    
                                });

                            });
                            
                            // 수정 창 start
                            $('#update_item').click(function() {
                                // 모달 실행
                                openUpdateItem(event);

                                // part selected 처리
                                setTimeout(function() {
                                    var options = $('#id-updateitem-part option');
                                    options.each(function(i, elem) { 
                                       if ($(elem).val() == data['part']) {
                                        $(elem).attr("selected", true);
                                       }
                                    });
                                    $('#id-updateitem-part').trigger('change');
                                    
                                    // cate1 selected 처리
                                    setTimeout(function() {
                                        var options = $('#id-updateitem-cate1 option');
                                        options.each(function(i, elem) { 
                                           if ($(elem).val() == data['cate1_name']) {
                                            $(elem).attr("selected", true);
                                           }
                                        });
                                        $('#id-updateitem-cate1').trigger('change');
                                        
                                        // cate2 selected 처리
                                        setTimeout(function() {
                                            var options = $('#id-updateitem-cate2 option');
                                            options.each(function(i, elem) { 
                                               if ($(elem).val() == data['cate2_name']) {
                                                $(elem).attr("selected", true);
                                               }
                                            });
                                            $('#id-updateitem-cate2').trigger('change');
                                        }, 300); 
                                    }, 300);
                                    
                                    // color default 처리
                                    $('#id-updateitem-color').attr("value", data['color']);
                                    
                                    // season checked 처리
                                    // console.log(data['season'])
                                    for(var i=1; i<=4; i++) {
                                        $("input:checkbox[id='id-updateitem-season"+i+"']").prop("checked", false);
                                        if (data['season'].includes($('#id-updateitem-season' + i).val())) {
                                            $("input:checkbox[id='id-updateitem-season"+i+"']").prop("checked", true);
                                        }
                                    }

                                    // pattern checked 처리
                                    // console.log(data['pattern'])
                                    for(var i=1; i<=4; i++) {
                                        if ($('#id-updateitem-pattern' + i).val() == data['pattern']) {
                                            $("input:radio[id='id-updateitem-pattern"+i+"']").attr("checked", true);
                                        }
                                    }

                                    // solid 여부 checked 처리
                                    for(var i=1; i<=2; i++) {
                                        // console.log($('#id-updateitem-colortype' + i).val())
                                        if ($('#id-updateitem-colortype' + i).val() == data['solid']) {
                                            $("input:radio[id='id-updateitem-colortype"+i+"']").attr("checked", true);
                                        }
                                    }

                                    // 재질 default 처리
                                    $('#id-updateitem-texture').val(data['texture']);

                                    // 브랜드 default 처리
                                    $('#id-updateitem-brand').val(data['brand']);

                                    // descript default 처리
                                    $('#id-updateitem-desc').val(data['descript']);

                                    // 옷 id 히든으로 넘기기 위해 input hidden 생성
                                    var cid = String(data['id'])
                                    $('#id-updateitem-id').val(cid);

                                }, 300);                          

                            });
 
                        },
                        error: function (e) {
                            console.log("ERROR : ", e);
                            alert("fail");
                        }
                    }); //ajax end
                }); //클릭 함수 end
            }
        },
        error: function (e) {
            console.log("ERROR : ", e);
            alert("fail");
        }

    });
    


}
