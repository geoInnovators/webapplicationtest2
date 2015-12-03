(function ($) {

    var methods = {},
    defaults = {
        tabsize: 'normal',  // large,normal,small
        activeIndex: 0,
        firstVisible: true,
        tabAutoRefresh: false,
        // tabAjaxParams
        refreshOnInit: false,
        role: 'normal',  // normal,edit,create,path
        confirmDialogs: true,
        tabs: [
            {
                index: 0,
                title: '',
                isActive: true,
                content: ''  // ajaxurl an content, ajaxParams
                // ajaxUrl
                // ajaxParams
                // autoRefresh
                // isEditable
                // confirmSave
            }
        ]
    };


    $.fn.sbtab = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exists.');
        }
    };



    function refresh(obj) {
        var pluginData = obj.data('sbtab');
        var cnt = obj.find('.tab-cnt');
        var index = pluginData.activeIndex;
        var activeTab = pluginData.tabs[index];
        if (activeTab.ajaxUrl) {
            $.ajax({
                url: pluginData.ajaxUrl,
                type: "Post",
                dataType: "html",
                contentType: 'application/json',
                data: JSON.stringify(activeTab.ajaxParams),
                beforeSend: function () {
                    // obj.find('.cnt').html('<div style="height:325px;text-align: center;"><img src="/Images/loading_icon.gif" /></div>');
                },
                complete: function () {
                    // $(".loadingPhoto").hide();
                },
                success: function (data) {
                    cnt.html($(data));
                },
                error: function () {
                    alert('სისტემური შეცდომა');
                }
            });
        } else {
            cnt.html(activeTab.content);
        }
        obj.data('sbtab', pluginData);
    }

    function gotoIndex(obj, index  ) {
        
    }

    function setTitle(obj, title) {
        var pluginData = obj.data('ssdialog');
        pluginData.title = title;
        obj.find('.header_dialog').html(title);
        obj.data('ssdialog', pluginData);
    }


    function editTab(obj) {
        var pluginData = obj.data('sbtab');
        var activeTab = pluginData.tabs[pluginData.activeIndex];
        activeTab.isEditable = true;
        obj.data('sbtab', pluginData);
        refresh(obj);
    }

    function saveTab(obj) {
        var pluginData = obj.data('sbtab');
        var activeTab = pluginData.tabs[pluginData.activeIndex];
        sbconfirm(activeTab.confirmSave, function () {
            // save logika
        });


        refresh(obj);
    }

    function cancelSaveTab(obj) {
        var pluginData = obj.data('sbtab');
        var activeTab = pluginData.tabs[pluginData.activeIndex];
        activeTab.isEditable = false;
        obj.data('sbtab', pluginData);
        refresh(obj);
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
////////////////////////////////////////////////////////////////////////////////////
    methods.init = function (options) {
        options = $.extend({}, defaults, options); //Apply on all selected elements
        return this.each(function () {
            var obj = $(this), data = obj.data('sbtab');
            if (!data) {
                //obj.data('sbtab', options);
                // check tab size
                if (options.tabsize == 'large')
                    obj.find('.tab-ul').addClass('tab-lg');
                if (options.tabsize == 'small')
                    obj.find('.tab-ul').addClass('tab-sm');
                // constructing li-s
                var i;
                for (i = 0; i < options.tabs.length; i++) {
                    var cTab = options.tabs[i];
                    // create li
                    var li = $('<li class="tab-li"></li>');
                    obj.find('.tab-ul').append(li);
                    // set title
                    if (!cTab.title) cTab.title = '';
                    li.html(cTab.title);
                    // set index
                    options.tabs[i].index = i;
                    // check active state
                    if (options.tabs[i].isActive) {
                        options.activeIndex = i;
                        li.addClass('.tab-active');
                    }
                }
                if (options.role === 'edit') {
                    obj.find('.tab-ftr').show();
                    obj.find('.tab-ftr').find('.tab-btn-edit').on('click', function() {
                        editTab(obj);
                    });
                    obj.find('.tab-ftr').find('.tab-btn-save').on('click', function () {
                        saveTab(obj);
                    });
                    obj.find('.tab-ftr').find('.tab-btn-cancel').on('click', function () {
                        cancelSaveTab(obj);
                    });
                }
                // check firstVisible
                if ((options.tabs.length === 1) && !firstVisible)
                    obj.find('.tab-li').hide();

            }
        });
    };

    methods.goto = function (index, params) {
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


    methods.gotoNext = function (index, params) {
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
