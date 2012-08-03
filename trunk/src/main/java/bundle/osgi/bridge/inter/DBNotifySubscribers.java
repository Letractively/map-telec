package bundle.osgi.bridge.inter;

/**
 *
 * @author Cedric Gerard
 * @version 1.0
 * @since 06/20/12
 *
 * This interface describe an RDF data base notification subscriber.
 * Each time the data base is update the subscribers is notify.
 *
 */
public interface DBNotifySubscribers {
    
    /**
     * Notify subscriber that a new smart object is added to the data base
     * 
     * @param so the new smart object
     */
    public void smartObjectAdded(SmartObject so);
    
    /**
     * Notify subscriber that a smart object has gone.
     * 
     * @param so the leaving smart object
     */
    public void smartObjectRemoved(SmartObject so);
    
    /**
     * Notify subscriber that a smart object have been udated from
     * the data base.
     * 
     * @param so the new value of the updated smart object
     */
    public void smartObjectUpdated (SmartObject so);
}
