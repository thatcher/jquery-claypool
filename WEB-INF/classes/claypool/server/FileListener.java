package claypool.server;

import java.io.File;

/**
 * Interface for listening to disk file changes.
 * @see FileMonitor
 */   
public interface FileListener
{
  /**
   * Called when one of the monitored files are created, deleted
   * or modified.
   * 
   * @param file  File which has been changed.
   */
  void fileChanged (File file);
}