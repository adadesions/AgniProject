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
    $('#upload_form').ajaxSubmit(function(data){
        upload_filname.val(data.filename)
    })
}

upload_input.change(changingUploadInput)

  