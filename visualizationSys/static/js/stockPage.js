$(document).ready(function () {


    $("#allChoiceCheckbox").click(function () {
        if ($(this).prop("checked")==true)
            $('.everyCheckbox').prop("checked", true)
        else
            $('.everyCheckbox').prop("checked", false)

    })


    $('#batchDelete').click(function () {
        datadel()
    })


    $('#addData').click(function () {
        window.location.href="../../sto_add/";
    })


    // 批量删除
function datadel() {
	$("input[name='stock']:checked").each(function () {
        del($(this), $(this).val());
    })
}

function del(obj, id) {
	$.ajax({
			type: 'delete',
			url: 'sto_delete/'+id,
			dataType: 'json',
			success: function(data){
				$(obj).parents("tr").remove();
				alert("已删除"+ id + "!")
			    // layer.msg('已删除!'+id,{icon:1,time:1000});
			},
			error:function(data) {
				console.log(data.msg);
			},
	})
}


















})