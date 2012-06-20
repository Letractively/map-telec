package osgi.bundle.control.bundle;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import java.util.Dictionary;
import java.util.Hashtable;
import java.util.Map;
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

/**
 * @author Cedric Gerard
 *
 */
@Component
@Instantiate
public class ControlServlet extends HttpServlet {

    WebContainer webContainer;
    DataTelec data;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //TODO replace and put your code here
        
        PrintWriter out = resp.getWriter();
        resp.setContentType("text/html");
        out.write("<?xml version=\"1.0\" encoding=\"UTF-8\"?>"+
        "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\"  \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">"+
        "<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"fr\">"+
               " <head>"+
                       " <title>Interface_SVG</title>"+
                       " <meta http-equiv=\"Content-Type\" content=\"application/xhtml+xml\" />"+
                       " <meta name=\"viewport\" content=\"width=device-width\"/>" +
                       " <link rel=\"stylesheet\" href=\"html/style_svg.css\"></link>"+
                       " <script language=\"JavaScript\" type=\"text/javascript\" src=\"html/COMET_SVG_utilities.js\"></script>"+
                       " <script language=\"JavaScript\" type=\"text/javascript\" src=\"html/jquery-1.7.2.js\"></script>"+
                       " <script language=\"JavaScript\" type=\"text/javascript\" src=\"html/interface.js\"></script>"+
                       " <script language=\"JavaScript\" type=\"text/javascript\">"+data.toString()+"</script>"+
               " </head>"+
                "<body onload=\"init_every()\">"+
                "<svg id=\"mon_canvas\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"  version=\"1.1\">"+
                "<defs id='def'/>"+
                "<g id=\"main\">"+
                       " <g id=\"users\"/>"+
                        "<g id=\"debarras\"/>"+
                        "<g id=\"cloud\"/>"+
                       " <g id=\"plan\"/>"+
               " </g>"+
                "</svg>"+
                "</body>"+
       " </html>");
        out.close();
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if(!req.getParameterMap().isEmpty()){
            if(req.getParameter("device") != null){
                if(req.getParameter("user") != null){
                    System.out.println(req.getParameter("device")+" on "+req.getParameter("user"));
                    data.removeUserDevice(new Device(req.getParameter("device"), "img/"+req.getParameter("device")+".png"));
                    data.add(new Device(req.getParameter("device"), "img/"+req.getParameter("device")+".png"),new User(req.getParameter("user"), "ing/"+req.getParameter("user")+".png"));
                    data.removeMap(new Device(req.getParameter("device"), "img/"+req.getParameter("device")+".png"));
                    data.removeDevice(new Device(req.getParameter("device"), "img/"+req.getParameter("device")+".png"));
                }else{
                    System.out.println(req.getParameter("device")+" drop in the list");
                    data.addDevice(new Device(req.getParameter("device"), "img/"+req.getParameter("device")+".png"));
                    data.removeMap(new Device(req.getParameter("device"), "img/"+req.getParameter("device")+".png"));
                    data.removeUserDevice(new Device(req.getParameter("device"), "img/"+req.getParameter("device")+".png"));
                }
            }else{
                System.out.println(req.getParameter("map")+" on map at ("+req.getParameter("x")+","+req.getParameter("y")+")");
                data.addMap(new Device(req.getParameter("map"), "img/"+req.getParameter("map")+".png", Float.valueOf(req.getParameter("x")), Float.valueOf(req.getParameter("y"))));
                data.removeDevice(new Device(req.getParameter("map"), "img/"+req.getParameter("map")+".png"));
                data.removeUserDevice(new Device(req.getParameter("map"), "img/"+req.getParameter("map")+".png"));
            }
            PrintWriter out = resp.getWriter();
            resp.setContentType("text/html");
            out.write("trololo");
            out.close();
        }
    }

    
    
    @Validate
    public void start() {
        data = new DataTelec();
        User u = new User("user1", "img/user1.png");
        u.addDevice(new Device("device3", "img/device3.png"));
        data.addUser(u);
        data.addUser(new User("user2", "img/user2.png"));
        data.addUser(new User("user3", "img/user3.png"));
        data.addUser(new User("user4", "img/user4.png"));
        data.addUser(new User("user5", "img/user5.png"));
        data.addMap(new Device("device2", "img/device2.png", 50, 50));
        data.addDevice(new Device("device1", "img/device1.png"));
        data.addDevice(new Device("device4", "img/device4.png"));
        data.addDevice(new Device("device5", "img/device5.png"));
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
        } else {
            DEBUG("ERROR: no compatible HTTP server found");
        }
    }

    @Invalidate
    public void stop() {
        if (webContainer != null) {
            webContainer = null;
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
