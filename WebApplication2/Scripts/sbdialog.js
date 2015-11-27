(function ($) {

    var methods = {},
    defaults = {
        width: "400px",
        height: "300px",
        title: "",
        expanded: false,
        visibility: false,
        content: "",
        ajaxUrl: '',
        opened: function () { },
        closing: function () { },
        closed: function () { }
    };


    $.fn.ssdialog = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exists.');
        }
    };


    function expand(obj) {
        var pluginData = obj.data('ssdialog');
        obj.find('.dialogdetail').css({ 'width': '100%', 'height': '100%', 'top': 0, 'left': 0, 'margin-left': 0, 'margin-top': 0 });
        obj.find('.cnt').height(obj.find('.dialogdetail').height() - obj.find('.dialog-topLine').height());
        pluginData.expanded = true;
        obj.data('ssdialog', pluginData);
    }

    function collapse(obj) {
        var pluginData = obj.data('ssdialog');
        var width = pluginData.width;
        var height = pluginData.height;
        obj.find('.dialogdetail').css({ 'width': width, 'height': height, 'top': '50%', 'left': '50%', 'margin-left': -width / 2, 'margin-top': -height / 2 });
        obj.find('.cnt').height(obj.find('.dialogdetail').height() - obj.find('.dialog-topLine').height());
        pluginData.expanded = false;
        obj.data('ssdialog', pluginData);
    }

    function toggleExpand(obj) {
        var pluginData = obj.data('ssdialog');
        if (pluginData.expanded === false)
            expand(obj);
        else
            collapse(obj);
    }

    function open(obj) {
        var pluginData = obj.data('ssdialog');
        obj.show();
        pluginData.visibility = true;
        obj.data('ssdialog', pluginData);
    }

    function close(obj) {
        var pluginData = obj.data('ssdialog');
        obj.hide();
        pluginData.visibility = false;
        obj.data('ssdialog', pluginData);
    }

    function setTitle(obj, title) {
        var pluginData = obj.data('ssdialog');
        pluginData.title = title;
        obj.find('.header_dialog').html(title);
        obj.data('ssdialog', pluginData);
    }



    function loadContent(obj, params) {
        var pluginData = obj.data('ssdialog');
        if (params) {
            pluginData.ajaxParams = params;
            obj.data('ssdialog', pluginData);
        }

        $.ajax({
            url: pluginData.ajaxUrl,
            type: "Post",
            dataType: "html",
            contentType: 'application/json',
            data: JSON.stringify(pluginData.ajaxParams),
            beforeSend: function () {
               // obj.find('.cnt').html('<div style="height:325px;text-align: center;"><img src="/Images/loading_icon.gif" /></div>');
            },
            complete: function () {
                // $(".loadingPhoto").hide();
            },
            success: function (data) {
                obj.find('.cnt').html($(data));
            },
            error: function () {
                alert('სისტემური შეცდომა');
            }
        });
    }

    methods.init = function (options) {
        options = $.extend({}, defaults, options); //Apply on all selected elements
        return this.each(function () {
            var obj = $(this), data = obj.data('ssdialog');
            if (!data) {
                obj.data('ssdialog', options);
                obj.find(".dialogdetail").draggable({ handle: ".dialog-topLine" });
                obj.find('.header_dialog').html(options.title);
                obj.find('.dialog-maximizeButton').on('click', function () {
                    toggleExpand(obj);
                });
                obj.find('.dialog-closeButton').on('click', function () {
                    methods.close.apply(obj);
                });
                if (options.ajaxUrl === '') {
                    obj.find('.cnt').html(options.content);
                }
                if (options.visibility === true) {
                    methods.open.apply(obj);
                }
            }
        });
    };

    methods.open = function (params) {
        return this.each(function () {
            var $this = $(this), pluginData = $this.data('ssdialog');

            //Check if plugin is initialized
            if (pluginData) {
                if (pluginData.ajaxUrl !== '')
                    loadContent($this, params);
                open($this);
                if (pluginData.expanded === true)
                    expand($this);
                else
                    collapse($this);
                if (typeof pluginData.opened == 'function') {
                    pluginData.opened.call(this);
                }
            }
        });
    };


    methods.close = function () {
        return this.each(function () {
            var $this = $(this), pluginData = $this.data('ssdialog');
            //Check if plugin is initialized
            if (pluginData) {
                if (typeof pluginData.closing == 'function') {
                    var res = pluginData.closing.call(this);
                    if (res === false) return;
                }
                close($this);
                if (typeof pluginData.closed == 'function') {
                    pluginData.closed.call(this);
                }
            }
        });
    };

    methods.title = function (param) {
        return this.each(function () {
            var $this = $(this), pluginData = $this.data('ssdialog');

            //Check if plugin is initialized
            if (pluginData) {
                setTitle($this, param);
            }
        });
    };

    methods.refresh = function (params) {
        return this.each(function () {
            var $this = $(this), pluginData = $this.data('ssdialog');
            //Check if plugin is initialized
            if (pluginData && pluginData.ajaxUrl !== '') {
                loadContent($this, params);
            }
        });
    };



})(jQuery);
