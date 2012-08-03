/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package osgi.bundle.control.bundle;

import bundle.osgi.bridge.inter.SmartObject;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

/**
 *
 * @author Joachim
 */
public class DataTelec {

    private ArrayList<User> users;
    private ArrayList<Device> devices;
    private ArrayList<Device> map;
    private ArrayList<Room> rooms;
    private HashMap<Device, ArrayList<Device>> deviceGroups;
    private int nbGroup;

    public DataTelec() {
        users = new ArrayList<User>();
        devices = new ArrayList<Device>();
        map = new ArrayList<Device>();
        rooms = new ArrayList<Room>();
        deviceGroups = new HashMap<Device, ArrayList<Device>>();
        nbGroup = 0;
    }

    public void addUser(User u) {
        if (!users.contains(u)) {
            users.add(u);
        }
    }

    public void addDevice(Device d) {
        if (!devices.contains(d)) {
            devices.add(d);
        }
    }

    public String addMap(Device d) {
        String res = "";
        for (Iterator<Device> it = deviceGroups.keySet().iterator(); it.hasNext();) {
            Device dev = it.next();
            if (res.equals("") && d.isNear(dev)) {
                d.setX(0);
                d.setY(0);
                deviceGroups.get(dev).add(d);
                res += "added/" + d.getId() + "/" + dev.getId() + "/" + deviceGroups.get(dev).size();
            }
        }
        if (res.equals("")) {
            if (!map.isEmpty()) {
                Device del = null;
                for (Device dev : map) {
                    if (!d.equals(dev) && d.isNear(dev)) {
                        del = dev;
                        ArrayList<Device> tmp = new ArrayList<Device>();
                        Device group = new Device("group" + nbGroup, null, null, SmartObject.SMART_TYPE.UNKNOWN, "html/img/group.png", d.getX(), d.getY(), "group" + nbGroup);
                        d.setX(0);
                        dev.setX(0);
                        d.setY(0);
                        dev.setY(0);
                        tmp.add(d);
                        tmp.add(dev);
                        deviceGroups.put(group, tmp);
                        res += "newgroup/" + group.getId() + "/" + group.getX() + "/" + group.getY() + "/" + dev.getId() + "/" + d.getId();
                        nbGroup++;
                    }
                }
                removeMap(del);
            }
        }
        if (res.equals("")) {
            if (!map.contains(d)) {
                map.add(d);
            } else {
                map.get(map.indexOf(d)).setX(d.getX());
                map.get(map.indexOf(d)).setY(d.getY());
            }
        }
        return res;
    }

    public void removeUser(User u) {
        users.remove(u);
    }

    public void removeDevice(Device d) {
        devices.remove(d);
    }

    public void removeMap(Device d) {
        map.remove(d);
    }

    public ArrayList<Device> getDevices() {
        return devices;
    }

    public ArrayList<User> getUsers() {
        return users;
    }

    public ArrayList<Device> getMap() {
        return map;
    }

    public ArrayList<Room> getRooms() {
        return rooms;
    }

    public String initUsers() {
        String res = "function init_users(){"
                + "var l = new List(document.getElementById('userschildren'),20,'vertical');"
                + "var user_list = new Array();";
        for (User u : users) {
            res += u.toString();
        }
        res += "return [user_list,l];}";
        return res;
    }

    public String initDevices() {
        String res = "function init_devices(){"
                + "var l = new List(document.getElementById('debarraschildren'),20,'vertical');";
        for (Device d : devices) {
            res += d.toString();
        }
        res += "return l;}";
        return res;
    }

    public String initMap() {
        String res = "";
        if (!map.isEmpty()) {
            for (Device d : map) {
                res += "var d1 = new Device('" + d.getId() + "','" + d.getImg() + "');"
                        + "mapContainer.add(d1);"
                        + "d1.setAttribute('transform','translate(" + d.getX() + "," + d.getY() + ")');"
                        + "Draggable(d1.id,[d1.id], startDragElement, dragElement, null);";
            }
        }
        return res;
    }

    public String initDeviceGroups() {
        String res = "";
        if (!deviceGroups.isEmpty()) {
            for (Iterator<Device> it = deviceGroups.keySet().iterator(); it.hasNext();) {
                Device d = it.next();
                if(deviceGroups.get(d).size()>0){
                    res += "var d1 = new Device('" + d.getId() + "','" + d.getImg() + "');"
                            + "mapContainer.add(d1);"
                            + "d1.setAttribute('transform','translate(" + d.getX() + "," + d.getY() + ")');"
                            + "d1.addEventListener('click', groupclick, false);"
                            + "d1.addEventListener('touchstart', groupclick, false);"
                            + "var t = document.createElementNS(\"http://www.w3.org/2000/svg\",\"text\");"
                            + "t.appendChild(document.createTextNode("+deviceGroups.get(d).size()+"));"
                            + "t.setAttribute('id','text'+'"+d.getId()+"');"
                            + "t.setAttribute('font-size','12');"
                            + "t.setAttribute('transform','translate(" + d.getX() + "," + d.getY() + ")');"
                            + "document.getElementById('planchildren').appendChild(t);";
                }
            }
        }
        return res;
    }

    public String init() {
        return "function init_every() {"
                + "init_draggable();"
                + "var userContainer = new Container('users',true,window.innerWidth/2-window.innerWidth/120,window.innerHeight/2-window.innerHeight/60,'translate(0,0)');"
                + "var user_lists = init_users();"
                + "debarrasContainer = new Container('debarras',true,window.innerWidth/2-window.innerWidth/120,window.innerHeight/2-window.innerHeight/60,'translate(0,'+62*window.innerHeight/120+')');"
                + "var devices_list = init_devices();"
                + "debarrasContainer.setDropZone(devices_list);"
                + "var mapContainer = new Container('plan',false,window.innerWidth/2-window.innerWidth/120,4*window.innerHeight/5-window.innerHeight/60,'translate('+122*window.innerWidth/240+','+65*window.innerHeight/300+')');"
                + "mapContainer.setDropZone();"
                + "mapContainer.setBackGround('html/img/map.png');"
                + initMap()
                + "var cloudContainer = new Container('cloud',false,window.innerWidth/2-window.innerWidth/120,window.innerHeight/5-window.innerHeight/60,'translate('+122*window.innerWidth/240+',0)');"
                + "var sepNSO = new Separator('separatornordsudouest', document.getElementById('main'),  'horizontal', [document.getElementById(userContainer.id)],  [document.getElementById(debarrasContainer.id)], document.getElementById(userContainer.id));"
                + "var sepEO = new Separator('separatorestouest', document.getElementById('main'),  'vertical', [document.getElementById(userContainer.id),document.getElementById(debarrasContainer.id)],  [document.getElementById(cloudContainer.id),document.getElementById(mapContainer.id)], document.getElementById('main'));"
                + "var sepNSE = new Separator('separatornordsudest', document.getElementById('main'),  'horizontal', [document.getElementById(cloudContainer.id)],  [document.getElementById(mapContainer.id)], document.getElementById(cloudContainer.id));"
                + "var tmp = document.createElementNS('http://www.w3.org/2000/svg','text');"
                + "tmp.setAttribute('id','text_tmp');"
                + "tmp.setAttribute('x','20');"
                + "tmp.setAttribute('y','20');"
                + "tmp.appendChild(document.createTextNode('test'));"
                + "document.getElementById('plan').appendChild(tmp);"
                + "var g = document.createElementNS('http://www.w3.org/2000/svg','g');"
                + "g.setAttribute('id','planchildrenrooms');"
                + "document.getElementById('planchildren').appendChild(g);"
                + "updateMap('" + roomsToString() + "');"
                + initDeviceGroups()
                + "getAjax(user_lists, devices_list);"
                + "var h = window.innerHeight-32;"
                + "var w = window.innerWidth-32;"
                + "document.getElementById('edit').setAttribute('style','position: absolute;top:'+h+'px;left:'+w+'px');"
                + "}";
    }
    
    @Override
    public String toString() {
        return initUsers() + initDevices() + init();
    }

    void add(Device device, User user) {
        users.get(users.indexOf(user)).addDevice(device);
    }

    void removeUserDevice(Device device) {
        for (User u : users) {
            u.removeDevice(device);
        }
    }
    
    void removeGroupDevice(Device device){
        for (Iterator<Device> it = deviceGroups.keySet().iterator(); it.hasNext();) {
            Device group = it.next();
            if(deviceGroups.get(group).remove(device)){
                nbGroup--;
            }
        }
    }

    public String roomsToString() {
        if (rooms.isEmpty()) {
            return "";
        } else {
            String res = "room:";
            for (Room r : rooms) {
                res += r.toString() + "&";
            }
            return res.substring(0, res.length() - 1);
        }
    }

    public String roomsToStringScript() {
        String res = "";
        for (Room r : rooms) {
            res += r.toScript() + ",";
        }
        if (res.equals("")) {
            return res;
        } else {
            return res.substring(0, res.length() - 1);
        }
    }

    void reinitRooms() {
        rooms = new ArrayList<Room>();
    }
    
    public HashMap<Device, ArrayList<Device>> getDeviceGroups() {
        return deviceGroups;
    }

    String groupToString(Device group) {
        String res = "drawgroup*"+group.getId();
        for (Device device : deviceGroups.get(group)) {
            res += "*"+device.getId()+"*"+device.getImg()+"*"+device.getX()+"*"+device.getY();
        }
        return res;
    }
}