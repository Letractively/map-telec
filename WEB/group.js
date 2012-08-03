function Group(id, root){
    this.id = document.getElementById(id);
    this.root = document.getElementById(root);
//    this.line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
//    this.line.setAttribute('id', id+'lign');
//    this.line.setAttribute('x1', '0');
//    this.line.setAttribute('y1', '0');
//    this.line.setAttribute('x2', this.id.getCTM().e);
//    this.line.setAttribute('y2', this.id.getCTM().f);
//    this.line.setAttribute('stroke','black');
//    this.root.appendChild(this.line);
    this.gback = document.createElementNS('http://www.w3.org/2000/svg','g');
    this.gback.setAttribute('id', 'g'+id);
    this.root.appendChild(this.gback);
    this.back = document.createElementNS('http://www.w3.org/2000/svg','rect');
    this.back.setAttribute('id',id+'rect');
    this.back.setAttribute('x','0');
    this.back.setAttribute('y','0');
    this.back.setAttribute('width','200');
    this.back.setAttribute('height','200');
    this.back.setAttribute('fill','white');
    this.back.setAttribute('stroke','black');
    this.gback.appendChild(this.back);
    this.children = document.createElementNS('http://www.w3.org/2000/svg','g');
    this.children.setAttribute('id', 'children'+id);
    this.gback.appendChild(this.children);
    RotoZoomable(this.gback.id,[this.back.id],null,null,null,null,null,null);
    Drop_zone(this.gback.id, '*', 
            function(z, n, e) {
            }, 	function(z, n, e) {
            }, function(z, n, e) {
            }, function(z, n, e) {
            }, function(z, n, e) {
                if(z.node.id == n.parentNode.parentNode.id && n.id.slice(0,6) == 'device')
                    init_iframe(n.id,n.getAttributeNS('http://www.w3.org/1999/xlink','xlink:href'));
            }, function(z, n, e) {
                if(n.id.slice(0,6) == 'device'){
                    console.log(n);
                    console.log(z);
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
                    document.getElementById('children'+id).appendChild(n);
                    //POST
                    var xhr = getXMLHttpRequest();
                    xhr.open("POST", "index.xhtml", true);
                    xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
                    xhr.send("group="+z.id+"&id="+n.id+"&x="+MAB.e+"&y="+MAB.f);
                }
            }
            );
        //POST
        var xhr = getXMLHttpRequest();
        xhr.open("POST", "index.xhtml", true);
        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        xhr.send("group="+this.gback.id+"&draw=true");
    
}