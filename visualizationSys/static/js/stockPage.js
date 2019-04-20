$(document).ready(function () {

    $(".table ").attr("style","table-layout: fixed")


    $("#allChoiceCheckbox").click(function () {
        if ($(this).prop("checked")==true)
            $('.everyCheckbox').prop("checked", true)
        else
            $('.everyCheckbox').prop("checked", false)

    })


    $('#addData').click(function () {
        window.location.href="../../sto_add/";
    })

    $('#batchDelete').click(function () {
        datadel()
    })

    // 批量删除
    function datadel() {
	$("input[name='stock']:checked").each(function () {
        del($(this), $(this).val());
    })
}

    function del(obj, id) {
	$.ajax({
			type: 'POST',
			url: '/sto_delete/',
            data: {'id':id},
			dataType: 'json',
			success: function(data){
				$(obj).parents("tr").remove();
				 window.location.href="../../stockPage/1/"
			},
			error:function(data) {

			},
	})
}


















})