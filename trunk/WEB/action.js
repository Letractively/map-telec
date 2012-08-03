function on_off (device, bridge, value, action)  {
    var xhr = null;
    if (window.XMLHttpRequest || window.ActiveXObject) { 
        if (window.ActiveXObject) {
            try { 
                xhr = new ActiveXObject("Msxml2.XMLHTTP"); 
            } catch(e) { xhr = new ActiveXObject("Microsoft.XMLHTTP");}
        } else {
            xhr = new XMLHttpRequest(); 
        }
    } else {
        alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
    }
    xhr.open("POST", "index.html", true);
    xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    xhr.send("device="+device+"&bridge="+bridge+"&value="+value+"&action="+action);
}
	


