(function ($) {

    //全局默认参数
    var defaults =
    {
        dlsUrl: DOWNLOADURL.replace("/download/", ""), //dls地址
        width: 850,//单位px
        height: 700,//单位px
        mode: "auto" //auto-自动选择 flash-用flash插件展示 online-用浏览器自带pdf查看功能展示
    },
    //FlexPaper默认参数
    flashDefaults =
    {
        Scale : 1,
        ZoomTransition : 'easeOut',
        ZoomTime : 0.5,
        ZoomInterval : 0.2,
        FitPageOnLoad : false,
        FitWidthOnLoad : true,
        FullScreenAsMaxWindow : false,
        ProgressiveLoading : false,
        MinZoomSize : 0.2,
        MaxZoomSize : 5,
        SearchMatchAll : false,
        InitViewMode : 'Portrait',
        ViewModeToolsVisible : true,
        ZoomToolsVisible : true,
        NavToolsVisible : true,
        CursorToolsVisible : true,
        SearchToolsVisible : true,
        localeChain: 'zh_CN'
    },
    methods =
    {
        init: function (options) {
            options = $.extend({}, defaults, options);
            if(tools.selectMode(options) == "flash")
            {
                return this.each(function() {
                    methods.initFlexPaper.apply(this, [options]);
                })
            }
            else
            {
                return this.each(function() {
                    methods.initOnlineViewer.apply(this, [options]);
                })
            }
        },
        initFlexPaper: function(options)
        {
            var $this = $(this);
            //生成未安装flash提示内容
            tools.noFlashPrompt($this);

            $this.css({width: options.width + "px", height:  options.height + "px"})

            new FlexPaperViewer(
                CONTEXT_PATH + '/js/flexpaper/FlexPaperViewerTwV1',
                $this.attr("id"),
                {
                    config : $.extend({}, flashDefaults, options.config, {
                        SwfFile: encodeURIComponent(tools.buildDlsConvertedFilePath(options, "swf")),
                    })
                }
            );
        },
        initOnlineViewer: function(options)
        {
            var onlineViewURL = null;
            if(typeof OFFICE2PDF_URL!="undefined" && $.trim(OFFICE2PDF_URL)!="" && OFFICE2PDF_URL!="null")
            {//配置了office2pdf转换地址，则直接在office2pdf查看
                var file = {};
                if(options.fileId)
                {
                    file.srcFileId = options.fileId;
                }
                if(options.filePath)
                {
                    file.srcFilePath = options.filePath;
                }
                file.srcFileDownloadURL = options.dlsUrl;
                file.srcFileMd5 = options.fileMd5;
                file.fileName = options.fileName;
                file.srcFileURL = options.dlsUrl + file.srcFilePath;
                var json = encodeURIComponent(JSON.stringify(file));

                onlineViewURL = OFFICE2PDF_URL + "/viewer/view?fileJson="+json;
            }
            else
            {//否则在dls查看
                onlineViewURL = tools.buildDlsConvertedFilePath(options, "pdf");
            }
            $(this).append("<iframe src='" + onlineViewURL + "' width='" + options.width + "' height='" + options.height + "' style='border:none'></iframe>");
        }
    },
    tools =
    {
        selectMode: function(options)
        {
            if(options.mode=="auto")
            {
                //如果是IE8
                if(/(msie\s|trident.*rv:)([\w.]+)/.test(navigator.userAgent.toLowerCase()) && !!document.documentMode
                    && document.documentMode<9)
                {
                    return "flash";
                }
                else
                {
                    return "online";
                }
            }
            return options.mode;
        },
        //用户为安装flash插件时的提示
        noFlashPrompt: function($obj)
        {
            $obj.append("<p>View this page in your browser demand install Flash Player 10.0.0 or higher version of the plug-in</p>");
            $obj.append("<a href='javascript: void(0)' onclick='window.location.href=\"http://www.adobe.com/go/getflashplayer\"'><img src='" + CONTEXT_PATH + "/js/mediaplayer/get_flash_player.gif'/></a>");
        },
        //构建dls查看转换后文档访问地址
        buildDlsConvertedFilePath: function(options, convertSuffix)
        {
            var url = options.dlsUrl;
            if(convertSuffix=="swf")
            {
                url += "/servlet/downloadSwf?convertSuffix=" + convertSuffix;
            }
            else
            {
                url += "/pdf/viewer.jsp?convertSuffix=" + convertSuffix;
            }

            if($.trim(options.fileId))
            {
                url += "&fileId=" + $.trim(options.fileId);
            }

            if($.trim(options.filePath))
            {
                url += "&localPath=" + $.trim(options.filePath);
            }

            if($.trim(options.fileMD5))
            {
                url += "&fileMd5=" + $.trim(options.fileMD5);
            }
            return url;
        }
    };


    $.fn.docViewer = function (options) {
        var method = null;
        if (typeof arguments[0]=="string") {
            method = methods[arguments[0]];
            options = arguments[1];
        }
        else {
            method = methods.init;
        }
        return method.apply(this, [options]);
    }
})(jQuery);