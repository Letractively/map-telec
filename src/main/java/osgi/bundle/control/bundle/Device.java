/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package osgi.bundle.control.bundle;

import bundle.osgi.bridge.inter.SmartObject;

/**
 *
 * @author Joachim
 */
class Device extends SmartObject{
    private String img;
    private String id;
    private float x;
    private float y;
    
    public Device(String uid, String name, String bridge, SMART_TYPE st, String img, String id){
        super(uid, name, bridge, st);
        this.img = img;
        this.id = id;
        x = 0;
        y = 0;
    }

    public Device(String uid, String name, String bridge, SMART_TYPE st, String img, float x, float y, String id) {
        super(uid, name, bridge, st);
        this.img = img;
        this.id = id;
        this.x = x;
        this.y = y;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final Device other = (Device) obj;
        if ((this.id == null) ? (other.id != null) : !this.id.equals(other.id)) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "var d1 = new Device('"+id+"','"+img+"');"+
        "document.getElementById('debarraschildren').appendChild(d1);"+
        "Draggable(d1.id,[d1.id], startDragElement, dragElement, null);"+
        "l.add(d1);";
    }
    
    public String getImg() {
        return img;
    }

    public float getX() {
        return x;
    }

    public float getY() {
        return y;
    }

    public void setX(float x) {
        this.x = x;
    }

    public void setY(float y) {
        this.y = y;
    }

    public String getId() {
        return id;
    }

    boolean isNear(Device dev) {
        return Math.abs(x - dev.getX())<10 && Math.abs(y - dev.getY())<10;
    }
}
