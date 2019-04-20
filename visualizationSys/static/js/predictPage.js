$(document).ready(function () {

    $("#addData ").text("上传预测数据")

    $("#allChoiceCheckbox").click(function () {
        if ($(this).prop("checked")==true)
            $('.everyCheckbox').prop("checked", true)
        else
            $('.everyCheckbox').prop("checked", false)

    })

    $('#batchDelete').click(function () {
        datadel()
    })

    // 批量删除
    function datadel() {
    $("input[name='predict']:checked").each(function () {
        del($(this), $(this).val());
    })
}

    function del(obj, id) {
    $.ajax({
            type: 'POST',
            url: '/pd_delete/',
            data: {'id':id},
            dataType: 'json',
            success: function(data){
                $(obj).parents("tr").remove();
                 window.location.href="../../predictPage/1/"
            },
            error:function(data) {

            },
    })
}

    $("#addData ").click(function () {
        window.location.href="../../pd_add/"
    })

})