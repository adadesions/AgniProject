function clickUploadImage() {
    $('#upload-input').trigger('click')
}

function changingUploadInput() {
    var upload_btn = $('#upload-submit-btn')
    var upload_form = $('#upload-form')
    upload_form.ajaxSubmit(function(){
        console.log("OK")
    })
}

$('#upload-input').change(changingUploadInput)

  