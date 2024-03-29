var image = '';

//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
//Return a XMLHttpRequest
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
    }else {
        alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
        return null;
    }
	
    return xhr;
}

//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
//Remove a device device in the lists of users
//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
function removeDevice(device, user_list){
    for(var i=0;i<user_list.length;i++){
        user_list[i].list.remove(document.getElementById(device));
    }
}

//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
//Update the interface for each request
//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
function updateMap(resp, user_lists, device_list){
    //    document.getElementById('text_tmp').removeChild(document.getElementById('text_tmp').childNodes[0]);
    //    document.getElementById('text_tmp').appendChild(document.createTextNode(resp));
    if(resp != undefined){
        var c = resp[0];
        var i = 1;
        while(i<resp.length && c != '/'){
            c = resp[i];
            i++;
        }
        if(resp[i] == 'l'){
            var device;
            var bool = false;
            if(document.getElementById(resp.substring(0,i-1)) != undefined){
                removeDevice(resp.substring(0,i-1), user_lists[0]);
                device_list.remove(document.getElementById(resp.substring(0,i-1)));
                device = document.getElementById(resp.substring(0,i-1));
            }else{
                split = resp.split("/", 10);
                //TODO image en dur, stupide !!!!! A remplacer par l'image correspondant au type de l'objet
                device = new Device(resp.substring(0,i-1), 'html/img/lightOFF.png');
                bool = true;
            }
            document.getElementById('debarraschildren').appendChild(device);
            device_list.add(device);
            if(bool) Draggable(device.id,[device.id], startDragElement, dragElement, null);
            
        }else if(resp[i] == 'u'){
            var bool = false;
            var device;
            if(document.getElementById(resp.substring(0,i-1)) != undefined){
                device_list.remove(document.getElementById(resp.substring(0,i-1)));
                removeDevice(resp.substring(0,i-1), user_lists[0]);
                device = document.getElementById(resp.substring(0,i-1));
            }else{
                //TODO image en dur, stupide !!!!! A remplacer par l'image correspondant au type de l'objet
                device = new Device(resp.substring(0,i-1), 'html/img/lightOFF.png');
                bool = true;
            }
            var user = user_lists[0][0];
            var j=0;
            while(j<user_lists[0].length && user.node.id != resp.substring(i+1,resp.length)){
                j++;
                user = user_lists[0][j];
            }
            document.getElementById(user.node.getAttribute('gdevices')).appendChild(device);
            user.list.add(device);
            if(bool) Draggable(device.id,[device.id], startDragElement, dragElement, null);
        }else if(resp[i] == 'm'){
            var device;
            var bool = false;
            if(document.getElementById(resp.substring(0,i-1)) != undefined){
                device_list.remove(document.getElementById(resp.substring(0,i-1)));
                removeDevice(resp.substring(0,i-1), user_lists[0]);
                device = document.getElementById(resp.substring(0,i-1));
            }else{
                //TODO image en dur, stupide !!!!! A remplacer par l'image correspondant au type de l'objet
                device = new Device(resp.substring(0,i-1), 'html/img/lightOFF.png');
                bool = true;
            }
            var k = i;
            while(c!=','){
                c=resp[k];
                k++;
            }

            var x = parseFloat(resp.substring(i+4,k-1));
            var y = parseFloat(resp.substring(k,resp.length));
            if(x<0) x=0;
            if(y<0) y=0;
            var str_mtx = 'matrix(1' 
            + ', 0'
            + ', 0'
            + ', 1'
            + ', ' + x
            + ', ' + y
            + ')';
            device.setAttribute('transform', str_mtx);
            document.getElementById('planchildren').appendChild(device);
            if(bool) Draggable(device.id,[device.id], startDragElement, dragElement, null);
        }else if(resp.substring(0,i-1)=="adduser"){
            var u1 = new User('userid','html/img/user1.png',null, 'noname');
            document.getElementById('userschildren').appendChild(u1.node);
            u1.setDropZone(new List(document.getElementById(u1.node.id),0,'horizontal'));
            user_lists[1].add(u1.node);
            user_lists[0].push(u1);
        }else if(resp.substring(0,i-1)=="adddevice"){
            var split = resp.split("/", 10);
            var d1 = new Device(split[1],'html/img/'+split[2],split[3]);
            document.getElementById('debarraschildren').appendChild(d1);
            Draggable(d1.id,[d1.id], startDragElement, dragElement,  null);
            device_list.add(d1);
        }else if(resp.substring(0,i-1)=="removeuser"){

        }else if(resp.substring(0,i-1)=="removedevice"){
            device_list.remove(document.getElementById(resp.substring(i,resp.length)));
            removeDevice(resp.substring(i,resp.length), user_lists[0]);
            document.getElementById(resp.substring(i,resp.length)).parentNode.removeChild(document.getElementById(resp.substring(i,resp.length)));
        }else if(resp[i] == 'v'){ //value
            split = resp.split("/", 10);
            document.getElementById(resp.substring(0,i-1)).setAttributeNS('http://www.w3.org/1999/xlink','xlink:href', 'html/img/'+split[2]);
        }else if(resp.substring(0,5) == 'room:'){
            var split = resp.substring(5,resp.length).split('&');
            var i;
            while (document.getElementById('planchildrenrooms').hasChildNodes()) {
                document.getElementById('planchildrenrooms').removeChild(document.getElementById('planchildrenrooms').lastChild);
            }
            var res = 'initMap(new Array(';
            for(i=0;i<split.length;i++){
                var s = split[i].split('/');
                new Room(s[0],s[1],s[2],s[3],s[4],s[5],document.getElementById('planchildrenrooms'),s[0].substring(4,s[0].length));
                res += '{id:"'+s[0].substring(4,s[0].length)+'",x:"'+s[1]+'",y:"'+ s[2] +'",width:"'+ s[3] +'",height:"'+ s[4] +'",color:"'+ s[5]+'",root:document.getElementById("editmapcanvas")},';
            }
            res = res.substring(0, res.length-1);
            res += '));';
            document.getElementById('edit').onclick = res;
            console.log(split);
        }else if(resp.substring(0,5) == 'data:'){
            image += resp.substring(5,resp.length);
        }else if(resp.substring(0,3) == 'fin'){
            document.body.innerHTML = image;
        }else if(resp.substring(0,8) == 'newgroup'){
            var split = resp.split('/');
            if(document.getElementById(split[4]) != undefined){
                device_list.remove(document.getElementById(split[4]));
                removeDevice(split[4], user_lists[0]);
                document.getElementById(split[4]).parentNode.removeChild(document.getElementById(split[4]));
            }
            if(document.getElementById(split[5]) != undefined){
                device_list.remove(document.getElementById(split[5]));
                removeDevice(split[5], user_lists[0]);
                document.getElementById(split[5]).parentNode.removeChild(document.getElementById(split[5]));
            }
            var d = new Device(split[1], "html/img/group.png", "group");
            var xG = parseFloat(split[2]);
            var yG = parseFloat(split[3]);
            if(xG<0) xG=0;
            if(yG<0) yG=0;
            var str_mtx = 'matrix(1' 
            + ', 0'
            + ', 0'
            + ', 1'
            + ', ' + xG
            + ', ' + yG
            + ')';
            d.setAttribute('transform', str_mtx);
            d.addEventListener('click', groupclick, false);
            d.addEventListener('touchstart', groupclick, false);
            document.getElementById('planchildren').appendChild(d);
            console.log('new group !! : '+resp);
            var t = document.createElementNS("http://www.w3.org/2000/svg","text");
            t.appendChild(document.createTextNode('2'));
            t.setAttribute('id','text'+split[1]);
            t.setAttribute('font-size','12');
            t.setAttribute('transform',str_mtx);
            document.getElementById('planchildren').appendChild(t);
        }else if(resp.substring(0,5) == 'added'){
            var split = resp.split('/');
            var save = document.getElementById(split[1]);
            if(save != undefined){
                device_list.remove(document.getElementById(split[1]));
                removeDevice(split[1], user_lists[0]);
                save.parentNode.removeChild(save);
            }
            var t = document.getElementById('text'+split[2]);
            t.removeChild(t.childNodes[0]);
            t.appendChild(document.createTextNode(split[3]));
            if(document.getElementById('children'+split[2]) != undefined){
                save.setAttribute('x', '0');
                save.setAttribute('y', '0');
                save.setAttribute('transform', 'translate(0,0)')
                document.getElementById('children'+split[2]).appendChild(save);
            }
        }else if(resp.substring(0,5) == 'group'){
            var split = resp.split('/');
            var save = document.getElementById(split[1]);
            if(save != undefined){
                device_list.remove(save);
                removeDevice(split[1], user_lists[0]);
                save.parentNode.removeChild(save);
                if(document.getElementById('children'+split[0]) != undefined){
                    document.getElementById('children'+split[0]).appendChild(save);
                    save.setAttribute('transform','translate('+split[2]+','+split[3]+')');
                }
            }
            var t = document.getElementById('text'+split[0]);
            t.removeChild(t.childNodes[0]);
            t.appendChild(document.createTextNode(split[4]));
        }else if(resp.substring(0,9) == 'drawgroup'){
            var split = resp.split('*');
            if(document.getElementById('children'+split[1]) != undefined){
                var node = document.getElementById('children'+split[1]);
                node.parentNode.removeChild(node);
                node = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                node.setAttribute('id','children'+split[1]);
                document.getElementById('g'+split[1]).appendChild(node);
                var n;
                for(n = 2;n < split.length;n=n+4){
                    var d2 = new Device(split[n],split[n+1]);
                    node.appendChild(d2);
                    d2.setAttribute('transform','translate('+split[n+2]+','+split[n+3]+')');
                    Draggable(d2.id,[d2.id], startDragElement, dragElement, null);
                }
            }
        }else{
            console.log(resp);
        }
    }
}

//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
//Loop which create a XMLHttpRequest and wait for the response
//then call recursivly the method
//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
function getAjax(user_lists, device_list){
    var xhr = getXMLHttpRequest();
    xhr.onreadystatechange=function(){
        if (xhr.readyState==4 && xhr.status==200){
            updateMap(xhr.responseText, user_lists, device_list);
            getAjax(user_lists, device_list);
        }
    };
    
    xhr.open('POST','ajax',true);
    xhr.send();
}


//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
//Create a new separator between 2 nodes groups
//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
function Separator( id, root_node, orientation, gr_node1, gr_node2, taille_ref){
    var svgNS = "http://www.w3.org/2000/svg";
    var g = document.createElementNS(svgNS,'g');
    g.setAttribute('id',id);
    var draggable = document.createElementNS(svgNS,'rect');
    draggable.setAttribute('id','draggable'+id);
    draggable.setAttribute('fill','black');
    draggable.style.opacity = 0.5;
    g.appendChild(draggable);
    if(orientation == 'horizontal'){
        draggable.setAttribute('width',taille_ref.getBBox().width);
        draggable.setAttribute('height',window.innerHeight/30);
        g.setAttribute('transform',gr_node2[0].getAttribute('transform')+' translate(0,-'+window.innerHeight/30+')');
    }else{
        draggable.setAttribute('width',window.innerWidth/60);
        draggable.setAttribute('height',taille_ref.getBBox().height);
        g.setAttribute('transform',gr_node2[0].getAttribute('transform')+' translate(-'+window.innerWidth/60+',0)');
    }
    root_node.appendChild(g);
    Draggable(id, [id], null, function(n, e) {
        var M  = n.getCTM();
        var dec;
        var or;
        var size;
        var str_mtx = new Array();
        var str_mtx_sep;
        var y;
        var y0 = 0;
        var x;
        var y_sep;
        var x_sep;
        if(n.id == 'separatornordsudest'){
            x = document.getElementById('separatorestouest').getCTM().e+document.getElementById('separatorestouest').getBBox().width;
            x_sep = x;
        }
        else{ //Separation north/south in the ouest box(left)
            x = 0;
            x_sep = x;
        }
        if(orientation == 'horizontal'){
            dec = M.f;
            size = window.innerHeight - M.f - window.innerHeight/30;
            or = 'height';
            y = M.f + window.innerHeight/30;
            y_sep = M.f;
        }else{
            dec = M.e;
            size = window.innerWidth - M.e - window.innerWidth/60;
            or = 'width';
            x = M.e + window.innerWidth/60;
            y = 0;
            x_sep = M.e;
            y_sep = 0;
            y0 = gr_node2[0].getBBox().height + window.innerHeight/30;
        }
        if(orientation=='horizontal' && (dec>80*window.innerHeight/100 || dec<20*window.innerHeight/100)){
            if(dec>80*window.innerHeight/100){
                y = 80*window.innerHeight/100+window.innerHeight/30;
                y_sep = 80*window.innerHeight/100;
                dec = 80*window.innerHeight/100;
                size = 20*window.innerHeight/100-window.innerHeight/30;
            }else{
                y = 20*window.innerHeight/100+window.innerHeight/30;
                y_sep = 20*window.innerHeight/100;
                dec = 20*window.innerHeight/100;
                size = 80*window.innerHeight/100-window.innerHeight/30;
            }
        }
        if(orientation=='vertical' && (dec>80*window.innerWidth/100 || dec<20*window.innerWidth/100)){
            y = 0;
            y_sep = 0;
            if(dec>80*window.innerWidth/100){
                x = 80*window.innerWidth/100+window.innerWidth/60;
                x_sep = 80*window.innerWidth/100;
                dec = 80*window.innerWidth/100;
                size = 20*window.innerWidth/100-window.innerWidth/60;
            }else{
                x = 20*window.innerWidth/100+window.innerWidth/60;
                x_sep = 20*window.innerWidth/100;
                dec = 20*window.innerWidth/100;
                size = 80*window.innerWidth/100-window.innerWidth/60;
            }
        }
        str_mtx[0] = 'matrix(' + M.a 
        + ', ' + M.b
        + ', ' + M.c
        + ', ' + M.d
        + ', ' + x
        + ', ' + y
        + ')';
        str_mtx[1] = 'matrix(' + M.a 
        + ', ' + M.b
        + ', ' + M.c
        + ', ' + M.d
        + ', ' + x
        + ', ' + y0
        + ')';
        str_mtx_sep = 'matrix(' + M.a 
        + ', ' + M.b
        + ', ' + M.c
        + ', ' + M.d
        + ', ' + x_sep
        + ', ' + y_sep
        + ')';
        if(orientation=='vertical'){
            document.getElementById('draggableseparatornordsudouest').setAttribute('width',window.innerWidth-size-window.innerWidth/60);
            document.getElementById('draggableseparatornordsudest').setAttribute('width',window.innerWidth-(window.innerWidth-size-window.innerWidth/60));
            var x_tmp = x_sep+window.innerWidth/60;
            var y_tmp = document.getElementById('cloud').getBBox().height;
            var str_mtx_tmp = 'matrix(' + M.a 
            + ', ' + M.b
            + ', ' + M.c
            + ', ' + M.d
            + ', ' + x_tmp
            + ', ' + y_tmp
            + ')';
            document.getElementById('separatornordsudest').setAttribute('transform',str_mtx_tmp);
        }
        var i;
        n.setAttribute('transform', str_mtx_sep);
        for(i=0;i<gr_node1.length;i++){
            gr_node1[i].setAttribute(or,dec);
            document.getElementById(gr_node1[i].id+'rect').setAttribute(or,dec);
            document.getElementById('clip'+gr_node1[i].id+'rect').setAttribute(or,dec);
            var scrollBar = document.getElementById('scrollbardraggable'+gr_node1[i].id);
            if(scrollBar != null){
                var parent_rect = document.getElementById(gr_node1[i].id+'rect');
                scrollBar.setAttribute('height',parent_rect.getAttribute('height')*parent_rect.getAttribute('height')/document.getElementById(gr_node1[i].id+'children').getBBox().height);
            }
        }
        for(i=0;i<gr_node2.length;i++){
            gr_node2[i].setAttribute('transform', str_mtx[i]);
            gr_node2[i].setAttribute(or,size);
            document.getElementById(gr_node2[i].id+'rect').setAttribute(or,size);
            document.getElementById('clip'+gr_node2[i].id+'rect').setAttribute(or,size);
            var scrollBar = document.getElementById('scrollbardraggable'+gr_node2[i].id);
            if(scrollBar != null){
                var parent_rect = document.getElementById(gr_node2[i].id+'rect');
                scrollBar.setAttribute('height',parent_rect.getAttribute('height')*parent_rect.getAttribute('height')/document.getElementById(gr_node2[i].id+'children').getBBox().height);
            }
        }
    }, null);
}


//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
//Create a new scroll bar in the root_node and scroll the scroll_node
//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
function Scrollbar( id, root_node, orientation, scroll_node){
    var svgNS = "http://www.w3.org/2000/svg";
    var sb = document.createElementNS(svgNS,'g');
    sb.setAttribute('id','scrollbar'+id);
    var draggable = document.createElementNS(svgNS,'rect');
    draggable.setAttribute('id','scrollbardraggable'+id);
    draggable.setAttribute('x','2');
    draggable.setAttribute('width','15');
    draggable.setAttribute('height','50');
    draggable.setAttribute('fill','black');
    sb.appendChild(draggable);
    root_node.appendChild(sb);
    Draggable('scrollbar'+id, ['scrollbar'+id], null, function(n, e) {
        var bbox_scrollnode = scroll_node.getBBox();
        var bbox_scrollbar = n.getBBox();
        var MAm = root_node.getCTM().inverse();
        var MB  = n.getCTM();
        var MAB = MAm.multiply( MB );
        var y;
        var y_s;
        var child = document.getElementById(root_node.id+'rect');
        //contraintes
        if(MAB.f+bbox_scrollbar.height < child.getAttribute('height')
            && MAB.f > child.getAttribute('x')){
            y = -MAB.f*(bbox_scrollnode.height-child.getAttribute('height'))/(child.getAttribute('height')-bbox_scrollbar.height);
            y_s = MAB.f;
        }else if(MAB.f > child.getAttribute('x') && !(bbox_scrollbar.height>=child.getAttribute('height'))){
            y_s = child.getAttribute('height')-bbox_scrollbar.height;
            y = -(bbox_scrollnode.height-child.getAttribute('height'));
        }else{
            y_s = 0;
            y = 0;
        }
        var str_mtx_scrollbar = 'matrix(' + MAB.a 
        + ', ' + MAB.b
        + ', ' + MAB.c
        + ', ' + MAB.d
        + ', 0'
        + ', ' + y_s
        + ')';
        var str_mtx = 'matrix(' + MAB.a 
        + ', ' + MAB.b
        + ', ' + MAB.c
        + ', ' + MAB.d
        + ', 15'
        + ', ' + y
        + ')';
        n.setAttribute('transform', str_mtx_scrollbar);
        scroll_node.setAttribute('transform',str_mtx);	
    }, null);
    Draggable(id+'children', [id], null, function(n, e) {
        var scrollB = document.getElementById('scrollbar'+n.parentNode.id);
        var bbox_scrollbar = scrollB.getBBox();
        var bbox_scrollnode = scroll_node.getBBox();
        var MAm = root_node.getCTM().inverse();
        var MB  = n.getCTM();
        var MAB = MAm.multiply( MB );
        var y;
        var y_s;
        var child = document.getElementById(root_node.id+'rect');
        //contraintes
        if(-MAB.f>0){
            y = MAB.f
            y_s = -MAB.f*(child.getAttribute('height')-bbox_scrollbar.height)/(bbox_scrollnode.height-child.getAttribute('height'));
        }else if(-MAB.f<=0){
            y_s = 0;
            y = 0;
        }else{
            y_s = child.getAttribute('height')-bbox_scrollbar.height;
            y = -(bbox_scrollnode.height-child.getAttribute('height'));
        }
        var str_mtx = 'matrix(' + MAB.a 
        + ', ' + MAB.b
        + ', ' + MAB.c
        + ', ' + MAB.d
        + ', 15'
        + ', ' + y
        + ')';
        var str_mtx_scrollbar = 'matrix(' + MAB.a 
        + ', ' + MAB.b
        + ', ' + MAB.c
        + ', ' + MAB.d
        + ', 0'
        + ', ' + y_s
        + ')';
        n.setAttribute('transform', str_mtx);
        scrollB.setAttribute('transform',str_mtx_scrollbar);
    }, null);
}



//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
//Create a new container
//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
function Container(id, b_scrollbar, width, height, transform){
    this.id = id;
    this.b_scrollbar = b_scrollbar;
    this.width = width;
    this.height = height;
    this.transform = transform;
    var svgNS = "http://www.w3.org/2000/svg";
    var root = document.getElementById(id);
    var def = document.createElementNS(svgNS,"clipPath");
    def.setAttribute('id','clip'+id);
    var clip = document.createElementNS(svgNS,"rect");
    clip.setAttribute('id','clip'+id+'rect');
    clip.setAttribute('x','0');
    clip.setAttribute('y','0');
    clip.setAttribute('width',width);
    clip.setAttribute('height',height);
    def.appendChild(clip);
    document.getElementById('def').appendChild(def);
    root.setAttribute('clip-path','url(#clip'+id+')');
    root.setAttribute('transform',transform);
    var rect = document.createElementNS(svgNS,"rect");
    rect.setAttribute('id',id+'rect');
    rect.setAttribute('x','0');
    rect.setAttribute('y','0');
    rect.setAttribute('width',width);
    rect.setAttribute('height',height);
    rect.setAttribute('fill','white');
    rect.setAttribute('stroke','black');
    root.appendChild(rect);
    var children = document.createElementNS(svgNS,'g');
    children.setAttribute('id',id+'children');
    if(b_scrollbar) children.setAttribute('transform','translate(15,0)');
    root.appendChild(children);
    if(b_scrollbar){
        var scrollBar = new Scrollbar(id, document.getElementById(id), null, document.getElementById(id+'children'));
    }
    this.setBackGround = function(background){
    //        var i = document.createElementNS("http://www.w3.org/2000/svg","image");
    //        i.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",background);
    //        i.setAttribute('id', 'background');
    //        i.setAttribute('x', '2');
    //        i.setAttribute('y', '2');
    //        i.setAttribute('width', this.width-5);
    //        i.setAttribute('height', this.height-5);
    //        document.getElementById('plan').insertBefore(i, document.getElementById('planchildren'));
    }
    this.setDropZone = function(list){
        Drop_zone(this.id, '*', 
            function(z, n, e) {
            //if(list!=undefined && list.indexOf(n) != -1)
            //  list.remove(n);
            }, 	function(z, n, e) {
            }, function(z, n, e) {
            }, function(z, n, e) {
            }, function(z, n, e) {
                if(z.node.id == n.parentNode.parentNode.id && n.id.slice(0,6) == 'device')
                    init_iframe(n.id,n.getAttributeNS('http://www.w3.org/1999/xlink','href'));
            }, function(z, n, e) {
                if(n.id.slice(0,6) == 'device'){
                    endDrageElement(n);
                    var MAm = z.getCTM().inverse();
                    var MB  = n.getCTM();
                    var MAB = MAm.multiply( MB );
                    var str_mtx = 'matrix(' + MAB.a 
                    + ', ' + MAB.b
                    + ', ' + MAB.c
                    + ', ' + MAB.d
                    + ', ' + MAB.e
                    + ', ' + MAB.f
                    + ')';
                    n.setAttribute('transform',str_mtx);
                    n.parentNode.removeChild(n);
                    document.getElementById(id+'children').appendChild(n);
                    if(list!=undefined){
                        //POST
                        var xhr = getXMLHttpRequest();
                        xhr.open("POST", "index.xhtml", true);
                        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
                        xhr.send("device="+n.getAttribute('id')+"&action=drop"+"&img="+n.getAttribute('href'));
                    }
                    else{
                        var xhr = getXMLHttpRequest();
                        var rect = n.getBBox();
                        rect.x = n.getBBox().width/2+n.getCTM().e;
                        rect.y = n.getBBox().height/2+n.getCTM().f;
                        rect.width = '1';
                        rect.height = '1';
                        var tmp = document.getElementById('mon_canvas').getIntersectionList(rect, document.getElementById('planchildrenrooms'));
                        console.log(tmp);
                        xhr.open("POST", "index.xhtml", true);
                        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
                        xhr.send("map="+n.getAttribute('id')+"&x="+MAB.e+"&y="+MAB.f+"&img="+n.getAttribute('href')+"&room="+tmp);
                    }
                }
            }
            );
        this.add = function(n){
            document.getElementById(id+'children').appendChild(n);
        }
    }
}

//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
//Create a new list in the root_node
//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
function List(root_node, dec,orientation){
    this.list = new Array();
    this.dec = dec
    this.orientation = orientation;
    this.root_node = root_node;
    this.cadre = document.getElementById('cadre_'+root_node.id);
    //add a element to the list
    this.add = function(e, index){
        var ind;
        var i;
        if(index == undefined || index > this.list.length)
            ind = this.list.length;
        else ind = index;
        e.setAttribute('transform','translate(0,0)');
        if(ind != 0){
            var last = this.list[ind-1];
            var bbox_l = last.getBBox();
            var point_tmp = document.getElementById('mon_canvas').createSVGPoint();
            point_tmp.x = bbox_l.width;
            point_tmp.y = bbox_l.height;
            var str_trans;
            if(this.orientation == 'vertical'){
                var y = this.dec + point_tmp.y;
                str_trans = ' translate(0,'+y+')';
            } else  {
                var x = this.dec + point_tmp.x;
                str_trans = ' translate('+x+', 0)';
            }
            e.setAttribute('transform',last.getAttribute('transform')+str_trans);
			
        }
        this.list.push(e);
        if(this.cadre != undefined){
            this.cadre.setAttribute('width',this.cadre.parentNode.getBBox().width);
            this.cadre.setAttribute('height',this.cadre.parentNode.getBBox().height);
        }
        var scrollBar = document.getElementById('scrollbardraggable'+root_node.parentNode.id);
        if(scrollBar != null){
            var parent_rect = document.getElementById(root_node.parentNode.id+'rect');
            scrollBar.setAttribute('height',parent_rect.getAttribute('height')*parent_rect.getAttribute('height')/root_node.getBBox().height);
        }
    }
    //remove a element to the list
    this.remove = function(e){
        var i;
        var bbox_e = e.getBBox();
        var str_trans;
        if(this.orientation == 'vertical'){
            var y = -(bbox_e.height+this.dec);
            str_trans = ' translate(0,'+y+')';
        } else  {
            var x = -(bbox_e.width+this.dec);
            str_trans = ' translate('+x+', 0)';
        }
        var ind = this.indexOf(e);
        if(ind!=-1){
            for(i=this.indexOf(e);i<this.list.length-1;i++){
                this.list[i] = this.list[i+1];
                this.list[i].setAttribute('transform',this.list[i].getAttribute('transform')+str_trans);
            }
            var tmp = this.list.pop();
            if(this.cadre != undefined){ 
                this.cadre.setAttribute('width',this.cadre.parentNode.getBBox().width-tmp.getBBox().width-dec);
                this.cadre.setAttribute('height',this.cadre.parentNode.getBBox().height);
                if(this.list.length==0)	this.cadre.setAttribute('width','0');
            }

            var scrollBar = document.getElementById('scrollbardraggable'+root_node.parentNode.id);
            if(scrollBar != null){
                var parent_rect = document.getElementById(root_node.parentNode.id+'rect');
                scrollBar.setAttribute('height',parent_rect.getAttribute('height')*parent_rect.getAttribute('height')/root_node.getBBox().height);
            }
        }
    }
    //return the element with the id id
    this.get = function(id){
        var i;
        for(i=0;i<this.list.length;i++){
            if(this.list[i].id == id)
                return this.list[i];
        }
        return null;
    }
    //return the index of the node node
    this.indexOf = function(node){
        var i;
        for(i=0;i<this.list.length;i++){
            if(this.list[i] == node){
                return i;
            }
        }
        return -1;
    }
	
    this.insert = function(e, index){
		
    }
}


//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
//Create a new device device with the image img
//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
function Device(device, img, type){
    var svgNS = "http://www.w3.org/2000/svg";
    var xlinkNS = "http://www.w3.org/1999/xlink";
    var width = 64;
    var height = 64;
    var i = document.createElementNS(svgNS,"image");
    i.setAttributeNS(xlinkNS,"xlink:href",img);
    i.setAttribute("id",device);
    i.setAttribute("type",type);
    i.setAttribute("x",'0');
    i.setAttribute("y",'0');
    i.setAttribute("width",width+'px');
    i.setAttribute("height",height+'px');
    return i;
}

//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
//Create a new user user with the image img, the associated devices list devices
//and the name name
//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
function User(user, img, devices, name){
    var svgNS = "http://www.w3.org/2000/svg";
    var xlinkNS = "http://www.w3.org/1999/xlink";
    var width = 64;
    var height = 64;
    this.devices = devices;
    var g = document.createElementNS(svgNS,"g");
    g.setAttribute("id",user);
    g.setAttribute("gdevices", user + "_devices");
    var i = document.createElementNS(svgNS,"image");
    i.setAttributeNS(xlinkNS,"xlink:href",img);
    i.setAttribute("id",user + '_img');
    i.setAttribute("x",'0');
    i.setAttribute("y",'0');
    i.setAttribute("width",width);
    i.setAttribute("height",height);
    g.appendChild(i);
    var t = document.createElementNS(svgNS,"text");
    t.appendChild(document.createTextNode(name));
    t.setAttribute('id','text'+user);
    t.setAttribute('font-size','12');
    t.setAttribute("x",width/3);
    t.setAttribute("y",height+12);
    g.appendChild(t);
    var gD = document.createElementNS(svgNS,"g");
    gD.setAttribute("id",user + "_devices");
    gD.setAttribute('transform','translate('+width+','+height/2+') scale(0.5)');
    var cadre = document.createElementNS(svgNS,'rect');
    cadre.setAttribute('id','cadre_'+user);
    cadre.setAttribute('fill','white');
    cadre.setAttribute('stroke','black');
    cadre.setAttribute('rx','10');
    cadre.setAttribute('ry','10');
		 
    gD.appendChild(cadre);
    g.appendChild(gD);
    this.list = undefined;
    this.node = g;
    this.setDropZone = function(list){
        var i;
        this.list = list;
        for(i=0; i<this.devices.length;i++){
            document.getElementById(this.node.getAttribute('id')+'_devices').appendChild(this.devices[i]);
            Draggable(this.devices[i].id,[this.devices[i].id], startDragElement, dragElement,  null);
            list.add(this.devices[i]);
        }
        Drop_zone(this.node.id, '*', 
            function(z, n, e) {
            //if(list!=undefined && list.indexOf(n) != -1)
            //  list.remove(n);
            }, 	function(z, n, e) {
            }, function(z, n, e) {
            }, function(z, n, e) {
            }, function(z, n, e) {
                if(z.node.id == n.parentNode.parentNode.id)
                    init_iframe(n.id,n.getAttributeNS('http://www.w3.org/1999/xlink','href'));
            }, function(z, n, e) {
                if(n.id.slice(0,6) == 'device'){
                    endDrageElement(n);
                    n.parentNode.removeChild(n);
                    document.getElementById(z.getAttribute('gdevices')).appendChild(n);
                    if(list!=undefined){
                        //list.add(n);
                        //POST
                        var xhr = getXMLHttpRequest();
                        xhr.open("POST", "index.xhtml", true);
                        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
                        xhr.send("user="+z.getAttribute('id')+"&device="+n.getAttribute('id')+"&img="+n.getAttribute('href'));
                    } 
                }
            }
            );
    };
}

//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
//Method call when an element is touch
//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
function startDragElement(n,e){
    //console.log('DEBUG');
}

//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
//Method call when an element is drag
//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
function dragElement(n,e){
    var MAm = document.getElementById('main').getCTM().inverse();
    var MB  = n.getCTM();
    var MAB = MAm.multiply( MB );
    var f = MAB.f;
    var str_mtx = 'matrix(' + MAB.a 
    + ', ' + MAB.b
    + ', ' + MAB.c
    + ', ' + MAB.d
    + ', ' + MAB.e
    + ', ' + MAB.f
    + ')';
    n.setAttribute('transform', str_mtx);
    n.style.opacity = "0.5";
    n.parentNode.removeChild(n);
    document.getElementById('main').appendChild(n);
}

			
//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
//Method call when an element is drop
//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
function endDrageElement(n){
    n.style.opacity = "1";
}

//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
//Method call when an element is click to creating a new iframe
//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
function init_iframe(id,src){
    var i = document.createElement('iframe');
    //Collect the server ip adresse form meta data
    var ip,w,h;
    g_metadata = document.getElementsByTagName("meta");
    var len = g_metadata.length;
    for (var j = 0; j < len; j++) 
        if (g_metadata[j].name == 'ip') 
            ip = g_metadata[j].content;
    //End ip collect
    
    //Get the type for the current device
    var type = document.getElementById(id).getAttribute("type");
    //type retreived
    w = 300; // default width
    h = 300; // default height
    if(type == 'DIMMING_LIGHT'){
        if(src == 'html/img/lightON.png')
            i.setAttribute('src','http://'+ip+':8080/gui_factory?device='+id+"&value=1");
        else if(src == 'html/img/lightOFF.png')
            i.setAttribute('src','http://'+ip+':8080/gui_factory?device='+id+"&value=0");
    }else if(type == 'BINARY_LIGHT'){
        if(src == 'html/img/lightON.png')
            i.setAttribute('src','http://'+ip+':8080/gui_factory?device='+id+"&value=1");
        else
            i.setAttribute('src','http://'+ip+':8080/gui_factory?device='+id+"&value=0");
    }else if(type == 'MEDIA_RENDERER'){
        h = 430;
        w = 335;
        i.setAttribute('src','http://'+ip+':8080/gui_factory?device='+id);
    }

    i.setAttribute('scrolling','no');
    i.setAttribute('style','position:absolute;top: 5px; left: 5px;width: '+(w-15)+'px; height: '+(h-15)+'px;background-color:white');
    i.setAttribute('align','middle');
    var d = new Dialog(id, i, w, h);
}

function close_iframe(id){
    document.getElementById('iframe'+id).parentNode.removeChild(document.getElementById('iframe'+id));
}

function groupclick(event){
    new Group(event.target.id, 'planchildren');
    document.getElementById(event.target.id).removeEventListener('click', groupclick, false);
    document.getElementById(event.target.id).removeEventListener('touchstart', groupclick, false);
    document.getElementById(event.target.id).addEventListener('click', groupendclick, false);
    document.getElementById(event.target.id).addEventListener('touchstart', groupendclick, false);
}

function groupendclick(event){
    document.getElementById('g'+event.target.id).parentNode.removeChild(document.getElementById('g'+event.target.id));
    document.getElementById(event.target.id).removeEventListener('click', groupendclick, false);
    document.getElementById(event.target.id).removeEventListener('touchstart', groupendclick, false);
    document.getElementById(event.target.id).addEventListener('click', groupclick, false);
    document.getElementById(event.target.id).addEventListener('touchstart', groupclick, false);
}