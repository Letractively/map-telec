package bundle.osgi.bridge.inter;

import java.util.HashMap;

/**
 *
 * @author Cedric Gerard
 * @version 1.0
 * @since 06/12/12
 *
 * This interface describe an OSGI SPARQL request service.
 * All OSGI bundle can subscribe to this service to send SPARQL query.
 *
 */
public interface SPARQLRequestService {
    
    /**
     * This function allow OSGI bundle to send SPARQL query and get the
     * formated string response in return.
     * 
     * @param queryString the SPARQL query
     * @return the formatted string response
     */
    public String sendQuery(String queryString);
    
    /**
     * This function allow OSGI bundle to add new instanc ein the
     * data base.
     * 
     * @param id this instance identifier
     * @param parent the parent class for the new instance
     * @param properties All preperties describe by coupe <property, value>
     */
    public void addInstance(String id, String parent, HashMap<String, String> properties) throws Exception;
    
}
