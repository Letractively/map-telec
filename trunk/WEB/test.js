jQuery(function($) {

    function processEvents(events) {
        if (events.length) {
            $('#logs').append('<span style="color: blue;">[client] ' + events.length + ' events</span><br/>');
        } else {
            $('#logs').append('<span style="color: red;">[client] no event</span><br/>');
        }
        for (var i in events) {
            $('#logs').append('<span>[event] ' + events[i] + '</span><br/>');
        }
    }

    function long_polling() {
        $.getJSON('ajax', function(events) {
            processEvents(events);
            long_polling();
        });
    }
    console.log('test');
    long_polling();

});
//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
function getXMLHttpRequest() {
    var xhr = null;
	
    if (window.XMLHttpRequest || window.ActiveXObject) {
        if (window.ActiveXObject) {
            try {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            } catch(e) {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
        } else {
            xhr = new XMLHttpRequest(); 
        }
    } else {
        alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
        return null;
    }
    return xhr;
}

function getAjax(){
    var xhr = getXMLHttpRequest();
    xhr.onreadystatechange=function(){
        if (xhr.readyState==4 && xhr.status==200){
            document.getElementById('logs').innerHTML=xhr.responseText;
        }
    }
    xhr.open("GET","ajax_info.txt",true);
    xhr.send();
    getAjax();
}


//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
function getXMLHttpRequest() {var xhr = null;if (window.XMLHttpRequest || window.ActiveXObject) {if (window.ActiveXObject) {try {xhr = new ActiveXObject('Msxml2.XMLHTTP');} catch(e) {xhr = new ActiveXObject('Microsoft.XMLHTTP');}} else {xhr = new XMLHttpRequest();}} else {alert('Votre navigateur ne supporte pas l\'objet XMLHTTPRequest...');return null;}return xhr;}function getAjax(){var xhr = getXMLHttpRequest();xhr.onreadystatechange=function(){document.getElementById('logs').innerHTML=xhr.responseText;};xhr.open("GET","ajax",true);xhr.send();getAjax();}



function getAjax(){
    new Ajax.Request('index.xhtml', {
        method: 'get',
        onComplete: function(transport) {
            if (200 == transport.status){
                document.getElementById('logs').innerHTML=transport.responseText;
                getAjax();
            }
        }
    });
}



function getAjax(){new Ajax.Request('index.xhtml', {method: 'get',onComplete: function(transport) {if (200 == transport.status){document.getElementById('logs').innerHTML=transport.responseText;getAjax();}}});}