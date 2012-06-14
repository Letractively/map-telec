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
        PrintWriter out = resp.getWriter();
        out.println("<h1>Hey Dude !!!</h1>");
     
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
                //webContainer.registerResources("/html", "/", httpContext);
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
