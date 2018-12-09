var typeId = 268;
var childList = {};
var isMain = {};
var nodeid2name = {};
var nodeid2index = {};
var treeJson = [];
var toggleCount = {};

var editorObj = {};

var pageId = "";
var bcoId = "";


////////////////////////////////
$(document ).ready(function() {


    $('html').animate({scrollTop:0}, 'fast');
    $('body').animate({scrollTop:0}, 'fast');
    handleBackBtn();


    $("#loginformcn").css("display", "none");
    $("#pagelinkcn").css("display", "block");
    $("#pagelinkcn").append('<div id=logout class=pagelink>Logout</div>');
    $("#pagelinkcn").append('<div class=divider>|</div>');
    $("#pagelinkcn").append('<div id=loginmsg class=loginmsg></div>');
    $("#pagelinkcn").append('<div class=divider>|</div>');
    $("#pagelinkcn").append('<div id=tutorial class=pagelink>Tutorial</div>');
    $("#pagelinkcn").append('<div class=divider>|</div>');
    $("#pagelinkcn").append('<div id=home class=pagelink>Home</div>');


    $("#searchboxcn").html(getSearchForm());
    $("#pagecn").html(setHomePage());



});





$(document).on('click', '.pagelink, .createlink, .editlink, .viewlink', function (event) {
    event.preventDefault();
    $('html').animate({scrollTop:0}, 'fast');
    $('body').animate({scrollTop:0}, 'fast');

    pageId = this.id.split("|")[0];


    if(pageId == 'home'){
        setHomePage();
    }
    else if(pageId == 'view'){
        bcoId = this.id.split("|")[1];
        setViewPage();
    }
    else if(pageId == 'edit'){
        setEditPage();
    }
    else if(pageId == 'create'){
        bcoId = "-1";
        setEditPage();
    }
    else if(pageId == 'tutorial'){
        fillStaticHtmlCn("tutorial.html", "#pagecn")
    }

});

$(document).on('click', '.savebco', function (event) {
    event.preventDefault();
    $('html').animate({scrollTop:0}, 'fast');
    $('body').animate({scrollTop:0}, 'fast');
    saveObject();
});

$(document).on('click', '#logout', function (event) {
    event.preventDefault();
    setCookie("sessionid","",-1);
    $('html').animate({scrollTop:0}, 'fast');
    $('body').animate({scrollTop:0}, 'fast');
    logoutUser();
});

$(document).on('click', '#searchbtn', function (event) {
    event.preventDefault();
    $('html').animate({scrollTop:0}, 'fast');
    $('body').animate({scrollTop:0}, 'fast');
    $("#pagecn").html(setHomePage());
});

$(document).on('click', '#login', function (event) {
    event.preventDefault();
    $('html').animate({scrollTop:0}, 'fast');
    $('body').animate({scrollTop:0}, 'fast');
    loginUser();
});


$(document).on('click', '#register', function (event) {
    event.preventDefault();
    $('html').animate({scrollTop:0}, 'fast');
    $('body').animate({scrollTop:0}, 'fast');
    registerUser();
});


function logoutUser(){
    $("#pagelinkcn").html("");
    $("#pagelinkcn").append('<div id=tutorial class=pagelink>Tutorial</div>');
    $("#pagelinkcn").append('<div class=divider>|</div>');
    $("#pagelinkcn").append('<div id=home class=pagelink>Home</div>');
        
    
    $("#searchboxcn").css("display", "none");
    $('html').animate({scrollTop:0}, 'fast');
    $('body').animate({scrollTop:0}, 'fast');
    fillStaticHtmlCn("home.html", "#pagecn");

}


function setHomePage(){
    var inJson = {}
    if ($("#queryfield").val() != undefined){
        var queryField = $("#queryfield").val().trim();
        var queryValue = $("#queryvalue").val().trim();
        inJson = {"svc":"search_objects", "queryfield":queryField, "queryvalue":queryValue};
    }

    
    $("#pagecn").append(getProgressIcon());
    var url = cgiRoot + '/bco_editor';
    var reqObj = new XMLHttpRequest();
    reqObj.open("POST", url, true);
    reqObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    reqObj.onreadystatechange = function() {
        if (reqObj.readyState == 4 && reqObj.status == 200) {
            try {
                resJson = JSON.parse(reqObj.responseText);
                if(resJson["taskstatus"] == 0){
                    var msg = resJson["errormsg"] + '. Please ';
                    msg += '<a id=logout href="">click here</a> to try again, or contact admin if this persists.';
                    $("#pagecn").html(getMessagePanel(msg));
                    return;
                }
                if (resJson["auth"]["status"] != 1){
                    logoutUser();
                    return;
                }
                $("#loginmsg").html('Signed as ' + resJson["auth"]["email"]);
                var s = 'border-bottom:1px solid #ccc;text-align:right;padding:5px;';
                s += 'margin-bottom:20px;';
                var cn = '<div style="'+s+'"><a id=create class="createlink">Create Object</a></div>';
                cn += '<div id=searchresultscn></div>';
                $("#pagecn").html(cn);
                if (resJson["searchresults"].length > 2){
                    var argObj = {"containerid":"searchresultscn", "pagesize":50, "onselect":""};
                    rndrGoogleTable(resJson["searchresults"], argObj);
                }
                else{
                    $("#searchresultscn").html(getMessagePanel("No objects found for your search!"));
                }
            }
            catch(e) {
                $("#pagecn").html(getMessagePanel("setHomePage, please report this error!"));
                console.log(e);
            }
        }
    };
    var postData = 'injson=' + JSON.stringify(inJson);
    reqObj.send(postData);
    console.log(postData);
    return;
}

function setEditPage(){
        
    $("#pagecn").html(getProgressIcon());
    var url = cgiRoot + '/bco_editor';
    var reqObj = new XMLHttpRequest();
    reqObj.open("POST", url, true);
    reqObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    reqObj.onreadystatechange = function() {
    
        if (reqObj.readyState == 4 && reqObj.status == 200) {
            try {
                var resJson = JSON.parse(reqObj.responseText);
                if(resJson["taskstatus"] == 0){
                    var msg = resJson["errormsg"] + '. Please ';
                    msg += '<a id=logout href="">click here</a> to try again, or contact admin if this persists.';
                    $("#pagecn").html(getMessagePanel(msg));
                    return;
                }
                else{
                    readOnly = (resJson["readOnly"] == 1 ? 1 : 0);
                    if(readOnly == 1){
                        var cn = getMessagePanel("You don't have permission to edit this object!");
                        $("#pagecn").html(cn);
                        return;
                    }
                    else{
                        var s = 'border-bottom:1px solid #ccc;text-align:right;padding:5px;';
                        s += 'margin-bottom:20px;';
                        var links = '<a id=view|'+bcoId+' class="viewlink">View Object</a>';
                        var cn = '<div style="'+s+'">'+links+'</div>';
                        var style = 'background:#fff;margin-top:20px;font-size:13px;';
                        cn += '<div id="editor_div" style="'+style+'"></div>';
                        var style = 'background:#f1f1f1;margin:0px 0px 100px 20px;padding:10px;';
                        style += 'text-align:right;width:90%;';
                        var saveBtn = '<input class=savebco type=submit value="Save Changes">';
                        cn += '<div style="'+style+'">'+saveBtn+'</div>';
                        $("#pagecn").html(cn);
                        var schemaObj = JSON.parse(reqObj.responseText);
                        schemaObj["ajax"] = true;
                        editorObj = new JSONEditor(document.getElementById('editor_div'),schemaObj);
                    }
                }
            }
            catch(e) {
                $("#pagecn").html(getMessagePanel("setEditPage, please report this error!"));
                console.log(e);
            }
        }
    };
    
    var postData = 'injson='+JSON.stringify({"svc":"get_object_edit_json", "bcoid":bcoId});
    reqObj.send(postData);
    console.log(postData);
    return;
}


function setViewPage(){
   

    $("#pagecn").html(getProgressIcon());
    var url = cgiRoot + '/bco_editor';
    var reqObj = new XMLHttpRequest();
    reqObj.open("POST", url, true);
    reqObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    reqObj.onreadystatechange = function() {
        if (reqObj.readyState == 4 && reqObj.status == 200) {
            try {
                var s = 'border-bottom:1px solid #ccc;text-align:right;padding:5px;';
                s += 'margin-bottom:20px;';
                var links = '<a id=edit class="editlink">Edit Object</a>';
                var cn = '<div style="'+s+'">'+links+'</div>';
                cn += '<DIV style="padding:20px 0px 0px 20px;"><pre style="white-space:pre-wrap;">';
                cn += reqObj.responseText + '</pre></DIV>';
                $("#pagecn").html(cn);
            }
            catch(e) {
                $("#pagecn").html(getMessagePanel("setViewPage, please report this error!"));
                console.log(e);
            }
        }
    };
    var postData = 'injson='+JSON.stringify({"svc":"get_object_view_json", "bcoid":bcoId});
    reqObj.send(postData);
    console.log('request='+postData);
    return;
}

function getProgressIcon(){
    var imgUrl = htmlRoot + '/imglib/ajaxloader.gif';
    var imgObj = '<img src="'+imgUrl+'" style="width:100%;opacity:1.0;">';
    var cn = '<div class=progresswrapper id=progresswrapper><div class=progresscn id=progresscn>';
    cn += '<table align=center border=0><tr><td valign=middle align=center>'+imgObj+'</td></tr></table>';
    cn += '</div></div>';
    return cn;
}


function fillStaticHtmlCn(fileName, containerId){
    var url = htmlRoot + '/' + fileName;
    var reqObj = new XMLHttpRequest();
    reqObj.containerId = containerId;
    reqObj.open("GET", url, true);
    reqObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    reqObj.onreadystatechange = function() {
        if (reqObj.readyState == 4 && reqObj.status == 200) {
            var htmlText = reqObj.responseText;
            $(reqObj.containerId).html(htmlText);
        }
    };
    reqObj.send();
    return;
}


function getSearchForm(){
    
    var fieldList = ["bco_id", "name"];
    var queryField = '<select class=queryfield id=queryfield>';
    for (var i in fieldList){
        queryField += '<option value="'+fieldList[i]+'">'+fieldList[i]+'</option>';
    }
    queryField += '</select>';
    var queryValue = '<input type=text class=queryvalue id=queryvalue value="">';
    var searchBtn = '<input type=submit class=searchbtn id=searchbtn value="Search">';

    var cn = '<table width=100% style="border-bottom:1px solid #ccc;"><tr>';
    cn += '<td width=15%>Search field<br>'+queryField+'</td>';
    cn += '<td width=40%>Search value<br>'+queryValue+'</td>';
    cn += '<td width=10%><br>'+searchBtn+'</td>';
    cn += '<td></td>';
    cn += '</tr><tr height=5><td colspan=4></td></tr></table>';
    return cn;
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    return;    
}


function loginUser(){
    var inJson = {"svc":"login_user"};
    var paramList = ["email", "password"];
    for (var i in paramList){
        inJson[paramList[i]] = $("input[name="+paramList[i]+"]").val();
    }

    //$("#pagecn").html(getProgressIcon());
    var url = cgiRoot + '/bco_editor';
    var reqObj = new XMLHttpRequest();
    reqObj.open("POST", url, true);
    reqObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    reqObj.onreadystatechange = function() {
        if (reqObj.readyState == 4 && reqObj.status == 200) {
            try {
                resJson = JSON.parse(reqObj.responseText);
                if(resJson["taskstatus"] == 0){
                    var msg = resJson["errormsg"] + '. Please ';
                    msg += '<a id=logout href="">click here</a> to try again, or contact admin if this persists.';
                    $("#pagecn").html(getMessagePanel(msg));
                    return;
                }
                if (resJson["auth"]["status"] == 1){
                    $("#loginmsg").html(resJson["auth"]["msg"]);
                    setCookie("sessionid", resJson["auth"]["sessionid"], 7);
                    setCookie("email", resJson["auth"]["email"], 7);
                    window.location.href = htmlRoot;
                }
                else{
                    var msg = resJson["auth"]["errormsg"];
                    msg += ' <a id=logout href="">Click here</a> to go back.'
                    $("#pagecn").html(getMessagePanel(msg));
                }
            }
            catch(e) {
                $("#pagecn").html(getMessagePanel("loginUser, please report this error!"));
                console.log(e);
            }
        }
    };
    var postData = 'injson='+JSON.stringify(inJson);
    reqObj.send(postData);
    console.log('request='+postData);
}


function registerUser(){
    var inJson = {"svc":"register_user"};
    var paramList = ["fname", "lname", "email_r", "password_r"];
    for (var i in paramList){
        var f = paramList[i].split("_")[0];
        inJson[f] = $("input[name="+paramList[i]+"]").val();
    }

    var url = cgiRoot + '/bco_editor';
    var reqObj = new XMLHttpRequest();
    reqObj.open("POST", url, true);
    reqObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    reqObj.onreadystatechange = function() {
        if (reqObj.readyState == 4 && reqObj.status == 200) {
            try {
                resJson = JSON.parse(reqObj.responseText);
                if(resJson["taskstatus"] == 0){
                    var msg = resJson["errormsg"] + '. Please ';
                    msg += '<a id=logout href="">click here</a> to try again, or contact admin if this persists.';
                    $("#pagecn").html(getMessagePanel(msg));
                    return;
                }
                else{
                    var msg = 'You have registered successfully! Please contact admin for activation, or ';
                    msg += '<a id=logout href="">click here</a> to go back to the main page.';
                    $("#pagecn").html(getMessagePanel(msg));
                }
            }
            catch(e) {
                $("#pagecn").html(getMessagePanel("registerUser, please report this error!"));
                console.log(e);
            }
        }
    };
    var postData = 'injson='+JSON.stringify(inJson);
    reqObj.send(postData);
    console.log('request='+postData);
}



function saveObject(){

    var bcoJson = editorObj.getValue();
    $("#pagecn").append(getProgressIcon());
    var url = cgiRoot + '/bco_editor';
    

    var inJson = {"svc":"save_object", "bco":bcoJson}
    var form = document.getElementById('bco_form');
    var formData = new FormData(form);
    formData.append("injson", JSON.stringify(inJson));

    var reqObj = new XMLHttpRequest();
    reqObj.open("POST", url, true);
    //reqObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    reqObj.onreadystatechange = function() {
        if (reqObj.readyState == 4 && reqObj.status == 200) {
            try {
                console.log(reqObj.responseText);
                resJson = JSON.parse(reqObj.responseText);
                if(resJson["taskstatus"] == 0){
                    var msg = resJson["errormsg"] + '. Please ';
                    msg += '<a id=logout href="">click here</a> to try again, or contact admin if this persists.';
                    $("#pagecn").html(getMessagePanel(msg));
                    return;
                }
                else{
                    bcoId = resJson["bcoid"];
                    setEditPage();
                }
            }
            catch(e) {
                $("#pagecn").html(getMessagePanel("saveObject, please report this error!"));
                console.log(e);
            }
        }
    };
    reqObj.send(formData);
    //console.log('request='+postData);
    return;
}


function getMessagePanel(msg){
    var cn = '<table width=100% height=200 style="margin-top:30px;">';
    cn +='<tr><td valign=middle align=center style="color:#777;background:#f1f1f1;">';
    cn +=  msg + '</td></tr></table>';
    return cn;
}

//////////////////////////////////////
function rndrGoogleTable (resData, inObj) {

    var formatHash = {
        "id": {prefix:'', groupingSymbol: '', fractionDigits:0}
        ,"money": {prefix: '$', negativeColor: 'red', negativeParens: true}
    }

    google.charts.load('current', {'packages':['table']});
    google.charts.setOnLoadCallback(drawTable);
    function drawTable(){
        var data = new google.visualization.DataTable();
        for (var j=0; j < resData[0].length; j++){
            data.addColumn(resData[1][j], resData[0][j]);
        }
        for (var i=2; i < resData.length; i++){
            data.addRows([resData[i]]);
        }
        for (var j=0; j < resData[0].length; j++){
            if ("moneyfields" in inObj){
                if (inObj["moneyfields"].indexOf(j) != -1){
                    var frmtr = new google.visualization.NumberFormat(formatHash["money"]);
                    frmtr.format(data, j);
                }
            }
            if ("idfields" in inObj){
                if (inObj["idfields"].indexOf(j) != -1){                                       
                    var frmtr = new google.visualization.NumberFormat(formatHash["id"]);
                    frmtr.format(data, j);
                }
            }
        }
        var em = document.getElementById(inObj["containerid"]);
        var table = new google.visualization.Table(em);
        var options = {showRowNumber: false, width: '100%',
            page:'enable', pageSize:inObj["pagesize"], allowHtml:true,
            cssClassNames:{
                headerRow: 'googletableheader',
                tableCell:'googletablecell'
            }
        };
        table.draw(data, options);
        google.visualization.events.addListener(table, 'select', function() {
            var row = table.getSelection()[0].row;
            handleRowSelection([data.getValue(row, 0), data.getValue(row, 1)]);
        });
    }
    return getProgressIcon();

}


function handleRowSelection(row){

    $('html').animate({scrollTop:0}, 'fast');
    $('body').animate({scrollTop:0}, 'fast');
    bcoId = row[0];
    setViewPage();
    return;
}


function handleBackBtn(){

    if (window.history && window.history.pushState) {
        $(window).on('popstate', function() {
            var hashLocation = location.hash;
            var hashSplit = hashLocation.split("#!/");
            var hashName = hashSplit[1];
            if (hashName !== '') {
                var hash = window.location.hash;
                if (hash === '') {
                    setHomePage();
                    //alert('Back button was pressed.');
                }
            }
        });
        window.history.pushState('forward', null, './#forward');
    }
}
