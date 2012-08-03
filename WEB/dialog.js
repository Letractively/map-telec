function Dialog(id, content){
	this.id = id;
	this.x_old;
	this.y_old;
	this.drag = false;
	this.dialog = document.createElement('div');
	this.dialog.setAttribute('id','dialog'+id);
	this.dialog.setAttribute('style','position:absolute;left:100px;top:10px;');
	this.mousedown = function(obj_dia, event) {
		obj_dia.x_old = event.pageX;
		obj_dia.y_old = event.pageY;
		obj_dia.drag = true;
	};
	this.mousemove = function(obj_dia, event) {
		if(obj_dia.drag){
			var x = parseInt(obj_dia.dialog.style.left) - obj_dia.x_old+ event.pageX ;
			var y = parseInt(obj_dia.dialog.style.top) - obj_dia.y_old+ event.pageY ;
			obj_dia.x_old = event.pageX;
			obj_dia.y_old = event.pageY;
			obj_dia.dialog.setAttribute('style','position:absolute;left:'+x+'px;top:'+y+'px;background-color:blue');
		}
	};
	this.mouseup = function(obj_dia, event){
		obj_dia.drag = false;
	};
	this.touchStart = function(obj_dia, event){
		event.preventDefault();
		if(event.touches.length == 1) {
			obj_dia.x_old = event.touches[0].pageX;
			obj_dia.y_old = event.touches[0].pageY;
			obj_dia.drag = true;
		}
	};
	this.touchMove = function(obj_dia, event){
		event.preventDefault();
		if(event.touches.length == 1) {
			if(obj_dia.drag){
				var x = parseInt(obj_dia.dialog.style.left) - obj_dia.x_old+ event.touches[0].pageX ;
				var y = parseInt(obj_dia.dialog.style.top) - obj_dia.y_old+ event.touches[0].pageY ;
				obj_dia.x_old = event.touches[0].pageX;
				obj_dia.y_old = event.touches[0].pageY;
				obj_dia.dialog.setAttribute('style','position:absolute;left:'+x+'px;top:'+y+'px;background-color:blue');
			}
		}
	};
	this.touchEnd = function(obj_dia, event){
		obj_dia.drag = false;
	};
	this.onclose = function(obj_dia, event){
		document.getElementById('dialog'+obj_dia.id).parentNode.removeChild(document.getElementById('dialog'+obj_dia.id));
	}
	
	var tomove = document.createElement('div');
		tomove.setAttribute('id','tomove'+id);
		tomove.setAttribute('style','width: 300px; height: 50px;	background: #eee none; border: 1px solid #ddd; cursor: move; position: relative;')
		tomove.addEventListener('mousedown', (function(obj_dia) {return (function(event) {obj_dia.mousedown(obj_dia, event);})})(this), true);
		tomove.addEventListener('mousemove', (function(obj_dia) {return (function(event) {obj_dia.mousemove(obj_dia, event);})})(this), true);
		tomove.addEventListener('mouseup', (function(obj_dia) {return (function(event) {obj_dia.mouseup(obj_dia, event);})})(this), true);
		tomove.addEventListener('touchstart', (function(obj_dia) {return (function(event) {obj_dia.touchStart(obj_dia, event);})})(this), true);
		tomove.addEventListener('touchmove', (function(obj_dia) {return (function(event) {obj_dia.touchMove(obj_dia, event);})})(this), true);
		tomove.addEventListener('touchend', (function(obj_dia) {return (function(event) {obj_dia.touchEnd(obj_dia, event);})})(this), true);
	var close = document.createElement('div');
		close.setAttribute('id','close'+id);
		close.setAttribute('style','width: 30px; height: 30px; position: relative; top: 10px; left: 260px; cursor: pointer');
		close.addEventListener('click', (function(obj_dia) {return (function(event) {obj_dia.onclose(obj_dia, event);})})(this),true);
                close.addEventListener('touchstart', (function(obj_dia) {return (function(event) {obj_dia.onclose(obj_dia, event);})})(this),true);
	var img = document.createElement('img');
		img.setAttribute('src','html/img/cross.png');
		img.setAttribute('width','auto');
		img.setAttribute('height','auto');
	var frame = document.createElement('div');
		frame.setAttribute('id','frame'+id);
		frame.setAttribute('style','width: 300px; height: 300px;	background: #eee none; border: 1px solid #ddd; position: relative;');
		
	document.body.appendChild(this.dialog);
	this.dialog.appendChild(tomove);
	this.dialog.appendChild(frame);
	tomove.appendChild(close);
	close.appendChild(img);
	frame.appendChild(content);
}