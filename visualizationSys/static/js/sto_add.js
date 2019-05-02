$(document).ready(function(){
    var code = document.getElementById("code")
    var codeerr = document.getElementById("codeerr")
    var checkerr = document.getElementById("checkerr")



    code.addEventListener("focus", function(){
        codeerr.style.display = "none"
        checkerr.style.display = "none"
    },false)


    code.addEventListener("blur", function(){
        var instr = this.value
        var reg = /^\d{6}\b/;
        if (!reg.test(instr)){
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