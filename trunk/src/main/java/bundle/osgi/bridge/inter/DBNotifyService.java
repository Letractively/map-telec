package bundle.osgi.bridge.inter;

/**
 *
 * @author Cedric Gerard
 * @version 1.0
 * @since 06/20/12
 *
 * This interface describe an OSGI service for notify subscribers when the RDF
 * data base is updated.
 *
 */
public interface DBNotifyService {

    /**
     * This function allow bundl to subscribe for data base update notification.
     *
     * @param dbns the data base subscriber
     * @return true if the subscription is registered
     */
    public boolean subscribe(DBNotifySubscribers dbns);

    /**
     * This functiona llow subscriber to unsubscribe from data base
     * notification.
     *
     * @param dbns the data base subscriber
     * @return true if the subscription is unregistered
     */
    public boolean unsubscribe(DBNotifySubscribers dbns);

    /**
     * Return the brdige instance corresponding to the bridge ID give in
     * parameters.
     *
     * This function return null if no instance corresponding to the bridge ID.
     *
     * @param bridgeID
     * @return the correspondig instance.
     */
    public Bridge getBridge(String bridgeID);
}
