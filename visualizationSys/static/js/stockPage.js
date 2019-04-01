$(document).ready(function () {

    $("#btn-group ul li a").click(function () {
        console.log("**********")
        console.log($(this).innerText)
        $("#btn-group button").innerText = $(this).innerText
    })














})