package bundle.osgi.bridge.inter;

/**
 *
 * @author Cedric Gerard
 * @version 1.0
 * @since 06/12/12
 *
 * This interface describe an generic Smart object. A Smart objet is describe by
 * its system UID a non formal name and its bridge.
 *
 */
public class SmartObject {

    /**
     * unique systeme identifier
     */
    private String UID;
    /**
     * non formal name for this smart object
     */
    private String name;
    /**
     * The bridge id where this smart object came from
     */
    private String bridgeID;
    /**
     * The smart objet system type
     */
    private SMART_TYPE type;

    /**
     * Smaller smart object constructor.
     *
     * When this object is created to be added in subscribers, the uid is the
     * local uid. When an instanc eof this object is created for remove smart
     * object, the uid is the system uid.
     *
     * @param uid the object id
     */
    public SmartObject(String uid, String bridgeID) {
        this.UID = uid;
        name = "";
        bridgeID = "";
        type = SMART_TYPE.UNKNOWN;
    }

    /**
     * Standard smart object constructor.
     *
     * When this object is created to be added in subscribers, the uid is the
     * local uid. When an instance of this object is created for remove smart
     * object, the uid is the system uid.
     *
     * @param uid the object id
     * @param name the object non formal name
     * @param bridgeID the bridge id associted with
     */
    public SmartObject(String uid, String name, String bridgeID) {
        this.UID = uid;
        this.name = name;
        this.bridgeID = bridgeID;
        type = SMART_TYPE.UNKNOWN;
    }

    /**
     * When this object is created to be added in subscribers, the uid is the
     * local uid. When an instance of this object is created for remove smart
     * object, the uid is the system uid. The type parameter is the type object
     * choose from static smart object descritpion in this class.
     *
     * @param uid
     * @param name
     * @param bridgeID
     * @param type
     */
    public SmartObject(String uid, String name, String bridgeID, SMART_TYPE type) {
        this.UID = uid;
        this.name = name;
        this.bridgeID = bridgeID;
        this.type = type;
    }

    //
    //Getters and setters
    //
    /**
     * Get the smart object name
     *
     * @return non formal name
     */
    public String getName() {
        return name;
    }

    /**
     * Srt the smart object name
     *
     * @param name the non formal name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Get the unique smart objet id
     *
     * @return the UID
     */
    public String getUID() {
        return UID;
    }

    /**
     * Set the unique smart object id
     *
     * @param uid the UID
     */
    public void setUID(String uid) {
        this.UID = uid;
    }

    /**
     * Get the Bridge id associted with this smart object
     *
     * @return bridge UID
     */
    public String getBridgeID() {
        return bridgeID;
    }

    /**
     * Set the bridge id associted with this smart object
     *
     * @param bridgeID the bridge UID
     */
    public void setBridgeID(String bridgeID) {
        this.bridgeID = bridgeID;
    }

    /**
     * Get the smart object type
     *
     * @return the type of this smart object
     */
    public SMART_TYPE getType() {
        return type;
    }

    /**
     * Set the smart object type
     *
     * @param type the new type of this smart object
     */
    public void setType(SMART_TYPE type) {
        this.type = type;
    }
    //#######################################
    // Enum definition of smart objet type
    //#######################################
    public static enum SMART_TYPE{
        //default type
        UNKNOWN,
        //light type
        BINARY_LIGHT,
        DIMMING_LIGHT,
        COLORED_LIGHT
    }
}
