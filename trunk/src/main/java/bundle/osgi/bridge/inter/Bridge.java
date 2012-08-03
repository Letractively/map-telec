package bundle.osgi.bridge.inter;


import java.util.ArrayList;

/**
 *
 * @author Cedric Gerard
 * @version 1.0
 * @since 06/01/12
 *
 * This interface describe an OSGI bridge wich provide all services needed to
 * add and remove object from data base.
 *
 * @see DeviceSubscribers
 * @see BridgeServiceSubscriber
 * @see SmartObject
 * @see Launcher
 */
public interface Bridge {

    /**
     * This function allow DeviceSubscriber to subrscribe for bridge object
     * added event.
     *
     * @param sub the java object subscriber
     * @return true if the subscription is validate
     */
    public boolean subscribe(DeviceSubscriber sub);

    /**
     * This function allow DeviceSubscriber to unsubcribe from bridge object
     * added event.
     *
     * @param sub the java object subscriber
     * @return true if the subscription is delete
     */
    public boolean unsubscribe(DeviceSubscriber sub);
    
    /**
     * This function allow BridgeDeviceSubscribers to subscribe for service state
     * change events.
     * 
     * @param sub the service subscriber
     * @param device the targetted device
     * @param service the targetted service
     * @return 
     */
    public boolean newServiceSubscribe(BridgeServiceSubscriber sub, String device, String service);
    
    /**
     * This function allow DeviceSubscribers to unsubscribe for service state
     * change event
     * 
     * @param sub the service subscriber
     * @param device the targetted device
     * @param service the targetted service
     * @return 
     */
    public boolean delServiceSubscription(BridgeServiceSubscriber sub, String device, String service);

    /**
     * This methode allow users to map general system id with bridge local uid.
     *
     * @param univ_uid the system id
     * @param local_uid the bridge local id
     */
    public void mapUID(String univ_uid, String local_uid);

    /**
     * This method allow object to get all device already registered in the
     * bridge stack.
     *
     * @return the smart object list from bridge
     */
    public ArrayList<SmartObject> getExistingDevices();
    
    /**
     * This method allow object to trigger asynchronous actions from bridges.
     * 
     * This fucntion match only action with only one parameter.
     *
     * @param command the formated string command
     */
    public void triggerAction(String command);
    
    /**
     * This function allow java object to trigger asynchronous actions from
     * bridges.
     *
     * @param id_obj_service identify the target object/service
     * @param action the action to trigger from the remote smart object object
     * @param param parameters associated to the action
     */
    public void triggerAction(String id_obj_service, String action, String param);

    /**
     * This function allow java object to trigger synchronous actions from
     * bridges.
     *
     * @param id_obj_service identify the target object/service
     * @param action the action to trigger from the remote smart object object
     * @param param parameters associated to the action
     * @param laucnher the call back interface
     */
    public void triggerAction(String id_obj_service, String action, String param, Launcher laucnher);

    //Getter and setter
    /**
     * This function return the bridge id.
     *
     * @return the bridge id
     */
    public String getID();

    /**
     * This function return the technology map by this bridge.
     *
     * @return the brdige type
     */
    public BRIDGE_TYPE getType();
    
    //#######################################
    // static enum definition of bridge type
    //#######################################
    public static enum BRIDGE_TYPE {

        UNKNOWN,
        UPNP,
        ENOCEAN,
        KNX
    }
}
