package bundle.osgi.bridge.inter;

/**
 *
 * @author Cedric Gerard
 * @version 1.0
 * @since 06/01/12
 *
 * This interface describe a call back function wich allow java object to be
 * synchronized with the targeting object.
 *
 */
public interface Launcher {

    /**
     * The call back take string information from the syncrhonized caller.
     *
     * @param info all the mandatory informations for the launcher object
     */
    public void callBack(String info);
}
