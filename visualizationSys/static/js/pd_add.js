$(document).ready(function () {

    $(function () {

        $(".selectpicker").selectpicker({
            noneSelectedText: '请选择历史行情数据'
        })

        $(window).on('load', function () {
            $('.selectpicker').selectpicker('val', '');
            $('.selectpicker').selectpicker('refresh');
        })

        //下拉数据加载
        $.ajax({
            type: 'get',
            url: '/showHistory/',
            dataType: 'json',
            success: function (datas) {//返回list数据并循环获取
                datas = $.parseJSON(datas)


                var select = $("#historySelect");


                for (var i = 0; i < datas.length; i++) {
                    sh = datas[i].split('-')
                    select.append("<option value='" + sh[0] + "'>"
                        + datas[i] + "</option>");
                }
                $('.selectpicker').selectpicker('val', '');
                $('.selectpicker').selectpicker('refresh');
            }
        })

    })


    $("#historySelect").change(function () {
        var instr = $(this).val()

        $.ajax({
            type: 'POST',
            url: '/obtain_time/',
            data:{'id':instr},
            dataType: 'json',
            success: function (data) {//返回list数据并循环获取

                console.log(data)
                $("#test_date").val(data.startTime)

                $("#pred_date").val(data.predictTime)

            }


        })

    })

})