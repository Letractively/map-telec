/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package osgi.bundle.control.bundle;

/**
 *
 * @author Joachim
 */
public class Room {
    private String id;
    private String x;
    private String y;
    private String width;
    private String height;
    private String color;

    public Room(String id, String x, String y, String width, String height, String color) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    public String getColor() {
        return color;
    }

    public String getHeight() {
        return height;
    }

    public String getId() {
        return id;
    }

    public String getWidth() {
        return width;
    }

    public String getX() {
        return x;
    }

    public String getY() {
        return y;
    }

    @Override
    public String toString() {
        return "plan"+id + "/" + x + "/" + y + "/" + width + "/" + height + "/" + color;
    }
    
    public String toScript(){
        return "{id:'"+id+"',x:'"+x+ "',y:'" + y + "',width:'" + width + "',height:'" + height + "',color:'"+ color+"',root:document.getElementById('editmapcanvas')}";
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final Room other = (Room) obj;
        if ((this.id == null) ? (other.id != null) : !this.id.equals(other.id)) {
            return false;
        }
        return true;
    }

    @Override
    public int hashCode() {
        int hash = 7;
        return hash;
    }
    
    
}
