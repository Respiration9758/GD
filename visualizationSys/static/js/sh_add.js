$(document).ready(function () {
    var stock = document.getElementById("stock")
    var startTime = document.getElementById("startTime")
    var endTime = document.getElementById("endTime")



    stock.addEventListener("dblclick", function(){
         $.get("/showStock/","json", function(data) {
             data =  $.parseJSON( data )
              stock.options.length=0
             console.log(data)

             $.each(data,function (i,item) {
                 // output.push('<option value="'+ item.code +'">'+ item.code+'-'+item.name +'</option>')
                  var option = document.createElement("option");
                     option.text = item.code +'-'+ item.name
                     option.value = item.code
                     stock.options.add(option)
             })

             // $('#stock').html(output.join(''));

             })




                 // for (var i = 0; i < data.data.length; i++) {
                 //
                 // }


    },false)


    $("#stock").change(function() {
        var options=$("option:selected").val()

        $("#stock").val(options)

    })



    startTime.addEventListener("blur", function(){
        instr = this.value

        dateFormat =/^(\d{4})-(\d{2})-(\d{2})$/
        if(dateFormat.test(instr)){

            $('#endTime').attr("min",""+instr)
        }


    },false)




})