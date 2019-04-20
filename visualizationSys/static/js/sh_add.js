$(document).ready(function () {
    var stock = document.getElementById("stock")
    var startTime = document.getElementById("startTime")
    var endTime = document.getElementById("endTime")

    $(function () {

        $(".selectpicker").selectpicker({
            noneSelectedText : '请选择股票代码及名称'
        })

    $(window).on('load', function() {
        $('.selectpicker').selectpicker('val', '');
        $('.selectpicker').selectpicker('refresh');
    })

    //下拉数据加载
    $.ajax({
        type : 'get',
        url : '/showStock/',
        dataType : 'json',
        success : function(datas) {//返回list数据并循环获取
            datas =  $.parseJSON( datas )


            var select = $("#stock");
            for (var i = 0; i < datas.length; i++) {
                select.append("<option value='"+datas[i].code +"'>"
                    +datas[i].code+'-'+datas[i].name + "</option>");
            }
            $('.selectpicker').selectpicker('val', '');
            $('.selectpicker').selectpicker('refresh');
        }
    })

    })



    // stock.addEventListener("dblclick", function(){
    //      $.get("/showStock/","json", function(data) {
    //          data =  $.parseJSON( data )
    //           stock.options.length=0
    //          console.log(data)
    //
    //          $.each(data,function (i,item) {
    //              // output.push('<option value="'+ item.code +'">'+ item.code+'-'+item.name +'</option>')
    //               var option = document.createElement("option");
    //                  option.text = item.code +'-'+ item.name
    //                  option.value = item.code
    //                  stock.options.add(option)
    //          })
    //
    //          // $('#stock').html(output.join(''));
    //
    //          })
    //
    //
    //
    //
    //              // for (var i = 0; i < data.data.length; i++) {
    //              //
    //              // }
    //
    //
    // },false)
    // $("#stock").change(function() {
    //     var options=$("option:selected").val()
    //
    //     $("#stock").val(options)
    //
    // })



    startTime.addEventListener("blur", function(){
        instr = this.value

        dateFormat =/^(\d{4})-(\d{2})-(\d{2})$/
        if(dateFormat.test(instr)){

            $('#endTime').attr("min",""+instr)
        }


    },false)




})