function clickUploadImage(control_id) {
    let upload_input = $('#upload_form_'+control_id).find('#id_file')
    upload_input.trigger('click')
}

function clickClearBtn(control_id) {
    let upload_input = $('#upload_form_'+control_id).find('#id_file')
    let upload_filename = $('#upload_form_'+control_id).find('#id_filename')
    let imageview = $('#imageview_'+control_id)
    upload_input.val('')
    upload_filename.val('-')
    imageview.attr('src', '/static/images/default_imageview.jpg')
}

function changingUploadInput() {
    let control_id = $(this).attr('class')
    let form = $('#upload_form_' + control_id)
    let upload_input = form.find('#id_file')
    let upload_filname = form.find('#id_filename')
    let filepath = upload_input.val().split("\\")
    let filename = filepath[2]
    let workspace = $('#workspace_' + control_id)

    upload_filname.val(filename)
    form.ajaxSubmit(function(data){
        workspace.load('/training/imageview/'+control_id+'/'+filename)
    })
}

// Events Handler
var left_upload = $('#upload_form_left').find('#id_file')
var right_upload = $('#upload_form_right').find('#id_file')
left_upload.change(changingUploadInput)
right_upload.change(changingUploadInput)

  