
$(document).ready(function () {

     $(".table ").attr("style","table-layout: fixed")



    $('#addData').click(function () {
        window.location.href="../../sh_add/";
    })

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
	$("input[name='history']:checked").each(function () {
        del($(this), $(this).val());
    })
}

    function del(obj, id) {
	$.ajax({
			type: 'POST',
			url: 'sh_delete/',
            data:{'id':id},
			dataType: 'json',
			success: function(data){
				$(obj).parents("tr").remove();
				 window.location.href="../../historyPage/1/"
			},
			error:function(data) {
				console.log(data.msg);
			},
	})
}


})