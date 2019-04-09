$(document).ready(function () {
    var stock = document.getElementById("stock")
    var startTime = document.getElementById("startTime")
    var endTime = document.getElementById("endTime")



    stock.addEventListener("focus", function(){
         $.post("/showStock/", function(data) {
             if (data.status == "success") {
                 for (var i = 0; i < data.data.length; i++) {
                     var option = document.createElement("option");
                     option.text = data.data[i].code
                     option.value = data.data[i].code
                     stock.options.add(option);
                 }
             }


        })

    },false)



    startTime.addEventListener("blur", function(){
        instr = this.value
        if (instr.length != 6){
            codeerr.style.display = "block"
            return
        }

        $.post("/checkCode/", {"code":instr}, function(data){
            if (data.status == "error"){
                checkerr.style.display = "block"
            }
        })
    },false)




})