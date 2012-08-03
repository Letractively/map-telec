package bundle.osgi.bridge.inter;

/**
 *
 * @author Cedric Gerard
 * @version 1.0
 * @since 06/01/12
 *
 * This interface describe an OSGI device subcriber wich provide all call back
 * needed to add and remove object from this device subscriber
 *
 * @see SmartObject
 */
public interface DeviceSubscriber {

    /**
     * This function notify the subscriber when a new smart objet is added.
     * 
     * @param smo the new smart object
     */
    public void deviceAdded(SmartObject smo);

    /**
     * This function notify the subcriber when a smart object is removed.
     * 
     * @param smo the removed smart object
     * @return the former system id
     */
    public void deviceRemoved(SmartObject smo);
}
