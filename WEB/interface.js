//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
function init_every() {
    /*if(navigator.appName!="Opera"){
				document.body.innerHTML = "Veuillez t&eacute;l&eacute;charger Opera";
			}
			else{*/
    init_draggable();
				
    var userContainer = new Container('users',true,window.innerWidth/2-window.innerWidth/120,window.innerHeight/2-window.innerHeight/60,'translate(0,0)');
    var user_list = init_users();
				
    debarrasContainer = new Container('debarras',true,window.innerWidth/2-window.innerWidth/120,window.innerHeight/2-window.innerHeight/60,'translate(0,'+62*window.innerHeight/120+')');
    var devices_list = init_devices();
    debarrasContainer.setDropZone(devices_list);

    var mapContainer = new Container('plan',false,window.innerWidth/2-window.innerWidth/120,4*window.innerHeight/5-window.innerHeight/60,'translate('+122*window.innerWidth/240+','+65*window.innerHeight/300+')');
    mapContainer.setDropZone();
				
    var cloudContainer = new Container('cloud',false,window.innerWidth/2-window.innerWidth/120,window.innerHeight/5-window.innerHeight/60,'translate('+122*window.innerWidth/240+',0)');
				
    var sepNSO = new Separator('separatornordsudouest', document.getElementById('main'),  'horizontal', [document.getElementById(userContainer.id)],  [document.getElementById(debarrasContainer.id)], document.getElementById(userContainer.id));
    var sepEO = new Separator('separatorestouest', document.getElementById('main'),  'vertical', [document.getElementById(userContainer.id),document.getElementById(debarrasContainer.id)],  [document.getElementById(cloudContainer.id),document.getElementById(mapContainer.id)], document.getElementById('main'));
    var sepNSE = new Separator('separatornordsudest', document.getElementById('main'),  'horizontal', [document.getElementById(cloudContainer.id)],  [document.getElementById(mapContainer.id)], document.getElementById(cloudContainer.id));
//}				
}



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
        ;
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
        else{
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
            y0 = window.innerHeight - gr_node2[1].getBBox().height;
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
        console.log(bbox_scrollnode.height+MAB.f+" / "+MB.f);
        //contraintes
        if(-MAB.f>0){
            console.log('normal');
            y = MAB.f
            y_s = -MAB.f*(child.getAttribute('height')-bbox_scrollbar.height)/(bbox_scrollnode.height-child.getAttribute('height'));
        }else if(-MAB.f<=0){
            console.log('haut');
            y_s = 0;
            y = 0;
        }else{
            console.log('bas');
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
function Container(	id, b_scrollbar, width, height, transform){
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
    this.setDropZone = function(list){
        Drop_zone(this.id, '*', 
            function(z, n, e) {
                console.log("startD");
                if(list!=undefined && list.indexOf(n) != -1)
                    list.remove(n);
            }, 	function(z, n, e) {
                console.log("hoverD");
            }, function(z, n, e) {
                console.log("outD");
            }, function(z, n, e) {
                console.log("doneD");
            }, function(z, n, e) {
                console.log("undoneD");
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
                    if(list!=undefined) list.add(n);
                }
            }
            );
    }
}

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
function PanelDrop(panel, dropItem, start, hover, out, done, undone, fct){
    this.panel = panel;
    this.dropItem = dropItem;
    Drop_zone(panel, dropItem, start, hover, out, done, undone, fct);
}

//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
function Device(device, img){
    var svgNS = "http://www.w3.org/2000/svg";
    var xlinkNS = "http://www.w3.org/1999/xlink";
    var width = 64;
    var height = 64;
    var i = document.createElementNS(svgNS,"image");
    i.setAttributeNS(xlinkNS,"xlink:href",img);
    i.setAttribute("id",device);
    i.setAttribute("x",'0');
    i.setAttribute("y",'0');
    i.setAttribute("width",width+'px');
    i.setAttribute("height",height+'px');
    return i;
}

//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
function User(user, img, devices, name){
    var svgNS = "http://www.w3.org/2000/svg";
    var xlinkNS = "http://www.w3.org/1999/xlink";
    var width = 64;
    var height = 64;
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
    this.node = g;
    this.setDropZone = function(list){
        Drop_zone(this.node.id, '*', 
            function(z, n, e) {
                if(list!=undefined && list.indexOf(n) != -1)
                    list.remove(n);
            }, 	function(z, n, e) {
            }, function(z, n, e) {
            }, function(z, n, e) {
            }, function(z, n, e) {
            }, function(z, n, e) {
                if(n.id.slice(0,6) == 'device'){
                    endDrageElement(n);
                    n.parentNode.removeChild(n);
                    document.getElementById(z.getAttribute('gdevices')).appendChild(n);
                    if(list!=undefined) list.add(n);
                }
            }
            );
    }
}
			
//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
function startDragElement(n,e){
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
function endDrageElement(n){
    n.style.opacity = "1";
}
			
//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
function endDragOnUser(z,n,e){
    if(n.id.slice(0,6) == "device"){
        var svgNS = "http://www.w3.org/2000/svg";
        endDrageElement(n);
        var bbox_user = z.getBBox();
        var point_tmp = document.getElementById('mon_canvas').createSVGPoint();
        point_tmp.x = bbox_user.x + bbox_user.width;
        point_tmp.y = bbox_user.y;
		
        var noeud_repere = z;
        point_tmp = point_tmp.matrixTransform( noeud_repere.getCTM().inverse() );
        var n_devices = document.getElementById( noeud_repere.getAttribute('gdevices') );
        console.log('Device group ' + noeud_repere.getAttribute('gdevices') + ' is node ' + n_devices);
        n.parentNode.removeChild(n);
        n_devices.appendChild(n);
        var str_mtx = 'translate('  + (5 + point_tmp.x)
        + ', ' + (5 + point_tmp.y)
        + ')';
        n_devices.setAttribute('transform', str_mtx);
    }
}
						
//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
function init_users(){
    var u1 = new User("user1","html/img/user1.png",null, 'user1');
    document.getElementById('userschildren').appendChild(u1.node);
    u1.setDropZone(new List(document.getElementById(u1.node.id),0,'horizontal'));
    var u2 = new User("user2","html/img/user2.png",null, 'user2');
    document.getElementById('userschildren').appendChild(u2.node);
    u2.setDropZone(new List(document.getElementById(u2.node.id),0,'horizontal'));
    var u3 = new User("user3","html/img/user3.png",null, 'user3');
    document.getElementById('userschildren').appendChild(u3.node);
    u3.setDropZone(new List(document.getElementById(u3.node.id),10,'horizontal'));
    var u4 = new User("user4","html/img/user4.png",null, 'user4');
    document.getElementById('userschildren').appendChild(u4.node);
    u4.setDropZone(new List(document.getElementById(u4.node.id),10,'horizontal'));
    var u5 = new User("user5","html/img/user5.png",null, 'user5');
    document.getElementById('userschildren').appendChild(u5.node);
    u5.setDropZone(new List(document.getElementById(u5.node.id),10,'horizontal'));
    var l = new List(document.getElementById('userschildren'),20,'vertical');
    l.add(u1.node);
    l.add(u2.node);
    l.add(u3.node);
    l.add(u4.node);
    l.add(u5.node);
    return l;
}

//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
function init_devices(){
    var d1 = new Device("device1","html/img/device1.png");
    document.getElementById('debarraschildren').appendChild(d1);
    Draggable(d1.id,[d1.id], startDragElement, null,  null);
    var d2 = new Device("device2","html/img/device2.png");
    document.getElementById('debarraschildren').appendChild(d2);
    Draggable(d2.id,[d2.id], startDragElement, null,  null);
    var d3 = new Device("device3","html/img/device3.png");
    document.getElementById('debarraschildren').appendChild(d3);
    Draggable(d3.id,[d3.id], startDragElement, null,  null);
    var d4 = new Device("device4","html/img/device4.png");
    document.getElementById('debarraschildren').appendChild(d4);
    Draggable(d4.id,[d4.id], startDragElement, null,  null);
    var d5 = new Device("device5","html/img/device5.png");
    document.getElementById('debarraschildren').appendChild(d5);
    Draggable(d5.id,[d5.id], startDragElement, null,  null);
    var l = new List(document.getElementById('debarraschildren'),20,'vertical');
    l.add(d1);
    l.add(d2);
    l.add(d3);
    l.add(d4);
    l.add(d5);
    return l;

}