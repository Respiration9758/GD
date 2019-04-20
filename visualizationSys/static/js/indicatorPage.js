$(document).ready(function () {
    $('#addData').attr("disabled","true")

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
	$("input[name='indicator']:checked").each(function () {
        del($(this), $(this).val());
    })
}

    function del(obj, id) {
	$.ajax({
			type: 'POST',
			url: '/i_delete/',
            data: {'id':id},
			dataType: 'json',
			success: function(data){
				$(obj).parents("tr").remove();
				 window.location.href="../../indicatorPage/1/"
			},
			error:function(data) {

			},
	})
}

})