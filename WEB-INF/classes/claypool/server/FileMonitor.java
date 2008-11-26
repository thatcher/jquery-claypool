package claypool.server;

import java.util.*;
import java.io.File;
import java.lang.ref.WeakReference;
import java.io.*;

public class FileMonitor {
    private Timer timerObj;
    private HashMap fileObjects; // File -> Long
    private Collection listeners; // of WeakReference(FileListener)
    public static String fileChanged = "Not Changed";
    public static String status = "No Change";
    
    /**
    * Create a file monitor instance with specified polling interval.
    *
    * @param pollingInterval Polling interval in milli seconds.
    */
    public FileMonitor (long pollingInterval) {
        fileObjects = new HashMap();
        listeners = new ArrayList();
        
        timerObj = new Timer (true);
        timerObj.schedule (new FileMonitorNotifier(), 0, pollingInterval);
    }


    /**
    * Stop the file monitor polling.
    */
    public void stop() {
        timerObj.cancel();
    }

    /**
    * Add file to listen for. File may be any java.io.File (including a
    * directory) and may well be a non-existing file in the case where the
    * creating of the file is to be trepped.
    * <p>
    * More than one file can be listened for. When the specified file is
    * created, modified or deleted, listeners are notified.
    *
    * @param file File to listen for.
    */
    public void addFile (File file) {
        if (!fileObjects.containsKey (file)) {
            long modifiedTime = file.exists() ? file.lastModified() : -1;
            fileObjects.put (file, new Long (modifiedTime));
        }
    }


    /**
    * Remove specified file for listening.
    *
    * @param file File to remove.
    */
    public void removeFile (File file) {
        fileObjects.remove (file);
    }


    /**
    * Add listener to this file monitor.
    *
    * @param fileListener Listener to add.
    */
    public void addListener (FileListener fileListener) {
        // Don't add if its already there
        for (Iterator i = listeners.iterator(); i.hasNext(); ) {
            WeakReference reference = (WeakReference) i.next();
            FileListener listener = (FileListener) reference.get();
            if (listener == fileListener)
                return;
        }
    
        // Use WeakReference to avoid memory leak if this becomes the
        // sole reference to the object.
        listeners.add (new WeakReference (fileListener));
    }


    /**
    * Remove listener from this file monitor.
    *
    * @param fileListener Listener to remove.
    */
    public void removeListener (FileListener fileListener) {
        for (Iterator i = listeners.iterator(); i.hasNext(); ) {
            WeakReference reference = (WeakReference) i.next();
            FileListener listener = (FileListener) reference.get();
            if (listener == fileListener) {
                i.remove();
                break;
            }
        }
    }


    /**
    * This is the timer thread which is executed every n milliseconds
    * according to the setting of the file monitor. It investigates the
    * file and notifies listeners if changed.
    */
    private class FileMonitorNotifier extends TimerTask {
        public void run() {
            // Loop over the registered files and see which have changed.
            // Use a copy of the list in case listener wants to alter the
            // list within its fileChanged method.
            Collection files = new ArrayList (fileObjects.keySet());
            
            for (Iterator i = files.iterator(); i.hasNext(); ) {
                File file = (File) i.next();
                long lastModifiedTime = ((Long) fileObjects.get (file)).longValue();
                long newModifiedTime = file.exists() ? file.lastModified() : -1;
                
                // Chek if file has changed
                if (newModifiedTime != lastModifiedTime) {
                
                    // Register new modified time
                    fileObjects.put (file, new Long (newModifiedTime));
                    
                    // Notify listeners
                    for (Iterator j = listeners.iterator(); j.hasNext(); ) {
                        WeakReference reference = (WeakReference) j.next();
                        FileListener listener = (FileListener) reference.get();
                        
                        // Remove from list if the back-end object has been GC'd
                        if (listener == null){
                            j.remove();
                        } else {
                            status = "Changed";
                            //System.out.println(status);
                            listener.fileChanged (file);
                            
                        }
                    }
                }
            }
        }
    }    
    
}
