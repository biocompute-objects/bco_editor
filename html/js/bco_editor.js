var resJson = {};
var editorObj = {};
var pageId = "";
var bcoId = "";
var path = ''
var isDataEdited = false;
var rootUrl = '/bco_editor';
var rootPath = '/bco_editor_tst';

////////////////////////////////
$(document ).ready(function() {
  $('html').animate({scrollTop:0}, 'fast');
  $('body').animate({scrollTop:0}, 'fast');
  handleBackBtn();
  generateDateTimePicker();
  var paths = window.location.href.split('/')
  if (paths.length === 5 && paths[4]) {
    path = paths[4]
  } else {
    path  = ''
  }
  $("#loginformcn").css("display", "none");
  $("#pagelinkcn").css("display", "block");

  $("#searchboxcn").html(getSearchForm());
  $("#pagecn").html(setHomePage());

  $(window).on('popstate', function (e) {
    var state = e.originalEvent.state;
    if (state !== null) {
        debugger
    }
  })
});

$(document).on('click', '.menudiv, .pagelink, .createlink, .editlink, .viewlink, .importlink', function (event) {
    event.preventDefault();
    $('html').animate({scrollTop:0}, 'fast');
    $('body').animate({scrollTop:0}, 'fast');

    pageId = this.id.split("|")[0];

    if (isDataEdited) {
        if (!['edit', 'create'].includes(pageId)) {
            openModal(pageId)
        }
    } else {
        gotoNavigate(pageId, this.id)

    }
});

function gotoNavigate(pageId, secondId) {

    if(pageId == 'home'){
        window.location.href=rootPath
        // setHomePage();
    } else if (pageId == 'import') {
        importBcos()
    } else if (pageId == 'search') {
        setSearchPage()
        history.pushState({}, null, rootPath)
    } else if(pageId == 'view'){
        if (!secondId) {
            setHomePage()
        } else {
            bcoId = secondId.split("|")[1];
            setViewPage();
        }
    } else if(pageId == 'edit'){
        setEditPage();
    } else if(pageId == 'create'){
        bcoId = "-1";
        setEditPage();
    } else if(pageId == 'profile'){
        setProfilePage();
        history.pushState({}, null, rootPath)
    } else if(["tutorial"].indexOf(pageId) != -1){
        fillStaticHtmlCn(pageId + ".html", "#pagecn")
        history.pushState({}, null, rootPath)
    } else if ( pageId == 'logout' ) {
        logoutUser()
    }
}

$(document).on('click', '#savebco', function (event) {
    event.preventDefault();
    $('html').animate({scrollTop:0}, 'fast');
    $('body').animate({scrollTop:0}, 'fast');
    saveObject();
});

$(document).on('click', '#saveprofile', function (event) {
    event.preventDefault();
    $('html').animate({scrollTop:0}, 'fast');
    $('body').animate({scrollTop:0}, 'fast');
    saveProfile();
});

$(document).on('click', '#resetpassword', function (event) {
    event.preventDefault();
    $('html').animate({scrollTop:0}, 'fast');
    $('body').animate({scrollTop:0}, 'fast');
    resetPassword();
});

$(document).on('click', '#logout', function (event) {
    event.preventDefault();
    if (isDataEdited) {
        openModal('logout')
    } else {
        logoutUser();

    }
});
$(document).on('click', '#downloadbtn', function (event) {
    event.preventDefault();
    download();
});

$(document).on('click', '#searchbtn', function (event) {
    event.preventDefault();
    $('html').animate({scrollTop:0}, 'fast');
    $('body').animate({scrollTop:0}, 'fast');
    if (isDataEdited) {
        openModal('search')
    } else {
        if (checkCookie('sessionid'))
            $("#pagecn").html(setHomePage());
        else
            $("#pagecn").html(setSearchPage());

    }
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
    
    setCookie("sessionid","",-1);
    $('html').animate({scrollTop:0}, 'fast');
    $('body').animate({scrollTop:0}, 'fast');
    window.location.href = htmlRoot;
}


function setUnSignedHomePage(){
  
    $("#pagelinkcn").html("");
    $("#pagelinkcn").append('<div id=tutorial class=menudiv>Tutorial</div>');
    $("#pagelinkcn").append('<div class=divider>|</div>');
    $("#pagelinkcn").append('<div id=home class=menudiv>Home</div>');
    $("#pagelinkcn").append('<div class=divider>|</div>');
    $("#pagelinkcn").append('<div id=search class=menudiv>Search</div>');
 
    $("#searchboxcn").css("display", "none");
    fillStaticHtmlCn("home.html", "#pagecn");
    return;

}

function setHomePage(){

    $("#pagelinkcn").html("");
    $("#pagelinkcn").append('<div id=logout class=menudiv>Logout</div>');
    $("#pagelinkcn").append('<div class=divider>|</div>');
    $("#pagelinkcn").append('<div id=loginmsg class=loginmsg></div>');
    $("#pagelinkcn").append('<div class=divider>|</div>');
    $("#pagelinkcn").append('<div id=tutorial class=menudiv>Tutorial</div>');
    $("#pagelinkcn").append('<div class=divider>|</div>');
    $("#pagelinkcn").append('<div id=profile class=menudiv>Profile</div>');
    $("#pagelinkcn").append('<div class=divider>|</div>');
    $("#pagelinkcn").append('<div id=home class=menudiv>Home</div>');

    $("#searchboxcn").css("display", "block");

                   
    var inJson = {}
    var queryValue = $("#queryvalue").val().trim();
    inJson = {"svc":"search_objects",  "queryvalue":queryValue};

    $("#pagecn").append(getProgressIcon());
    var url = cgiRoot + rootUrl;
    var reqObj = new XMLHttpRequest();
    reqObj.open("POST", url, true);
    reqObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    reqObj.onreadystatechange = function() {
        if (reqObj.readyState == 4 && reqObj.status == 200) {
            try {
                resJson = JSON.parse(reqObj.responseText);
                $("#versioncn").html(resJson["editorversion"]);
                // debugger
                if (path) {
                    bcoId = window.location.href.includes('localhost') ? `https://w3id.org/biocompute/examples/${path}.json` : `http://biocomputeobject.org/${path}`
                    // bcoId = `http://biocomputeobject.org/${path}`
                    setViewPage()
                    return
                }

                if ("auth" in resJson){
                    if(resJson["auth"]["status"] != 1){
                        setUnSignedHomePage();
                        return;
                    }
                }
                
                if(resJson["taskstatus"] == 0){
                    var msg = resJson["errormsg"];
                    $("#pagecn").html(getMessagePanel(msg));
                    return;
                }

                var s1 = 'display:block;float:left;border-bottom:1px solid #ccc;padding:5px;margin-bottom:20px;';
                var s2 = 'width:70%;'
                var cn = '<div id=searchstatcn style="'+s1 + s2+'"></div>';
                var s2 = 'width:30%;text-align:right;'
                cn += '<div style="'+s1 + s2 +'"><a id=create class="createlink">Create Object</a></div>';
                // cn += '<div style="'+s1 +'"><a id=import class="importlink">Import Objects from remote</a></div>';
                cn += '<div id=searchresultscn></div>';
                $("#pagecn").html(cn);
                $("#loginmsg").html('Signed as ' + resJson["auth"]["email"]);
                if (resJson["searchresults"].length > 2){
                    var n = resJson["searchresults"].length - 2;
                    var statMsg = "Total of " + n  + " object(s) found.";
                    $("#searchstatcn").html(statMsg);
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
    var url = cgiRoot + rootUrl;
    var reqObj = new XMLHttpRequest();
    reqObj.open("POST", url, true);
    reqObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    reqObj.onreadystatechange = function() {
    
        if (reqObj.readyState == 4 && reqObj.status == 200) {
            try {
                resJson = JSON.parse(reqObj.responseText);
                if(resJson["taskstatus"] == 0){
                    var msg = resJson["errormsg"];
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
                    else
                    {
                        var s = 'border-bottom:1px solid #ccc;text-align:right;padding:5px;';
                        s += 'margin-bottom:20px;';
                        var links = Number(bcoId) !== -1 ? '<a id=view|'+bcoId+' class="viewlink">View Object</a>' : "";
                        var cn = '<div style="'+s+'">'+links+'</div>';
                        var style = 'background:#fff;margin-top:20px;font-size:13px;';
                        cn += '<div id="editor_div" style="'+style+'"></div>';
                        var style = 'background:#f1f1f1;margin:0px 0px 100px 20px;padding:10px;';
                        style += 'text-align:right;width:90%;';
                        var saveBtn = '<input class=submitbtn id=savebco type=submit value="Save Changes">';
                        cn += '<div style="'+style+'">'+saveBtn+'</div>';
                        $("#pagecn").html(cn);
                        var schemaObj = JSON.parse(reqObj.responseText);
                        console.log(schemaObj);

                        var properties = {}
                        properties['bco_id'] = schemaObj.schema.properties.bco_id;
                        properties['bco_spec_version'] = schemaObj.schema.properties.bco_spec_version;
                        properties['checksum'] = schemaObj.schema.properties.checksum;
                        properties['extension_domain'] = schemaObj.schema.properties.extension_domain;
                        properties['provenance_domain'] = schemaObj.schema.properties.provenance_domain;
                        properties['usability_domain'] = schemaObj.schema.properties.usability_domain;
                        properties['description_domain'] = schemaObj.schema.properties.description_domain;
                        properties['execution_domain'] = schemaObj.schema.properties.execution_domain;
                        properties['parametric_domain'] = schemaObj.schema.properties.parametric_domain;
                        properties['io_domain'] = schemaObj.schema.properties.io_domain;
                        properties['error_domain'] = schemaObj.schema.properties.error_domain;

                        delete schemaObj.schema.properties;
                        schemaObj.schema.properties = properties;

                        var proveProperties = {}
                        proveProperties['license'] = schemaObj.schema.properties.provenance_domain.properties.license;
                        proveProperties['name'] = schemaObj.schema.properties.provenance_domain.properties.name;
                        proveProperties['created'] = schemaObj.schema.properties.provenance_domain.properties.created;
                        proveProperties['version'] = schemaObj.schema.properties.provenance_domain.properties.version;
                        proveProperties['modified'] = schemaObj.schema.properties.provenance_domain.properties.modified;
                        proveProperties['contributors'] = schemaObj.schema.properties.provenance_domain.properties.contributors;
                        proveProperties['review'] = schemaObj.schema.properties.provenance_domain.properties.review;
                        proveProperties['embargo'] = schemaObj.schema.properties.provenance_domain.properties.embargo || {};
                        delete schemaObj.schema.properties.provenance_domain.properties;
                        schemaObj.schema.properties.provenance_domain.properties = proveProperties;

                        schemaObj["ajax"] = true;
                        schemaObj.show_errors = "interaction"
                        JSONEditor.defaults.options.theme = 'bootstrap3';
                        editorObj = new JSONEditor(document.getElementById('editor_div'),schemaObj);
                        var isOnceCalled = false;
                        editorObj.on('change', function() {
                            if (!isOnceCalled) {
                                setStyles()
                                isOnceCalled = true;
                            } else {
                                isDataEdited = true;
                                console.log('123')
                            }
                        })
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

function setStyles() {
    console.log($('div.row:has(label:contains("bco_id"))'))
    $('div.row:has(label:contains("bco_id"))').addClass('header-domain')
    $('div.row:has(label:contains("bco_spec_version"))').addClass('header-domain')
    $('div.row:has(label:contains("checksum"))').addClass('header-domain')
    $('div.row:has(span:contains("extension_domain"))').addClass('header-domain')
    $('div.row:has(span:contains("Provenance Domain"))').addClass('provenance-domain')
    $('div.row:has(span:contains("Usability Domain"))').addClass('usability-domain')
    $('div.row:has(span:contains("Description Domain"))').addClass('description-domain')
    $('div.row:has(span:contains("Execution Domain"))').addClass('execution-domain')
    $('div.row:has(span:contains("Parametric Domain"))').addClass('parametric-domain')
    $('div.row:has(span:contains("Input and Output Domain"))').addClass('io-domain')
    $('div.row:has(span:contains("Error Domain"))').addClass('error-domain')
}

function generateSpaces(number) {
    return '&nbsp;'.repeat(number);
}

function stringify(json) {
    return JSON.stringify(json, null, 4);
}

function setViewPage(){

    $("#pagecn").html(getProgressIcon());
    var url = cgiRoot + rootUrl;
    var reqObj = new XMLHttpRequest();
    reqObj.open("POST", url, true);
    reqObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    reqObj.onreadystatechange = function() {
        if (reqObj.readyState == 4 && reqObj.status == 200) {
            try {
                resJson = JSON.parse(reqObj.responseText);
                $("#loginmsg").html('Signed as ' + resJson["auth"]["email"]);
                var s = 'border-bottom:1px solid #ccc;text-align:right;padding:5px;';
                s += 'margin-bottom:20px;';
                var links = '<a id=edit class="editlink">Edit Object</a>';
                var downloadButton = '<input type="button" id=downloadbtn value=Download></input>'
                links = (resJson["editflag"] == true ? links : "Read Only");
                localStorage.viewItem = JSON.stringify(resJson["bco"])
                var cn = '<div style="'+s+'">'+ links + downloadButton + '</div>';
                cn += '<DIV style="padding:20px 0px 0px 20px;"><pre style="white-space:pre-wrap;">';
                cn +=  JSON.stringify(resJson["bco"], null, 4) + '</pre></DIV>';
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

function importBcos() {
    var inJson = {}
    inJson = {"svc":"importbcos"};

    $("#pagecn").append(getProgressIcon());
    var url = cgiRoot + rootUrl;
    var reqObj = new XMLHttpRequest();
    reqObj.open("POST", url, true);
    reqObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    reqObj.onreadystatechange = function() {
        if (reqObj.readyState == 4 && reqObj.status == 200) {
            try {
                resJson = JSON.parse(reqObj.responseText);
                $("#versioncn").html(resJson["editorversion"]);
                
                if(resJson["taskstatus"] == 0){
                    var msg = resJson["errormsg"];
                    $("#pagecn").html(getMessagePanel(msg));
                    return;
                }
                var s1 = 'display:block;float:left;border-bottom:1px solid #ccc;padding:5px;margin-bottom:20px;';
                var s2 = 'width:70%;'
                var cn = '<div id=searchstatcn style="'+s1 + s2+'"></div>';
                var s2 = 'width:30%;text-align:right;'
                cn += '<div style="'+s1 + s2 +'"></div>';
                cn += '<DIV style="padding:20px 0px 0px 20px;">importing bcos from oncomx.org and glygen.org. please check home page a few mins later.</div>';
                $("#pagecn").html(cn);
                
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

function setSearchPage(){

    $("#searchboxcn").css("display", "block");
                   
    var inJson = {}
    var queryValue = $("#queryvalue").val().trim();
    inJson = {"svc":"search_objects_no_auth",  "queryvalue":queryValue};

    $("#pagecn").append(getProgressIcon());
    var url = cgiRoot + rootUrl;
    var reqObj = new XMLHttpRequest();
    reqObj.open("POST", url, true);
    reqObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    reqObj.onreadystatechange = function() {
        if (reqObj.readyState == 4 && reqObj.status == 200) {
            try {
                resJson = JSON.parse(reqObj.responseText);
                $("#versioncn").html(resJson["editorversion"]);
                
                if(resJson["taskstatus"] == 0){
                    var msg = resJson["errormsg"];
                    $("#pagecn").html(getMessagePanel(msg));
                    return;
                }
                var s1 = 'display:block;float:left;border-bottom:1px solid #ccc;padding:5px;margin-bottom:20px;';
                var s2 = 'width:70%;'
                var cn = '<div id=searchstatcn style="'+s1 + s2+'"></div>';
                var s2 = 'width:30%;text-align:right;'
                if (checkCookie('sessionid'))
                    cn += '<div style="'+s1 + s2 +'"><a id=create class="createlink">Create Object</a></div>';
                else
                   cn += '<div style="'+s1 + s2 +'"></div>';
                cn += '<div id=searchresultscn></div>';
                $("#pagecn").html(cn);
                if (resJson["searchresults"].length > 2){
                    var n = resJson["searchresults"].length - 2;
                    var statMsg = "Total of " + n  + " object(s) found.";
                    $("#searchstatcn").html(statMsg);
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


function setProfilePage(){

    $("#pagecn").html(getProgressIcon());
    var url = cgiRoot + rootUrl;
    var reqObj = new XMLHttpRequest();
    reqObj.open("POST", url, true);
    reqObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    reqObj.onreadystatechange = function() {
        if (reqObj.readyState == 4 && reqObj.status == 200) {
            try {
                //console.log(reqObj.responseText);
                resJson = JSON.parse(reqObj.responseText);
                var s = 'width:100%;margin:100px 0px 20px 0px;text-align:right;border-bottom:1px solid #ccc;';
                var cn = '<div style="'+s+'"></div>';
                var s = 'padding:0px;font-style:italic;margin-right:100px;';
                cn += '<div class="col-md-4" style="'+s+'">';
                cn += '<h3>User Profile</h3>';
                for (var i in resJson["userinfo"]){
                    var o = resJson["userinfo"][i];
                    var txtBox = '<input class=txtinputbox name="'+o["field"]+'" value="'+o["value"]+'">';
                    cn += o["label"] + '<br>'+ txtBox;
                }
                var saveBtn = '<input class=submitbtn id=saveprofile type=submit value="Save Profile">';
                cn += saveBtn;
                cn += '</div>';
                var s = 'padding:0px;font-style:italic;margin-right:100px;';
                cn += '<div class="col-md-4" style="'+s+'">';
                cn += '<h3>Password Reset</h3>';
                var txtBox = '<input type=password class=txtinputbox name="passwordone" value="">';
                cn += 'Current Password<br>'+ txtBox;
                var onkeyUp = 'onkeyup="validatePassword(this.value);"';
                var txtBox = '<input type=password class=txtinputbox name="passwordtwo" value="" '+onkeyUp+'>';
                cn += 'New Password <span id=pwdvalmsg></span><br>'+ txtBox;
                var txtBox = '<input type=password class=txtinputbox name="passwordthree" value="">';
                cn += 'Re-enter New Password<br>'+ txtBox ;
                var saveBtn = '<input class=submitbtn id=resetpassword type=submit value="Reset Password">';
                cn += saveBtn;
                cn += '</div>';

                $("#pagecn").html(cn);
                $("#searchboxcn").css("display", "none");
            }
            catch(e) {
                $("#pagecn").html(getMessagePanel("setViewPage, please report this error!"));
                console.log(e);
            }
        }
    };
    var postData = 'injson='+JSON.stringify({"svc":"get_profile"});
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
    
    var queryValue = '<input type=text class=queryvalue id=queryvalue value="">';
    var searchBtn = '<input type=submit class=searchbtn id=searchbtn value="Search">';
    var msg = '<span style="font-size:11px;">You can search by BCO ID, name or contributor.</span>';
    var cn = '<table width=100% style="background:#f6f6f6;"><tr>';
    cn += '<td width=70% style="padding:20px 0px 20px 20px;"><b>Search term</b><br>'+queryValue+ '<br>'+ msg + '</td>';
    cn += '<td width=10%><br>'+searchBtn+'<br>&nbsp;</td>';
    cn += '<td></td></tr></table>';
    return cn;
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    return;    
}

function checkCookie(cname) {
    var cookies = document.cookie.split(';')
    for (var c of cookies) {
        if (c.includes(cname)) {
            return true
        }
    }
    return false
}

function loginUser(){
    var inJson = {"svc":"login_user"};
    var paramList = ["email", "password"];
    for (var i in paramList){
        inJson[paramList[i]] = $("input[name="+paramList[i]+"]").val();
    }

    //$("#pagecn").html(getProgressIcon());
    var url = cgiRoot + rootUrl;
    var reqObj = new XMLHttpRequest();
    reqObj.open("POST", url, true);
    reqObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    reqObj.onreadystatechange = function() {
        if (reqObj.readyState == 4 && reqObj.status == 200) {
            try {
                resJson = JSON.parse(reqObj.responseText);
                if(resJson["taskstatus"] == 0){
                    var msg = resJson["errormsg"];
                    $("#pagecn").html(getMessagePanel(msg));
                    return;
                }
                if (resJson["auth"]["status"] == 1){
                    setCookie("sessionid", resJson["auth"]["sessionid"], 7);
                    setCookie("email", resJson["auth"]["email"], 7);
                    //window.location.href = htmlRoot;
                    setHomePage();
                }
                else{
                    var msg = resJson["auth"]["errormsg"];
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

    var url = cgiRoot + rootUrl;
    var reqObj = new XMLHttpRequest();
    reqObj.open("POST", url, true);
    reqObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    reqObj.onreadystatechange = function() {
        if (reqObj.readyState == 4 && reqObj.status == 200) {
            try {
                resJson = JSON.parse(reqObj.responseText);
                if(resJson["taskstatus"] == 0){
                    var msg = resJson["errormsg"];
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

    var errors = editorObj.validate();
    // var tmp = editorObj.options.show_errors;   
    editorObj.root.showValidationErrors(errors);    
    editorObj.options.show_errors = 'always';
    editorObj.onChange();

    if (errors.length) {
      errors.map(error => showError(error.path + " : " + error.message));
      return
    }
    var bcoJson = editorObj.getValue();
    $("#pagecn").append(getProgressIcon());
    var url = cgiRoot + rootUrl;
   
    //Force this!
    bcoJson["bco_id"] = bcoId;
    
    var regex = /^((\d+)\.(\d+)\.?(\d+)?)(?:-([\dA-Za-z\-]+(?:\.[\dA-Za-z\-]+)*))?(?:\+([\dA-Za-z\-]+(?:\.[\dA-Za-z\-]+)*))?$/
    if(bcoJson["provenance_domain"]["version"].match(regex) == null){
        $("#pagecn").html(getMessagePanel("Invalid version format for BCO"));
        return;
    }



    var inJson = {"svc":"save_object", "bco":bcoJson}
    var form = document.getElementById('bco_form');
    var formData = new FormData(form);
    formData.append("injson", JSON.stringify(inJson));

    var reqObj = new XMLHttpRequest();
    reqObj.open("POST", url, true);
    //reqObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    reqObj.onreadystatechange = function() {
        if (reqObj.readyState == 4 && reqObj.status == 200) {
            isDataEdited = false;
            try {
                console.log(reqObj.responseText);
                resJson = JSON.parse(reqObj.responseText);
                if(resJson["taskstatus"] == 0){
                    var msg = resJson["errormsg"];
                    showError(msg)
                    // $("#pagecn").html(getMessagePanel(msg));
                    $("#pagecn > div").last().remove()
                    setEditPage()
                    return;
                }
                else{
                    bcoId = resJson["bcoid"];
                    showSuccess("Your biocompute object "+ getBcoId(bcoId) + " has been successfully submitted.");
                    setHomePage();
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
    var id = row[0].split('/').pop().split('.').shift()
    var url = window.location.href
    url = `${url}${url.slice(-1) == '/' ? '' : '/'}${id}`
    window.location.href = url
    // setViewPage();
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
        //window.history.pushState('forward', null, './#forward');
    }
}



function saveProfile(){

    var inJson = {"svc":"save_profile"};
    for (var i in resJson["userinfo"]){
        var o = resJson["userinfo"][i];
        inJson[o["field"]] = $("input[name="+o["field"]+"]").val();
    }

    var url = cgiRoot + rootUrl;
    var reqObj = new XMLHttpRequest();
    reqObj.open("POST", url, true);
    reqObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    reqObj.onreadystatechange = function() {
        if (reqObj.readyState == 4 && reqObj.status == 200) {
            try {
                resJson = JSON.parse(reqObj.responseText);
                if(resJson["taskstatus"] == 0){
                    var msg = resJson["errormsg"];
                    $("#pagecn").html(getMessagePanel(msg));
                    return;
                }
                else{
                    var msg = 'Saved successfully!';
                    msg += ' <a id=profile class="pagelink" href="">Click here</a> to get back.';
                    $("#pagecn").html(getMessagePanel(msg));
                }
            }
            catch(e) {
                $("#pagecn").html(getMessagePanel("saveProfile, please report this error!"));
                console.log(e);
            }
        }
    };
    var postData = 'injson='+JSON.stringify(inJson);
    reqObj.send(postData);
    console.log('request='+postData);
}


function resetPassword(){


    var passwordOne = $("input[name=passwordone]").val(); 
    var passwordTwo = $("input[name=passwordtwo]").val();
    var passwordThree = $("input[name=passwordthree]").val();

    var msg = '';
    if (passwordOne.trim() == '' || passwordTwo.trim() == '' || passwordThree.trim() == ''){
        msg += 'Error: please enter all values!';
        msg += ' <a id=profile class="pagelink" href="">Click here</a> to get back.';
    }
    if (passwordTwo.trim() != passwordThree.trim()){
        msg += 'Error: new passwords do not match!';
        msg += ' <a id=profile class="pagelink" href="">Click here</a> to get back.';
    }
    if ($("#pwdvalmsg").html() == 'Weak'){
        msg += 'Error: weak password!';
        msg += ' <a id=profile class="pagelink" href="">Click here</a> to get back.';
    }

    if(msg != ''){
        $("#pagecn").html(getMessagePanel(msg));
        return;
    }

    var inJson = {
        "svc":"reset_password", 
        "passwordone":passwordOne, "passwordtwo":passwordTwo,
        "passwordthree":passwordThree};
    var url = cgiRoot + rootUrl;
    var reqObj = new XMLHttpRequest();
    reqObj.open("POST", url, true);
    reqObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    reqObj.onreadystatechange = function() {
        if (reqObj.readyState == 4 && reqObj.status == 200) {
            try {
                resJson = JSON.parse(reqObj.responseText);
                if(resJson["taskstatus"] == 0){
                    var msg = resJson["errormsg"] + '.';
                    msg += ' <a id=profile class="pagelink" href="">Click here</a> to get back.';
                    $("#pagecn").html(getMessagePanel(msg));
                    return;
                }
                else{
                    var msg = 'Password reset successfully!';
                    msg += ' <a id=profile class="pagelink" href="">Click here</a> to get back.';
                    $("#pagecn").html(getMessagePanel(msg));
                }
            }
            catch(e) {
                $("#pagecn").html(getMessagePanel("saveProfile, please report this error!"));
                console.log(e);
            }
        }
    };
    var postData = 'injson='+JSON.stringify(inJson);
    reqObj.send(postData);
    console.log('request='+postData);
    return;

}



function validatePassword(password) {
                
    // Do not show anything when the length of password is zero.
    if (password.length === 0) {
        document.getElementById("pwdvalmsg").innerHTML = "";
        return;
    }
    
    // Create an array and push all possible values that you want in password
    var matchedCase = new Array();
    matchedCase.push("[$@$!%*#?&]"); // Special Charector
    matchedCase.push("[A-Z]");      // Uppercase Alpabates
    matchedCase.push("[0-9]");      // Numbers
    
    matchedCase.push("[a-z]");     // Lowercase Alphabates
                
    // Check the conditions
    var ctr = 0;
    for (var i = 0; i < matchedCase.length; i++) {
        if (new RegExp(matchedCase[i]).test(password)) {
            ctr++;
        }
    }
    
    // Display it
    var color = "";
    var strength = "";
    switch (ctr) {
        case 0:
        case 1:
        case 2:
            strength = "Weak";
            color = "red";
            break;
        case 3:
            strength = "Medium";
            color = "orange";
            break;
        case 4:
            strength = "Strong";
            color = "green";
            break;
    }
    document.getElementById("pwdvalmsg").innerHTML = " (" +  strength + ")";
    document.getElementById("pwdvalmsg").style.color = color;
    
}

function download() {
    var data = JSON.parse(localStorage.viewItem)
    var text = JSON.stringify(data, null, 4)
    var filename = data['bco_id'] + '.json'

    var element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element)
}


function showSuccess(message) {
  $.toast({
    heading: 'Success',
    text: message,
    icon: 'success',
    position: 'bottom-right',
    hideAfter: false
  })
}

function showError(message) {
  $.toast({
    heading: 'Error',
    text: message,
    icon: 'error',
    position: 'bottom-right',
    hideAfter: false
  })
}

function openModal(pageId) {
    $('#open_modal').modal({
        showClose: false
    });

    $('#confirm_yes').click(function() {
        isDataEdited = false
        $.modal.close()
        gotoNavigate(pageId)
    })

    $('#confirm_no').click(function() {
        $.modal.close()

    })
}


function handleBackFunction() {
    if (isDataEdited) {
        window.event.preventDefault()
        event.preventDefault()
        openModal('home')
        event.returnValue = false;
        window.history.forward(1)
        return false;
    } 
}

function getBcoId(url) {
    let tempId = url.split('/').pop();
    return window.location.href.includes('localhost') ? tempId.split('.')[0] : tempId;
}


function generateDateTimePicker() {
    const interval = setInterval(function() {        
        if ($('input[name="root[provenance_domain][embargo][end_time]"]').length) {
            $('input[type="date-time"]').datetimepicker({format: 'YYYY-MM-DDTHH:mm:ssZ'});
            $('input[name="root[provenance_domain][embargo][start_time]"]').datetimepicker({
                useCurrent: false,
		        format: 'YYYY-MM-DDTHH:mm:ssZ'
            })
            $('input[name="root[provenance_domain][embargo][end_time]"]').datetimepicker({
                useCurrent: false,
		        format: 'YYYY-MM-DDTHH:mm:ssZ'
            })
            $('input[name="root[provenance_domain][embargo][start_time]"]').on("dp.change", function(e) {
                // $('input[name="root[provenance_domain][embargo][start_time]"]').val(e.date.format());
                $('input[name="root[provenance_domain][embargo][end_time]"]').data("DateTimePicker").minDate(e.date);  
                editorObj.getEditor('root.provenance_domain.embargo.start_time').setValue(e.date.format())
            });
            if (editorObj.getEditor('root.provenance_domain.embargo.start_time'))
                $('input[name="root[provenance_domain][embargo][end_time]"]').val(editorObj.getEditor('root.provenance_domain.embargo.start_time').getValue());
            $('input[name="root[provenance_domain][embargo][end_time]"]').on("dp.change", function(e) {
                // $('input[name="root[provenance_domain][embargo][end_time]"]').val(e.date.format())
                $('input[name="root[provenance_domain][embargo][start_time]"]').data("DateTimePicker").maxDate(e.date);  
                editorObj.getEditor('root.provenance_domain.embargo.end_time').setValue(e.date.format())
            })
            clearInterval(interval)
        }
    }, 1000)
}
