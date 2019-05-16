// GLOBAL VARIABLE
var APP_ENV = 'dev';

var OFFICE2PDF_URL = 'http://175.6.40.51:8989/office2pdf';
var DOWNLOADURL = 'http://open.teewon.net:9000/'; //Should end with '/'
var ECO_MEDIA_PATH = 'http://open.teewon.net:9000/fs/media';
var CONTEXT_PATH = 'http://{ip:port}/rescloud';
var ENCRYPT_KEY = '8c10cb3089a01210';
var OPENAPI_SERVER = 'http://localhost:8088/ecrapi';
var ECOAPI_SERVER = 'http://open.teewon.net:9000';
var BRANCH_CODE = 'TWSMECR';
var TENANT_ID = "YYDJ001";
var WATERMARKIMG_URL = 'http://ecr.teewon.net/ecrweb/static/images/ecrw-logo.png';

var ECO_APPID = '26fe988bcba34f03b08909f831859586';
var WX_APPID = 'wx521188588bbe75df';
var QQ_APPID = '101517502';

$(document).ready(function () {
    window.onunload = function () {
        window.EventHub.$emit('window-unload');
    };
});
