$(document).ready(function () {

     $(function () {

        $(".selectpicker").selectpicker({
            noneSelectedText : '请选择历史行情数据'
        })

    $(window).on('load', function() {
        $('.selectpicker').selectpicker('val', '');
        $('.selectpicker').selectpicker('refresh');
    })

    //下拉数据加载
    $.ajax({
        type : 'get',
        url : '/showHistory/',
        dataType : 'json',
        success : function(datas) {//返回list数据并循环获取
            datas =  $.parseJSON( datas )
            console.log(datas)


            var select = $("#historySelect");
            for (var i = 0; i < datas.length; i++) {
                sh = datas[i].split('-')
                console.log(sh)
                select.append("<option value='"+sh[0] +"'>"
                    +datas[i]+ "</option>");
            }
            $('.selectpicker').selectpicker('val', '');
            $('.selectpicker').selectpicker('refresh');
        }
    })

    })




})