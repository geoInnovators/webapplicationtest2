﻿(function ($) {

    // TODO: add custom buttons 
    var methods = {},
    defaults = {
        tabsize: 'normal',  // large,normal,small
        activeIndex: 0,
        firstTabVisible: true,
        refreshOnInit: false, // გვერდის ჩატვირთვისას ჩაიტვირთოს თუ არა
        role: 'normal',  // normal,edit,create,path
        // aftercancelCreate  --> function
        // afterCreate  --> function
        tabs: [
            {
                title: '',
                isActive: true,
                content: '',  // content , როცა ajaxUrl არ არის მითითებული
                hasEdit: true // role : edit-ის დროს აქვს თუ არა edit როლი
                // createContent  // ახლის შექმნისას გვერდი, როცა createAjaxUrl  არ არის მითითებული
                // viewName    --> views saxeli
                // ajaxUrl       --> refresh-ის მისამართი
                // createAjaxUrl       --> create refresh-ის მისამართი
                // ajaxParams    --> refresh-ის პარამეტრები
                // createAjaxParams --> refresh-ის პარამეტრები
                // ajaxCreateUrl       --> ახალი ჩანაწერების refresh-ის მისამართი
                // ajaxCreateParams    --> ახალი ჩანაწერების refresh-ის პარამეტრები
                // confirmSave   --> შენახვისას ამოვიდეს თუ არა შეკითხვა
                // afterRefresh   --> ფუნქცია ჩატვირთვის მერე
                // createAfterRefresh  --> ფუნქცია ახალი(შესაქმნელი) ობიექტის ჩატვირთვის მერე
                // isEditable  --> role=edit-ის დროს რეჟიმი
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



    function updateButtonsVisibility(obj) {
        var pluginData = obj.data('sbtab');
        var index = pluginData.activeIndex;
        var activeTab = pluginData.tabs[index];
        obj.find('.tab-ftr').find('.btn').hide();
        if (!activeTab.hasEdit) {
            return;
        }
        if (pluginData.role === 'edit') {
            if (activeTab.isEditable) {
                obj.find('.tab-ftr').find('.tab-btn-save').show();
                obj.find('.tab-ftr').find('.tab-btn-cancel').show();
            } else {
                obj.find('.tab-ftr').find('.tab-btn-edit').show();
            }
            return;
        }
        if (pluginData.role === 'create') {
            obj.find('.tab-ftr').find('.tab-btn-create-cancel').show();
            if (index > 0)
                obj.find('.tab-ftr').find('.tab-btn-prev').show();
            else
                obj.find('.tab-ftr').find('.tab-btn-prev').hide();

            if (index < pluginData.tabs.length - 1)
                obj.find('.tab-ftr').find('.tab-btn-next').show();
            else
                obj.find('.tab-ftr').find('.tab-btn-next').hide();

            if (index === pluginData.tabs.length - 1)
                obj.find('.tab-ftr').find('.tab-btn-create').show();
            else
                obj.find('.tab-ftr').find('.tab-btn-create').hide();
        }
    }


    ///////// refresh, edit, cancel, save /////////
    function afterRefreshCall(obj) {
        var pluginData = obj.data('sbtab');
        var cnt = obj.find('.tab-cnt');
        var index = pluginData.activeIndex;
        var activeTab = pluginData.tabs[index];
        if (activeTab.afterRefresh) {
            activeTab.afterRefresh.call(cnt[0]);
        }
        else if (activeTab.viewName) {
            var fn = window[activeTab.viewName + '_afterRefresh'];
            if (typeof fn === "function")
                fn(cnt, activeTab.isEditable);
            fn = window[activeTab.viewName + '_customButtons'];
            if (typeof fn === "function") {
                var buttons = fn(cnt, activeTab);
                for (var button in buttons) {
                    
                }
            }
        }
    }

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
                data: JSON.stringify($.extend(activeTab.ajaxParams, { 'isEditable': activeTab.isEditable })),
                beforeSend: function () {
                    // obj.find('.cnt').html('<div style="height:325px;text-align: center;"><img src="/Images/loading_icon.gif" /></div>');
                    // TODO: show loading
                },
                complete: function () {
                    // $(".loadingPhoto").hide();
                    // TODO: hide loading
                },
                success: function (data) {
                    cnt.html($(data));
                    afterRefreshCall(obj);
                },
                error: function () {
                    // TODO: show error
                }
            });
        } else {
            cnt.html(activeTab.content);
        }
        obj.data('sbtab', pluginData);
    }

    function editTab(obj) {
        var pluginData = obj.data('sbtab');
        var activeTab = pluginData.tabs[pluginData.activeIndex];
        activeTab.isEditable = true;
        obj.data('sbtab', pluginData);
        updateButtonsVisibility(obj);
        refresh(obj);
    }

    function cancelSaveTab(obj) {
        var pluginData = obj.data('sbtab');
        var activeTab = pluginData.tabs[pluginData.activeIndex];
        activeTab.isEditable = false;
        obj.data('sbtab', pluginData);
        updateButtonsVisibility(obj);
        refresh(obj);
    }

    function saveTab(obj) {
        var pluginData = obj.data('sbtab');
        var activeTab = pluginData.tabs[pluginData.activeIndex];
        var cnt = obj.find('.tab-cnt');
        var ajaxParams = $.extend({
            beforeSend: function () {
                // $('#cnt3').html('<div style="height:325px;text-align: center;"><img src="/Images/loading_icon.gif" /></div>');
                // TODO: show loading
            },
            complete: function () {
                // $(".loadingPhoto").hide();
                // TODO: hide loading
            },
            success: function (data) {
                cancelSaveTab(obj);
            },
            error: function () {
                // TODO: show error
            }
        }, window[activeTab.viewName + '_initSaveAjaxParams'](cnt));

        if (activeTab.confirmSave)
            sbconfirm(activeTab.confirmSave, function () {
                $.ajax(ajaxParams);
            });
        else
            $.ajax(ajaxParams);
    }
    ///////////////////////////////////////////////


    ///////// refreshCreate,  next, prev, Finish, cancel //////
    function createAfterRefreshCall(obj) {
        var pluginData = obj.data('sbtab');
        var cnt = obj.find('.tab-cnt');
        var index = pluginData.activeIndex;
        var activeTab = pluginData.tabs[index];
        if (activeTab.createAfterRefresh) {
            activeTab.createAfterRefresh.call(cnt[0]);
        }
        else if (activeTab.viewName) {
            var fn = window[activeTab.viewName + '_afterCreateRefresh'];
            if (typeof fn === "function")
                fn(cnt); // TODO: გასატესტია
        }
    }

    function createRefresh(obj) {
        var pluginData = obj.data('sbtab');
        var cnt = obj.find('.tab-cnt');
        var index = pluginData.activeIndex;
        var activeTab = pluginData.tabs[index];
        if (activeTab.createAjaxUrl) {
            $.ajax({
                url: pluginData.createAjaxUrl,
                type: "Post",
                dataType: "html",
                contentType: 'application/json',
                data: JSON.stringify(activeTab.createAjaxParams),
                beforeSend: function () {
                    // obj.find('.cnt').html('<div style="height:325px;text-align: center;"><img src="/Images/loading_icon.gif" /></div>');
                    // TODO: show loading
                },
                complete: function () {
                    // $(".loadingPhoto").hide();
                    // TODO: hide loading
                },
                success: function (data) {
                    cnt.html($(data));
                    createAfterRefreshCall(obj);

                    updateButtonsVisibility(obj);

                },
                error: function () {
                    // TODO: show error
                }
            });
        } else {
            cnt.html(activeTab.createContent);
        }
        obj.data('sbtab', pluginData);
    }

    function createCancel(obj) {
        var pluginData = obj.data('sbtab');
        pluginData.aftercancelCreate.apply(obj[0]);
    }

    function createTab(obj) {
        var pluginData = obj.data('sbtab');
        var activeTab = pluginData.tabs[pluginData.activeIndex];
        var cnt = obj.find('.tab-cnt');
        var ajaxParams = $.extend({
            beforeSend: function () {
                // $('#cnt3').html('<div style="height:325px;text-align: center;"><img src="/Images/loading_icon.gif" /></div>');
                // TODO: show loading
            },
            complete: function () {
                // $(".loadingPhoto").hide();
                // TODO: hide loading
            },
            success: function (data) {
                if (pluginData.activeIndex === pluginData.tabs.length - 1) {
                    pluginData.afterCreate.apply(obj[0]);
                } else {
                    pluginData.activeIndex = pluginData.activeIndex + 1;
                    obj.data('sbtab', pluginData);
                    createRefresh(obj);
                }
            },
            error: function () {
                // TODO: show error
            }
        }, window[activeTab.viewName + '_initCreateAjaxParams'](cnt));

        if (activeTab.confirmSave)
            sbconfirm(activeTab.confirmSave, function () {
                $.ajax(ajaxParams);
            });
        else
            $.ajax(ajaxParams);
    }

    function createPrevTab(obj) {
        var pluginData = obj.data('sbtab');
        pluginData.activeIndex = pluginData.activeIndex - 1;
        obj.data('sbtab', pluginData);
        createRefresh(obj);
    }
    ///////////////////////////////////////////////////////////

    ///////// gotoIndex, gofirst, golast ////////////
    function gotoIndex(obj, index) {
        var pluginData = obj.data('sbtab');
        pluginData.activeIndex = index;
        var activeTab = pluginData.tabs[index];
        activeTab.isEditable = false;
        var lis = obj.find('.tab-ul').find('li');
        lis.removeClass('tab-active');
        $(lis[index]).addClass('tab-active');

        if (pluginData.role === 'path') {
            var count = pluginData.tabs.length - index - 1;
            pluginData.tabs.splice(index + 1, count);
            for (var i = 0; i < count; i++) {
                obj.find('.tab-ul').find('li:last').remove();
            }
        }
        obj.data('sbtab', pluginData);
        updateButtonsVisibility(obj);
        refresh(obj);

    }

    function gotoFirst(obj) {
        gotoIndex(obj, 0);
    }

    function gotoLast(obj) {
        var pluginData = obj.data('sbtab');
        gotoIndex(obj, pluginData.tabs.length -1);
    }
    /////////////////////////////////////////////////
    function updateTabHeadersVisibility(obj) {
        if ((options.tabs.length === 1) && !firstTabVisible)
            obj.find('.tab-li').hide();
        else {
            obj.find('.tab-li').show();
        }
    }

    function addNewTab(obj, tabParams) {
        var pluginData = obj.data('sbtab');
        var newTab = $.extend({}, defaults.tabs[0], tabParams);
        pluginData.tabs.push(newTab);
        obj.data('sbtab', pluginData);
        var li = $('<li class="tab-li"></li>');
        li.html(newTab.title);
        obj.find('.tab-ul').append(li);
        li.on('click', function () {
            gotoIndex(obj, pluginData.tabs.length-1 ); 
        });
        updateTabHeadersVisibility(obj);
    }

    function removeTab(obj, index) {

        var pluginData = obj.data('sbtab');
        pluginData.tabs.splice(index, 1);

        obj.find('.tab-ul').find('li:last').remove();
        if (pluginData.activeIndex >= index) {
            pluginData.activeIndex = pluginData.activeIndex - 1;
        }
        var lis = obj.find('.tab-ul').find('li');
        var i;
        for (i = 0; i < lis.length; i++) {
            var li = $(lis[i]);
            li.on('click', function () {
                gotoIndex(obj, i); // TODO: gasatestia
            });
        }
        obj.data('sbtab', pluginData);
        gotoIndex(obj, pluginData.activeIndex);
        updateTabHeadersVisibility(obj);
    }

    function setTitle(obj, title) {
        var pluginData = obj.data('ssdialog');
        pluginData.title = title;
        obj.find('.header_dialog').html(title);
        obj.data('ssdialog', pluginData);
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
                    // check active state
                    if (options.tabs[i].isActive) {
                        options.activeIndex = i;
                        li.addClass('tab-active');
                    }
                    var index = i;
                    if (options.role !== 'create') {
                        li.on('click', function() {
                            gotoIndex(obj, index); // TODO: gasatestia
                        });
                    }
                }

                if (options.role === 'edit') {
                    obj.find('.tab-ftr').find('.btn').hide();
                    obj.find('.tab-ftr').find('.tab-btn-edit').on('click', function () {
                        editTab(obj);
                    });
                    obj.find('.tab-ftr').find('.tab-btn-save').on('click', function () {
                        saveTab(obj);
                    });
                    obj.find('.tab-ftr').find('.tab-btn-cancel').on('click', function () {
                        cancelSaveTab(obj);
                    });
                }
                if (options.role === 'create') {
                    obj.find('.tab-ftr').find('.btn').hide();
                    obj.find('.tab-ftr').find('.tab-btn-next').on('click', function () {
                        createTab(obj);
                    });
                    obj.find('.tab-ftr').find('.tab-btn-prev').on('click', function () {
                        createPrevTab(obj);
                    });
                    obj.find('.tab-ftr').find('.tab-btn-create').on('click', function () {
                        createTab(obj);
                    });
                    obj.find('.tab-ftr').find('.tab-btn-create-cancel').on('click', function () {
                        createCancel(obj);
                    });
                }
                
                updateTabHeadersVisibility(obj);

                if (refreshOnInit) {
                    gotoFirst(obj);
                }
            }
        });
    };

    methods.goto = function (index) {
        return this.each(function () {
            var $this = $(this);
            gotoIndex($this, index);
        });
    };

    methods.gotoFirst = function () {
        return this.each(function () {
            var $this = $(this);
            gotoFirst($this);
        });
    };

    methods.gotoLast = function () {
        return this.each(function () {
            var $this = $(this);
            gotoLast($this);
        });
    };

    methods.addNewTab = function (params) {
        return this.each(function () {
            var $this = $(this);
            addNewTab($this, params);
        });
    };

    methods.removeTab = function (index) {
        return this.each(function () {
            var $this = $(this);
            removeTab($this, index);
        });
    };

    methods.setTitle = function (title) {
        return this.each(function () {
            var $this = $(this);
            setTitle($this, title);
        });
    };

    methods.updateSettings = function (options) {
        return this.each(function () {
            var $this = $(this), pluginData = $this.data('sbtab');
            $.extend(pluginData, options);
            $this.data('sbtab', pluginData);
        });
    };

    methods.updateTabSettings = function (index, options) {
        return this.each(function () {
            var $this = $(this), pluginData = $this.data('sbtab');
            $.extend(pluginData.tabs[index], options);
            $this.data('sbtab', pluginData);
        });
    };

})(jQuery);
