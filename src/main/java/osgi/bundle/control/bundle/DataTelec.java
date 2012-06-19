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
public class DataTelec {
    private ArrayList<User> users;
    private ArrayList<Device> devices;
    private ArrayList<Device> map;
    
    public DataTelec(){
        users = new ArrayList<User>();
        devices = new ArrayList<Device>();
        map = new ArrayList<Device>();
    }
    
    public void addUser(User u){
        if(!users.contains(u))
            users.add(u);
    }
    
    public void addDevice(Device d){
        if(!devices.contains(d))
            devices.add(d);
    }
    
    public void addMap(Device d){
        if(!map.contains(d))
            map.add(d);
    }
    
    public void removeUser(User u){
        users.remove(u);
    }
    
    public void removeDevice(Device d){
        devices.remove(d);
    }
    
    public ArrayList<Device> getDevices() {
        return devices;
    }

    public ArrayList<User> getUsers() {
        return users;
    }

    public String initUsers() {
        String res="function init_users(){"+   
                    "var l = new List(document.getElementById('userschildren'),20,'vertical');";
        for(User u : users){
            res += u.toString();
        }
        res+= "return l;}";
        return res;
    }
    
    public String initDevices(){
        String res = "function init_devices(){"+
              "var l = new List(document.getElementById('debarraschildren'),20,'vertical');";
        for(Device d : devices){
            res += d.toString();
        }
        res += "return l;}";
        return res;
    }
    
    public String initMap(){
        String res = "";
        if(map.size() !=0){
            for(Device d : map){
                res += "var d1 = new Device('"+d.getId()+"','html/"+d.getImg()+"');"+
                       "mapContainer.add(d1);"+
                       "d1.setAttribute('transform','translate("+d.getX()+","+d.getY()+")');"+
                       "Draggable(d1.id,[d1.id], startDragElement, null,  null);";
            }
        }
        return res;
    }
    
    public String init(){
        return "function init_every() {"+
               "init_draggable();"+
               "var userContainer = new Container('users',true,window.innerWidth/2-window.innerWidth/120,window.innerHeight/2-window.innerHeight/60,'translate(0,0)');"+
               "var user_list = init_users();"+
               "debarrasContainer = new Container('debarras',true,window.innerWidth/2-window.innerWidth/120,window.innerHeight/2-window.innerHeight/60,'translate(0,'+62*window.innerHeight/120+')');"+
               "var devices_list = init_devices();"+
               "debarrasContainer.setDropZone(devices_list);"+
               "var mapContainer = new Container('plan',false,window.innerWidth/2-window.innerWidth/120,4*window.innerHeight/5-window.innerHeight/60,'translate('+122*window.innerWidth/240+','+65*window.innerHeight/300+')');"+
               "mapContainer.setDropZone();"+
               initMap()+
               "var cloudContainer = new Container('cloud',false,window.innerWidth/2-window.innerWidth/120,window.innerHeight/5-window.innerHeight/60,'translate('+122*window.innerWidth/240+',0)');"+
               "var sepNSO = new Separator('separatornordsudouest', document.getElementById('main'),  'horizontal', [document.getElementById(userContainer.id)],  [document.getElementById(debarrasContainer.id)], document.getElementById(userContainer.id));"+
               "var sepEO = new Separator('separatorestouest', document.getElementById('main'),  'vertical', [document.getElementById(userContainer.id),document.getElementById(debarrasContainer.id)],  [document.getElementById(cloudContainer.id),document.getElementById(mapContainer.id)], document.getElementById('main'));"+
               "var sepNSE = new Separator('separatornordsudest', document.getElementById('main'),  'horizontal', [document.getElementById(cloudContainer.id)],  [document.getElementById(mapContainer.id)], document.getElementById(cloudContainer.id));"+
               "}";
    }

    @Override
    public String toString() {
        return initUsers()+initDevices()+init();
    }
    
    
}
