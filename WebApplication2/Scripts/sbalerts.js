function sbconfirm(question, func) {
    var alert = $('.template-containers').find('.alert-popup').clone();
    alert.appendTo('body');
    alert.find('.question').html(question);
    alert.find('.btn-success').on('click', function () {
        alert.remove();
        func();
    });
    alert.find('.btn-danger').on('click', function () {
        alert.remove();
    });
}

function sbsuccess(text, fadeout) {
    var alert = $('.template-containers').find('.success-popup').clone();
    alert.appendTo('body');
    alert.find('.success-text').html(text);
    if (fadeout) {
        alert.find('.alert-buttons').hide();
        setTimeout(function () {
            alert.find(".alertDialog").fadeOut("slow", function () {
                alert.remove();
            });
        }, 3000);
    } else {
        alert.find('.btn-success').on('click', function () {
            alert.remove();
        });
    }
}

function sberror(text) {
    var alert = $('.template-containers').find('.error-popup').clone();
    alert.appendTo('body');
    alert.find('.error-text').html(text);
    alert.find('.btn-danger').on('click', function () {
        alert.remove();
    });

}