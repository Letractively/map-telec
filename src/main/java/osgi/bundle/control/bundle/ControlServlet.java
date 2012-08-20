package osgi.bundle.control.bundle;

import bundle.osgi.bridge.inter.*;
import bundle.osgi.bridge.inter.SmartObject.SMART_TYPE;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.*;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.felix.ipojo.annotations.*;
import org.eclipse.jetty.continuation.Continuation;
import org.eclipse.jetty.continuation.ContinuationSupport;
import org.ops4j.pax.web.service.WebContainer;
import org.osgi.service.http.HttpContext;
import org.osgi.service.http.NamespaceException;

/**
 * @author Cedric Gerard
 *
 */
@Component
@Instantiate
public class ControlServlet extends HttpServlet implements DBNotifySubscribers, BridgeServiceSubscriber {

    WebContainer webContainer;
    DBNotifyService dbns;
    private DataTelec data;
    private SPARQLRequestService srs;
    private final Queue<Continuation> continuations = new ConcurrentLinkedQueue<Continuation>();
    private ConcurrentLinkedQueue<String> update = new ConcurrentLinkedQueue<String>();
    private final Thread generator = new Thread("Event generator") {

        @Override
        public void run() {
            while (!Thread.currentThread().isInterrupted()) {
                try {
                    if (!update.isEmpty()) { //an event has to be send
                        String response = update.poll();
                        System.out.println(response);
                        while (!continuations.isEmpty()) {
                            Continuation continuation = continuations.poll();
                            //get the servlet response
                            HttpServletResponse peer = (HttpServletResponse) continuation.getServletResponse();
                            peer.getWriter().write(response);
                            peer.setStatus(HttpServletResponse.SC_OK);
                            peer.setContentType("text/html");
                            //close the continuation
                            continuation.complete();
                        }
                        //the event has been sent
                    }
                } catch (IOException e) {
                    throw new RuntimeException(e.getMessage(), e);
                }
            }
        }
    };

    @Override
    public void destroy() {
        generator.interrupt();
    }

    @Override
    public void init() throws ServletException {
        generator.start();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        PrintWriter out = resp.getWriter();
        resp.setContentType("text/html");
        out.write("<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
                + "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\"  \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">"
                + "<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"fr\">"
                + " <head>"
                + " <title>Interface_SVG</title>"
                + " <meta http-equiv=\"Content-Type\" content=\"application/xhtml+xml\" />"
                + " <meta name=\"viewport\" content=\"width=device-width\"/>"
                + " <link rel=\"stylesheet\" href=\"html/style_svg.css\"></link>"
                + " <script language=\"JavaScript\" type=\"text/javascript\" src=\"html/COMET_SVG_utilities.js\"></script>"
                + " <script language=\"JavaScript\" type=\"text/javascript\" src=\"html/jquery-1.7.2.js\"></script>"
                + " <script language=\"JavaScript\" type=\"text/javascript\" src=\"html/interface.js\"></script>"
                + " <script language=\"JavaScript\" type=\"text/javascript\" src=\"html/dialog.js\"></script>"
                + " <script language=\"JavaScript\" type=\"text/javascript\" src=\"html/editeur.js\"></script>"
                + " <script language=\"JavaScript\" type=\"text/javascript\" src=\"html/screen.js\"></script>"
                + " <script language=\"JavaScript\" type=\"text/javascript\" src=\"html/group.js\"></script>"
                + " <script language=\"JavaScript\" type=\"text/javascript\">" + data.toString() + "</script>"
                + " </head>"
                + "<body onload=\"init_every()\">"
                + "<svg id=\"mon_canvas\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"  version=\"1.1\">"
                + "<defs id='def'/>"
                + "<g id=\"main\">"
                + " <g id=\"users\"/>"
                + "<g id=\"debarras\"/>"
                + "<g id=\"cloud\"/>"
                + " <g id=\"plan\"/>"
                + " </g>"
                + "</svg>"
                + "<svg id=\"editmapcanvas\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.1\">"
                + "</svg>"
                + "<img id='edit' src='html/img/edit.png' width='32' height='32' onclick=\"initMap(new Array(" + data.roomsToStringScript() + "));\"></img>"
//                + "<div id='screen'></div>"
//                + "<button id='screenbutton' style=\"position: absolute;top:100;left:100\" onclick=\"initScreen();\">Screen</button>"
                + "</body>"
                + " </html>");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if (!req.getParameterMap().isEmpty()) {
            if (req.getParameter("device") != null) {
                Device d = null;
                int index = data.getDevices().indexOf(new Device(null, null, null, SMART_TYPE.UNKNOWN, null, req.getParameter("device")));
                if (index >= 0) {
                    d = data.getDevices().get(index);
                } else {
                    index = data.getMap().indexOf(new Device(null, null, null, SMART_TYPE.UNKNOWN, null, req.getParameter("device")));
                    if (index >= 0) {
                        d = data.getMap().get(index);
                    } else {
                        for (User u : data.getUsers()) {
                            index = u.getDevices().indexOf(new Device(null, null, null, SMART_TYPE.UNKNOWN, null, req.getParameter("device")));
                            if (index >= 0) {
                                d = u.getDevices().get(index);
                            }
                        }
                        if (d == null) {
                            for (Iterator<Device> it = data.getDeviceGroups().keySet().iterator(); it.hasNext();) {
                                Device group = it.next();
                                index = data.getDeviceGroups().get(group).indexOf(new Device(null, null, null, SMART_TYPE.UNKNOWN, null, req.getParameter("device")));
                                if (index >= 0) {
                                    d = data.getDeviceGroups().get(group).get(index);
                                }
                            }
                        }
                    }
                }
                if (req.getParameter("user") != null) { //a device drop on a user
                    update.offer(req.getParameter("device") + "/u" + req.getParameter("user"));
                    data.removeUserDevice(d);
                    data.add(d, new User(req.getParameter("user"), "img/" + req.getParameter("user") + ".png"));
                    data.removeMap(d);
                    data.removeDevice(d);
                    data.removeGroupDevice(d);
                } else { //a device drop in the list
                    update.offer(req.getParameter("device") + "/list");
                    data.addDevice(d);
                    data.removeMap(d);
                    data.removeUserDevice(d);
                    data.removeGroupDevice(d);
                }
            } else if (req.getParameter("map") != null) { //a device drop on the map
                Device d = null;
                int index = data.getDevices().indexOf(new Device(null, null, null, SMART_TYPE.UNKNOWN, null, req.getParameter("map")));
                if (index >= 0) {
                    d = data.getDevices().get(index);
                } else {
                    index = data.getMap().indexOf(new Device(null, null, null, SMART_TYPE.UNKNOWN, null, req.getParameter("map")));
                    if (index >= 0) {
                        d = data.getMap().get(index);
                    } else {
                        for (User u : data.getUsers()) {
                            index = u.getDevices().indexOf(new Device(null, null, null, SMART_TYPE.UNKNOWN, null, req.getParameter("map")));
                            if (index >= 0) {
                                d = u.getDevices().get(index);
                            }
                        }
                        if (d == null) {
                            for (Iterator<Device> it = data.getDeviceGroups().keySet().iterator(); it.hasNext();) {
                                Device group = it.next();
                                index = data.getDeviceGroups().get(group).indexOf(new Device(null, null, null, SMART_TYPE.UNKNOWN, null, req.getParameter("map")));
                                if (index >= 0) {
                                    d = data.getDeviceGroups().get(group).get(index);
                                }
                            }
                        }
                    }
                }
                d.setX(Float.valueOf(req.getParameter("x")));
                d.setY(Float.valueOf(req.getParameter("y")));
                String res = data.addMap(d);
                if (res.equals("")) {
                    data.removeDevice(d);
                    data.removeUserDevice(d);
                    data.removeGroupDevice(d);
                    update.offer(req.getParameter("map") + "/map(" + req.getParameter("x") + "," + req.getParameter("y") + ")");
                    DEBUG(req.getParameter("room"));
                } else {
                    data.removeDevice(d);
                    data.removeUserDevice(d);
                    data.removeMap(d);
                    update.offer(res);
                }
            } else if (req.getParameter("data") != null) {
                update.offer("data:" + req.getParameter("data"));
            } else if (req.getParameter("fin") != null) {
                update.offer("fin");
            } else if (req.getParameter("group") != null) {
                if (req.getParameter("draw") == null) {
                    Device d = null;
                    int index = data.getDevices().indexOf(new Device(null, null, null, SMART_TYPE.UNKNOWN, null, req.getParameter("id")));
                    if (index >= 0) {
                        d = data.getDevices().get(index);
                    } else {
                        index = data.getMap().indexOf(new Device(null, null, null, SMART_TYPE.UNKNOWN, null, req.getParameter("id")));
                        if (index >= 0) {
                            d = data.getMap().get(index);
                        } else {
                            for (User u : data.getUsers()) {
                                index = u.getDevices().indexOf(new Device(null, null, null, SMART_TYPE.UNKNOWN, null, req.getParameter("id")));
                                if (index >= 0) {
                                    d = u.getDevices().get(index);
                                }
                            }
                            if (d == null) {
                                for (Iterator<Device> it = data.getDeviceGroups().keySet().iterator(); it.hasNext();) {
                                    Device group = it.next();
                                    index = data.getDeviceGroups().get(group).indexOf(new Device(null, null, null, SMART_TYPE.UNKNOWN, null, req.getParameter("id")));
                                    if (index >= 0) {
                                        d = data.getDeviceGroups().get(group).get(index);
                                    }
                                }
                            }
                        }
                    }
                    data.removeDevice(d);
                    data.removeUserDevice(d);
                    data.removeMap(d);
                    data.removeGroupDevice(d);
                    d.setX(Float.valueOf(req.getParameter("x")));
                    d.setY(Float.valueOf(req.getParameter("y")));
                    for (Iterator<Device> it = data.getDeviceGroups().keySet().iterator(); it.hasNext();) {
                        Device group = it.next();
                        if (group.getId().equals(req.getParameter("group").substring(1))) {
                            data.getDeviceGroups().get(group).add(d);
                            update.offer(req.getParameter("group").substring(1) + "/" + req.getParameter("id") + "/" + req.getParameter("x") + "/" + req.getParameter("y") + "/" + data.getDeviceGroups().get(group).size());
                        }
                    }
                } else {
                    for (Iterator<Device> it = data.getDeviceGroups().keySet().iterator(); it.hasNext();) {
                        Device group = it.next();
                        if (group.getId().equals(req.getParameter("group").substring(1))) {
                            update.offer(data.groupToString(group));
                        }
                    }
                }
            } else {
                Enumeration<String> e = req.getParameterNames();
                data.reinitRooms();
                while (e.hasMoreElements()) {
                    String s = e.nextElement();
                    String[] split = req.getParameter(s).split("/");
                    Room r = new Room(s.substring(4, s.length()), split[0], split[1], split[2], split[3], split[4]);
                    if (!data.getRooms().contains(r)) {
                        data.getRooms().add(new Room(s.substring(4, s.length()), split[0], split[1], split[2], split[3], split[4]));
                        try {
                            HashMap<String, String> hm = new HashMap<String, String>();
                            hm.put("X", split[0]);
                            hm.put("Y", split[1]);
                            hm.put("Width", split[2]);
                            hm.put("Height", split[3]);
                            hm.put("Color", split[4]);
                            srs.addInstance(s.substring(4, s.length()), "Room", hm);
                        } catch (Exception ex) {
                            Logger.getLogger(ControlServlet.class.getName()).log(Level.SEVERE, null, ex);
                        }
                    }
                }
                update.offer(data.roomsToString());
            }
        } else {
            //save the continuation to get the servlet response
            Continuation continuation = ContinuationSupport.getContinuation(req);
            // optionally set a timeout to avoid suspending requests for too long
            continuation.setTimeout(0);
            continuation.suspend();
            continuations.offer(continuation);
        }
    }

    @Validate
    public void start() {
        data = new DataTelec();
        User u = new User("Paul", "img/user1.png");
        data.addUser(u);
        data.addUser(new User("Benoit", "img/user2.png"));
        data.addUser(new User("Denise", "img/user3.png"));
        data.addUser(new User("Clemence", "img/user4.png"));
        data.addUser(new User("Nicolas", "img/user5.png"));
        DEBUG("HTTP Web controler starting");
        if (webContainer != null) {
            try {
                // create a default context to share between registrations
                final HttpContext httpContext = webContainer.createDefaultHttpContext();
                // register the hello world servlet
                final Dictionary initParams = new Hashtable();
                initParams.put("from", "HttpService");
                webContainer.registerServlet("/", this, initParams, httpContext);
                //register JSP
                //webContainer.registerJsps(new String[]{"/jsp/*"}, httpContext);
                // register html pages as resources
                webContainer.registerResources("/html", "/", httpContext);
                DEBUG("HTTP Web controler started");
            } catch (ServletException ex) {
                Logger.getLogger(ControlServlet.class.getName()).log(Level.SEVERE, null, ex);
            } catch (NamespaceException ex) {
                Logger.getLogger(ControlServlet.class.getName()).log(Level.SEVERE, null, ex);
            }
            //register the controller bundle to the data base updates
            dbns.subscribe(this);
        } else {
            DEBUG("ERROR: no compatible HTTP server found");
        }
    }

    @Invalidate
    public void stop() {
        if (webContainer != null) {
            webContainer = null;
            //register the controller bundle to the data base updates
            dbns.unsubscribe(this);
        }
        DEBUG("HTTP Server stopped");
    }

    @Bind
    public void bindDeviceNotifySubscribe(WebContainer webContainer) {
        this.webContainer = webContainer;
        DEBUG("WebContainer services subscribe");
    }

    @Unbind
    public void unbindDeviceNotifySubscribe(WebContainer webContainer) {
        this.webContainer = null;
        DEBUG("WebContainer services unsubscribe");
    }

    @Bind
    public void bindDBNotifyService(DBNotifyService dbns) {
        this.dbns = dbns;
        DEBUG("RDF data base notify services subscribe");
    }

    @Unbind
    public void unbindDBNotifyService(DBNotifyService dbns) {
        this.dbns = null;
        DEBUG("RDF data base notify services unsubscribe");
    }

    public void smartObjectAdded(SmartObject so) {
        if (so.getType().equals(SMART_TYPE.DIMMING_LIGHT)) {
            update.offer("adddevice/device" + so.getUID()+"/lightOFF.png");
            data.addDevice(new Device(so.getUID(), so.getName(), so.getBridgeID(), so.getType(), "html/img/lightOFF.png", "device" + so.getUID()));
            String bridge = "SELECT ?bridge WHERE { <http://2012/smart-home#" + so.getUID() + ">"
                    + "<http://2012/smart-home/relation#MANAGED_BY> ?bridge . }";
            String res_bridge = srs.sendQuery(bridge);
            Bridge bridgeInst = dbns.getBridge((res_bridge.split("#"))[1].substring(0, (res_bridge.split("#"))[1].length() - 1));
            String s = "SELECT ?serv WHERE { <http://2012/smart-home/prototype#UPnP_ON_OFF>"
                    + "<http://2012/smart-home/relation#SERVICE_ID> ?serv . }";
            String res_service = srs.sendQuery(s);
            String[] split = res_service.split("/");
            String service = split[2].substring(0, split[2].length() - 1);
            bridgeInst.newServiceSubscribe(this, so.getUID(), service);
        }else if(so.getType().equals(SMART_TYPE.MEDIA_RENDERER)){
            update.offer("adddevice/device" + so.getUID()+"/renderer.png");
            data.addDevice(new Device(so.getUID(), so.getName(), so.getBridgeID(), so.getType(), "html/img/renderer.png", "device" + so.getUID()));
        }else if(so.getType().equals(SMART_TYPE.MEDIA_SERVER)){
            update.offer("adddevice/device" + so.getUID()+"/media_server.png");
            data.addDevice(new Device(so.getUID(), so.getName(), so.getBridgeID(), so.getType(), "html/img/media_server.png", "device" + so.getUID()));
        }else{
            update.offer("adddevice/device" + so.getUID()+"/unknown.png");
            data.addDevice(new Device(so.getUID(), so.getName(), so.getBridgeID(), so.getType(), "html/img/unknown.png", "device" + so.getUID()));
        }
    }

    public void smartObjectRemoved(SmartObject so) {
        Device device;
        if (so.getType().equals(SMART_TYPE.DIMMING_LIGHT)) {
           device = new Device(so.getUID(), so.getName(), so.getBridgeID(), so.getType(), "html/img/lightOFF.png", "device" + so.getUID());
        } else {
           device = new Device(so.getUID(), so.getName(), so.getBridgeID(), so.getType(), "html/img/unknown.png", "device" + so.getUID());
        }
        
        data.removeMap(device);
        data.removeDevice(device);
        data.removeUserDevice(device);
        update.offer("removedevice/device" + so.getUID());
    }

    public void smartObjectUpdated(SmartObject so) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Bind
    public void bindSPARQLRequestService(SPARQLRequestService srs) {
        this.srs = srs;
        DEBUG("RDF data base request service subscribe");
    }

    @Unbind
    public void unbindSPARQLRequestService(SPARQLRequestService srs) {
        this.srs = null;
        DEBUG("RDF data base request service unsubscribe");
    }

    public void serviceNotify(String UDN, String device, String variable, String value) {
        if(value.contentEquals("0")){
            update.offer("device" + UDN + "/value/" + "lightOFF.png");
        }else{
            update.offer("device" + UDN + "/value/" + "lightON.png");
        }
    }
    private static final long serialVersionUID = -7578840142400570555L;
    //*******************************
    //Debug functions
    //Todo adding trace file with
    //2 degree of debug	
    //*******************************
    public static boolean DEBUG = true; 	    //debug status

    private static void DEBUG(String debug) {
        if (ControlServlet.DEBUG) {
            System.out.println("Web Controler:[" + new Date().getTime() + "]   " + debug);
        }
    }
}
