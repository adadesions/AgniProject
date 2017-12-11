var upload_input = $('#id_file')

function clickUploadImage() {
    upload_input.trigger('click')
}

function changingUploadInput() {
    $('#upload_form').ajaxSubmit(function(data){
        console.log(data)
        $('#file_name').val(data.filename)
    })
}

upload_input.change(changingUploadInput)

  