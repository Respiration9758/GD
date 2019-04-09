$(document).ready(function(){
    var code = document.getElementById("code")
    var codeerr = document.getElementById("codeerr")
    var checkerr = document.getElementById("checkerr")



    code.addEventListener("focus", function(){
        codeerr.style.display = "none"
        checkerr.style.display = "none"
    },false)
    code.addEventListener("blur", function(){
        instr = this.value
        if (instr.length != 6){
            codeerr.style.display = "block"
            return
        }

        $.post("/checkCode/", {"code":instr}, function(data){
            if (data.status == "success"){

            }
        })
    },false)

    // $('#code').focus(function () {
    //     $('#codeerr').attr("style","{display:none}")
    //     $('#checkerr').attr("style","{display:none}")
    // })
    //
    // $('#code').blur(function () {
    //     instr = $(this).val()
    //
    //     if (instr.length < 6 || instr.length > 6){
    //         $('#codeerr').attr("style","{display:block}")
    //         return
    //     }
    //
    //     $.post("/checkCode/", {"code":instr}, function(data){
    //         if (data.status == "error"){
    //             $('#checkerr').attr("style","{display:block}")
    //         }
    //     })
    // })

})