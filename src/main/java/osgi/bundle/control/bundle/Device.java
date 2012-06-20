/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package osgi.bundle.control.bundle;

/**
 *
 * @author Joachim
 */
class Device {
    private String id;
    private String img;
    private float x;
    private float y;
    
    public Device(String id, String img){
        this.id = id;
        this.img = img;
        x = 0;
        y = 0;
    }

    public Device(String id, String img, float x, float y) {
        this.id = id;
        this.img = img;
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
        return "var d1 = new Device('"+id+"','html/"+img+"');"+
        "document.getElementById('debarraschildren').appendChild(d1);"+
        "Draggable(d1.id,[d1.id], startDragElement, null,  null);"+
        "l.add(d1);";
    }

    public String getId() {
        return id;
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
    
    
    
}
