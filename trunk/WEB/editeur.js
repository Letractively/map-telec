var rooms = new Array();
var nbRoom = 0;
var isDrag = false;
var currRoom = null;
var root = null;
var svgNS = "http://www.w3.org/2000/svg";
var xlinkNS = "http://www.w3.org/1999/xlink";

function Room(id,x,y,width,height,color,root_node, name){
    this.x0 = x;
    this.y0 = y;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.id = generateId(id);
    this.root = root_node;
    this.node = document.createElementNS(svgNS, 'rect');
    this.node.setAttribute('id', this.id);
    this.node.setAttribute('x', x);
    this.node.setAttribute('y', y);
    this.node.setAttribute('width', width);
    this.node.setAttribute('height', height);
    this.node.setAttribute('fill',color);
    this.node.setAttribute('stroke','black');
    this.text = document.createElementNS(svgNS,'text');
    if(name == undefined)
        this.text.appendChild(document.createTextNode(this.id));
    else this.text.appendChild(document.createTextNode(name));
    this.text.setAttribute('id','text'+this.id);
    this.text.setAttribute('font-size','12');
    this.text.setAttribute('x',x);
    var yTmp = parseFloat(y) + 12;
    this.text.setAttribute('y',yTmp);
    this.g = document.createElementNS(svgNS, 'g');
    this.g.appendChild(this.node);
    this.g.appendChild(this.text);
    this.root.appendChild(this.g);
    this.setSize = function(w,h){
        if(w>=this.x0 && h>=this.y0){
            this.width = w-this.x;
            this.height = h-this.y;
            this.node.setAttribute('width', w-this.x);
            this.node.setAttribute('height', h-this.y);
        }else if(w>=this.x0 && h<=this.y0){
            this.height += this.y - h;
            this.y = h;
            this.width = w-this.x;
            this.node.setAttribute('y', h);
            this.node.setAttribute('width', w-this.x);
            this.node.setAttribute('height', this.height);
        }else if(w<=this.x0 && h<=this.y0){
            this.width += this.x - w;
            this.height += this.y - h;
            this.x = w;
            this.y = h;
            this.node.setAttribute('x', w);
            this.node.setAttribute('y', h);
            this.node.setAttribute('width', this.width);
            this.node.setAttribute('height', this.height);
        }else{
            this.width += this.x - w;
            this.x = w;
            this.height = -this.y + h;
            this.node.setAttribute('x', w);
            this.node.setAttribute('width', this.width);
            this.node.setAttribute('height', this.height);
        }
        this.text.setAttribute('x',this.x);
        this.text.setAttribute('y',this.y+12);
    }
    
    this.isValide = function(){
        return (Math.abs(this.width) > 10 && Math.abs(this.height) > 10);
    }
    
    this.del = function(){
        root.removeChild(this.node.parentNode);
        removeRoom(this.id);
    }
}

function mousedown(event){
    console.log(rooms);
    if(event.target.id == 'back'){
        var room = new Room('room'+nbRoom,event.pageX,event.pageY,0,0,'gray',root);
        rooms.push(room);
        isDrag = true;
        currRoom = room;
        nbRoom++;
    }else{
        new Dialog(event.target.id,dialogToString(event.target.id));
    }
}

function mousemove(event){
    if(isDrag){
        currRoom.setSize(event.pageX,event.pageY);
    }    
}

function mouseup(event){
    console.log('up');
    if(!currRoom.isValide() && isDrag){
        currRoom.del();
        nbRoom--;
    }
    isDrag = false;
}

function touchstart(event){
    event.preventDefault();
    if(event.touches.length == 1) {
        if(event.target.id == 'back'){
            var room = new Room('room'+nbRoom,event.touches[0].pageX,event.touches[0].pageY,0,0,'gray',root);
            rooms.push(room);
            isDrag = true;
            currRoom = room;
            nbRoom++;
        }else{
            new Dialog(event.target.id,dialogToString(event.target.id));
        }
    }
}

function touchmove(event){
    event.preventDefault();
    if(event.touches.length == 1) {
        if(isDrag){
            currRoom.setSize(event.touches[0].pageX,event.touches[0].pageY);
        } 
    }
}

function touchend(event){
    console.log('up');
    isDrag = false;
    if(!currRoom.isValide()){
        currRoom.del();
        nbRoom--;
    }
}

function initMap(liste){
    rooms = new Array();
    nbRoom = 0;
    root = document.getElementById('editmapcanvas');
    root.setAttribute('style', 'position: absolute; top: 0px; left: 0px; width: '+window.innerWidth+'px; height: '+window.innerHeight+'px');
    var back = document.createElementNS(svgNS, 'rect');
        back.setAttribute('id', 'back');
        back.setAttribute('x', 0);
        back.setAttribute('y', 0);
        back.setAttribute('width', window.innerWidth);
        back.setAttribute('height', window.innerHeight);
        back.setAttribute('fill','white');
    root.addEventListener('mousedown', mousedown, false);
    root.addEventListener('mousemove', mousemove, false);
    root.addEventListener('mouseup', mouseup, false);
    root.addEventListener('touchstart', touchstart, false);
    root.addEventListener('touchmove', touchmove, false);
    root.addEventListener('touchend', touchend, false);
    root.appendChild(back);
    var fin = document.createElement('button');
    fin.setAttribute('value', 'fin');
    fin.setAttribute('id', 'fin');
    fin.setAttribute('style', 'position: absolute;top:0;left:0');
    fin.appendChild(document.createTextNode('Finish !'));
    fin.addEventListener('click', finish, true);
    document.body.appendChild(fin);
    
    var i;
    for(i=0 ; i<liste.length ; i++){
        var room = new Room(liste[i].id,liste[i].x,liste[i].y,liste[i].width,liste[i].height,liste[i].color, liste[i].root);
        rooms.push(room);
        nbRoom++;
    }
    
    console.log(nbRoom);
}

function clickOkDialog(old_id){
    var id = document.getElementById('input'+old_id).value;
    var color = document.getElementById('select'+old_id).value;
    setRoom(old_id,color,id);
    console.log(document.getElementById(old_id));
    document.getElementById(old_id).setAttribute('fill', color);
    if (id!=null && id!=""){
        document.getElementById('text'+old_id).childNodes[0].data = id;
        document.getElementById('text'+old_id).setAttribute('id', 'text'+id);
        document.getElementById(old_id).setAttribute('id', id);
    }
}

function clickDelDialog(old_id){
    var i = 0;
    while(rooms[i].id != old_id){
        i++;
    }
    rooms[i].del();
}

function dialogToString(id){
    var id_input = document.createElement('input');
        id_input.setAttribute('type', 'text');
        id_input.setAttribute('id', 'input'+id);
        id_input.setAttribute('name', 'id');
        id_input.setAttribute('value', id);
    var gray = document.createElement('option');
        gray.setAttribute('value', 'gray');
        gray.appendChild(document.createTextNode('gray'));
    var red = document.createElement('option');
        red.setAttribute('value', 'red');
        red.appendChild(document.createTextNode('red'));
    var blue = document.createElement('option');
        blue.setAttribute('value', 'blue');
        blue.appendChild(document.createTextNode('blue'));
    var green = document.createElement('option');
        green.setAttribute('value', 'green');
        green.appendChild(document.createTextNode('green'));
    var yellow = document.createElement('option');
        yellow.setAttribute('value', 'yellow');
        yellow.appendChild(document.createTextNode('yellow'));
    var pink = document.createElement('option');
        pink.setAttribute('value', 'pink');
        pink.appendChild(document.createTextNode('pink'));
    var choose_color = document.createElement('select');
        choose_color.setAttribute('name', 'color');
        choose_color.setAttribute('id', 'select'+id);
        choose_color.appendChild(gray);
        choose_color.appendChild(red);
        choose_color.appendChild(green);
        choose_color.appendChild(blue);
        choose_color.appendChild(yellow);
        choose_color.appendChild(pink);
    var button = document.createElement('button');
        button.setAttribute('value', 'Ok');
        button.appendChild(document.createTextNode('Ok'));
        button.addEventListener('click', (function(old_id) {return (function() {clickOkDialog(old_id);})})(id), true);
    var suppr = document.createElement('button');
        suppr.setAttribute('value', 'delete');
        suppr.appendChild(document.createTextNode('Delete'));
        suppr.addEventListener('click', (function(old_id) {return (function() {clickDelDialog(old_id);})})(id), true);
    var end = document.createElement('div');
        end.appendChild(document.createTextNode('Please enter a new id : '));
        end.appendChild(document.createElement('br'));
        end.appendChild(id_input);
        end.appendChild(document.createElement('br'));
        end.appendChild(document.createElement('br'));
        end.appendChild(document.createTextNode('Choose the room\'s color : '));
        end.appendChild(document.createElement('br'));
        end.appendChild(choose_color);
        end.appendChild(document.createElement('br'));
        end.appendChild(document.createElement('br'));
        end.appendChild(button);
        end.appendChild(suppr);
 return end;
}

function removeRoom(id){
    var i = 0;
    while(rooms[i].id != id){
        i++;
    }
    console.log(i);
    rooms.splice(i,1);
}

function setRoom(id,color,new_id){
    var i = 0;
    while(rooms[i].id != id){
        i++;
    }
    console.log(i+' : '+id+'/'+new_id);
    rooms[i].id = new_id;
    rooms[i].color = color;
}

function finish(){
    var res = 'plan'+rooms[0].id+'='+rooms[0].x+'/'+rooms[0].y+'/'+rooms[0].width+'/'+rooms[0].height+'/'+rooms[0].color;
    var i;
    for(i=1 ; i<rooms.length ; i++){
        res += '&'+ 'plan'+rooms[i].id+'='+rooms[i].x+'/'+rooms[i].y+'/'+rooms[i].width+'/'+rooms[i].height+'/'+rooms[i].color;
    }
    var doc = document.getElementById('editmapcanvas')
    while( doc.firstChild) {
        doc.removeChild(doc.firstChild);
    }
    document.body.removeChild(document.getElementById('fin'));
    root.setAttribute('style', '');
    root.removeEventListener('mousedown', mousedown, false);
    root.removeEventListener('mousemove', mousemove, false);
    root.removeEventListener('mouseup', mouseup, false);
    root.removeEventListener('touchstart', touchstart, false);
    root.removeEventListener('touchmove', touchmove, false);
    root.removeEventListener('touchend', touchend, false);
    //POST
    var xhr = getXMLHttpRequest();
    xhr.open("POST", "index.xhtml", true);
    xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    xhr.send(res);
}

function generateId(id){
    res = id;
    while(exist(res)){
        nbRoom++;
        res = res.substring(0,res.length-1)+nbRoom;
    }
    return res;
}

function exist(res){
    var i;
    for(i=0;i<rooms.length;i++){
        if(rooms[i].id == res){
            return true;
        }
    }
    return false;
}