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

function drawFace(img_path, control_id) {
    let canvas = $('#canvas_'+control_id)
    let width = canvas.attr('width')
    let height = canvas.attr('height') 
    canvas.drawImage({
        layer: true,
        source: img_path,
        x: width/2,
        y: height/2,
        width,
        height
    })
}

function drawShape(shape_parts, control_id) {
    let canvas = $('#canvas_'+control_id)
    let width = canvas.attr('width')
    let height = canvas.attr('height') 
    canvas.addLayer({
        type: 'rectangle',
        x: width/2, y: height/2,
        width, height
    }).drawLayers()
    radius = 10
    for(p in shape_parts) {
        x = shape_parts[p].x,
        y = shape_parts[p].y
        canvas.drawEllipse({
            layer: true,
            draggable: true,
            fillStyle: '#00FF00',
            width: radius,
            height: radius,
            x,
            y
        })
    }    
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
        let clearCanvas = $('#canvas_'+control_id).clearCanvas()
        drawFace(data.path, control_id)
        drawShape(data.shape_parts, control_id)
    })
}

// Events Handler
var left_upload = $('#upload_form_left').find('#id_file')
var right_upload = $('#upload_form_right').find('#id_file')
left_upload.change(changingUploadInput)
right_upload.change(changingUploadInput)

  