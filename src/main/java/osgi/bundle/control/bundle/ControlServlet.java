package osgi.bundle.control.bundle;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import java.util.Dictionary;
import java.util.Hashtable;
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

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //TODO replace and put your code here
        DataTelec d = new DataTelec();
        d.addUser(new User("user1", "img/user1.png"));
        d.addUser(new User("user2", "img/user2.png"));
        d.addMap(new Device("device2", "img/device2.png", 50, 50));
        d.addDevice(new Device("device1", "img/device1.png"));
        
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
                       " <script language=\"JavaScript\" type=\"text/javascript\">"+d.toString()+"</script>"+
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
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println(req.getParameterMap().toString());
        if(!req.getParameterMap().isEmpty()){
            PrintWriter out = resp.getWriter();
            resp.setContentType("text/html");
            out.write("trololo");
        }
    }

    
    
    @Validate
    public void start() {
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
