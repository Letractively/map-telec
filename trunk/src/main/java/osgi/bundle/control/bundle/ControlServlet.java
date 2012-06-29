package osgi.bundle.control.bundle;

import bundle.osgi.bridge.inter.Bridge;
import bundle.osgi.bridge.inter.DBNotifyService;
import bundle.osgi.bridge.inter.DBNotifySubscribers;
import bundle.osgi.bridge.inter.SmartObject;
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
import org.ops4j.pax.web.service.WebContainer;
import org.osgi.service.http.HttpContext;
import org.osgi.service.http.NamespaceException;
import org.eclipse.jetty.continuation.Continuation;
import org.eclipse.jetty.continuation.ContinuationSupport;

/**
 * @author Cedric Gerard
 *
 */
@Component
@Instantiate
public class ControlServlet extends HttpServlet implements DBNotifySubscribers {

    WebContainer webContainer;
    DBNotifyService dbns;
    private DataTelec data;
    private final Queue<Continuation> continuations = new ConcurrentLinkedQueue<Continuation>();
    private String update = "";
    private final Thread generator = new Thread("Event generator") {

        @Override
        public void run() {
            while (!Thread.currentThread().isInterrupted()) {
                try {
                    if (!update.equals("")) { //an event has to be send
                        while (!continuations.isEmpty()) {
                            Continuation continuation = continuations.poll();
                            //get the servlet response
                            HttpServletResponse peer = (HttpServletResponse) continuation.getServletResponse();
                            System.out.println(update);
                            peer.getWriter().write(update);
                            peer.setStatus(HttpServletResponse.SC_OK);
                            peer.setContentType("text/html");
                            //close the continuation
                            continuation.complete();
                        }
                        //the event has been sent
                        update = "";
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
                + "</body>"
                + " </html>");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if (!req.getParameterMap().isEmpty()) {
            if (req.getParameter("device") != null) {
                if (req.getParameter("user") != null) { //a device drop on a user
                    update = req.getParameter("device") + "/" + req.getParameter("user");
                    data.removeUserDevice(new Device(req.getParameter("device"), req.getParameter("img")));
                    data.add(new Device(req.getParameter("device"), req.getParameter("img")), new User(req.getParameter("user"), "img/" + req.getParameter("user") + ".png"));
                    data.removeMap(new Device(req.getParameter("device"), req.getParameter("img")));
                    data.removeDevice(new Device(req.getParameter("device"), req.getParameter("img")));
                } else { //a device drop in the list
                    update = req.getParameter("device") + "/list";
                    data.addDevice(new Device(req.getParameter("device"), req.getParameter("img")));
                    data.removeMap(new Device(req.getParameter("device"), req.getParameter("img")));
                    data.removeUserDevice(new Device(req.getParameter("device"), req.getParameter("img")));
                }
            } else { //a device drop on the map
                update = req.getParameter("map") + "/map(" + req.getParameter("x") + "," + req.getParameter("y") + ")";
                data.addMap(new Device(req.getParameter("map"), req.getParameter("img"), Float.valueOf(req.getParameter("x")), Float.valueOf(req.getParameter("y"))));
                data.removeDevice(new Device(req.getParameter("map"), req.getParameter("img")));
                data.removeUserDevice(new Device(req.getParameter("map"), req.getParameter("img")));
            }
            System.out.println(update);
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
        User u = new User("user1", "img/user1.png");
        u.addDevice(new Device("device3", "html/img/device3.png"));
        data.addUser(u);
        data.addUser(new User("user2", "img/user2.png"));
        data.addUser(new User("user3", "img/user3.png"));
        data.addUser(new User("user4", "img/user4.png"));
        data.addUser(new User("user5", "img/user5.png"));
        data.addMap(new Device("device2", "html/img/device2.png", 50, 50));
        data.addDevice(new Device("device1", "html/img/device1.png"));
        data.addDevice(new Device("device4", "html/img/device4.png"));
        data.addDevice(new Device("device5", "html/img/device5.png"));
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
        update = "adddevice/device" + so.getUID();
        data.addDevice(new Device("device"+so.getUID(), "html/img/device6.png"));
    }

    public void smartObjectRemoved(SmartObject so) {
        data.removeMap(new Device("device"+so.getUID(), "html/img/device6.png"));
        data.removeDevice(new Device("device"+so.getUID(), "html/img/device6.png"));
        data.removeUserDevice(new Device("device"+so.getUID(), "html/img/device6.png"));
        update = "removedevice/device" + so.getUID();
    }

    public void smartObjectUpdated(SmartObject so) {
        throw new UnsupportedOperationException("Not supported yet.");
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
