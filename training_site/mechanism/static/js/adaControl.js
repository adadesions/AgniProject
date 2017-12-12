var upload_input = $('#id_file')
var upload_filname = $('#id_filename')

function clickUploadImage() {
    upload_input.trigger('click')
}

function clickClearBtn() {
    upload_input.val('')
    upload_filname.val('-')
}

function changingUploadInput() {
    let filepath = $('#id_file').val().split("\\")
    let filename = filepath[2]
    upload_filname.val(filename)
    $('#upload_form').ajaxSubmit(function(data){
        $('#workspace').load('/training/imageview/'+filename)
    })
}

// Events Handler
upload_input.change(changingUploadInput)

  