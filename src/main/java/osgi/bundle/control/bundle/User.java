/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package osgi.bundle.control.bundle;

import java.util.ArrayList;

/**
 *
 * @author Joachim
 */
class User {

    private String id;
    private String name;
    private String img;
    private ArrayList<Device> devices;

    public User(String id, String img) {
        this.id = id;
        this.name = id;
        this.img = img;
        devices = new ArrayList<Device>();
    }

    public User(String id, String img, String name) {
        this.id = id;
        this.img = img;
        this.name = name;
        devices = new ArrayList<Device>();
    }

    public void addDevice(Device d) {
        if (!devices.contains(d)) {
            devices.add(d);
        }
    }

    public void removeDevice(Device d) {
        devices.remove(d);
    }

    public ArrayList<Device> getDevices() {
        return devices;
    }
    
    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final User other = (User) obj;
        if ((this.id == null) ? (other.id != null) : !this.id.equals(other.id)) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        String tab = "var devices = new Array();";
        for (Device d : devices) {
            tab += "var d = new Device('" + d.getId() + "','" + d.getImg() + "');"
                    + "devices.push(d);";
        }
        return tab + "var u1 = new User('" + id + "','html/" + img + "',devices, '" + name + "');"
                + "document.getElementById('userschildren').appendChild(u1.node);"
                + "u1.setDropZone(new List(document.getElementById(u1.node.id),0,'horizontal'));"
                + "l.add(u1.node);"
                + "user_list.push(u1);";
    }
}
