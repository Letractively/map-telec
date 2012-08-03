package bundle.osgi.bridge.inter;

/**
 *
 * @author Cedric Gerard
 * @version 1.0
 * @since 06/01/12
 *
 * This interface describe service subscribers for Bridge. 
 *
 */
public interface BridgeServiceSubscriber {

    /**
     * This method is a call back trigger when service notification is reach from
     * the bridge.
     * 
     * @param UDN the id for the targetted smart object
     * @param device the device network name
     * @param variable variable which changed
     * @param value variable new value
     */
    public void serviceNotify(String UDN, String device, String variable, String value);
}
