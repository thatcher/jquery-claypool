 // This is just a JavaScript shell that has some host objects. It would be
// a good idea that host objects useful to a server-side framework be added.
// These may include File and Database objects. It is amazing how easy it is
// to create your own shell and host objects with Rhino since the entire Java
// world can be stitched into the shell.
//
// This file knows nothing about a web server, web app framework or web app.

package claypool.server;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.BufferedReader;
import java.net.URL;
import java.net.URLConnection;

import org.apache.log4j.Logger;

import org.mozilla.javascript.*;

public class Shell extends ScriptableObject implements FileListener{
    
    static Logger logger = Logger.getLogger("claypool.server.Shell");
    
    private Context cx;
    private String basePath;
    private FileMonitor monitor = new FileMonitor (1500);
    
    public Shell(String basePath, String appFile) {
        this.basePath = basePath;
        
        cx = Context.enter();
        cx.initStandardObjects(this);
        // host objects --------------

        // Give easy access to the global object by making a global property named "global".
        // This is the same as how "window" is used in browser scripting.
        defineProperty("global", this, ScriptableObject.DONTENUM);
        defineProperty("window", this, ScriptableObject.DONTENUM);
        defineProperty("cwd", basePath, ScriptableObject.DONTENUM);
        
        // global functions
        String[] names = {"load", "print", "runCommand"};
        defineFunctionProperties(names, Shell.class, ScriptableObject.PERMANENT);
        //Add the XMLHttpRequest Implementation
        //JsXMLHttpRequest.register(this);
        //JsSimpleDomNode.register(this);
        
        monitor.addListener(this);
        try{
            monitor.addFile (new File (basePath+appFile));
        }catch(Exception e){
            logger.error(e.toString());
        }
    }

    public String getClassName() {
        return "global";
    }
    
    public Context getContext() {
        return cx;
    }
    
    public static void print(String msg){
        System.out.println(msg);
    }
    public static void runCommand(String command){
        //TODO
        return;
    }
    /**
     * Load and execute a set of JavaScript source files.
     *
     * This method is defined as a JavaScript function.
     */
    public static void load(Context cx, Scriptable thisObj,
                            Object[] args, Function funObj)
    {
      Shell shell = (Shell)getTopLevelScope(thisObj);
      for (int i = 0; i < args.length; i++) {
         shell.processAbsoluteFile(Context.toString(args[i]));
      }
    }
    
    /**
     * Load a JavaScript file.
     *
     * @param filename the JavaScript file to load
     */
    public void loadFile( String filename) {
        logger.debug("Loading absolute file : " + filename + " from path : " + basePath);
        Object[] args = {filename};
        Shell.load(cx, this, args, null);
        //this.processAbsoluteFile(filename);
    }  
    
    /**
     * A convinence method to call a global JavaScript function.
     *
     * @param methodName the global JavaScript function to be called
     * @param args the arguments for the JavaScript function
     */
    public Object callGlobalFunction(String methodName, Object[] args) {
        return ScriptableObject.callMethod(this, methodName, args);
    }
    
    private void processFile(String relativeFileName){
        String absoluteFileName = this.basePath  + relativeFileName;
        this.processAbsoluteFile(absoluteFileName);
    }
    /**
     * Evaluate JavaScript source file.
     *
     * @param filename the name of the file to evaluate
     */
    private void processAbsoluteFile(String absoluteFileName) {
        logger.debug("Loading Script: " + absoluteFileName);
        BufferedReader in = null;
        try {
            //in = new FileReader(absoluteFileName);
            // reloads changed files
            
            URL url = new URL(absoluteFileName);
    		URLConnection uc = url.openConnection();
    
    		InputStreamReader input = new InputStreamReader(uc.getInputStream());
    		in = new BufferedReader(input);

            if(absoluteFileName.startsWith("file:/")){
                monitor.addFile (new File (absoluteFileName));
            }
        }
        catch (IOException ex) {
            Context.reportError("Couldn't open file \"" + absoluteFileName + "\".\n\n" + ex);
            return;
        }

        try {            
            // Here we evalute the entire contents of the file as a script.
            cx.evaluateReader(this, in, absoluteFileName, 1, null);
        } catch (WrappedException we) {
            logger.error(we.getWrappedException().toString());
            we.printStackTrace();
        } catch (EvaluatorException ee) {
            logger.error("js: " + ee.getMessage());
        } catch (JavaScriptException jse) {
            logger.error("js: " + jse.getMessage());
        } catch (IOException ioe) {
            logger.error(ioe.toString());
        } finally {
            try {
                in.close();
            } catch (IOException ioe) {
                logger.error(ioe.toString());
            }
        }
        
    }
    
    public void fileChanged (File file) {
        //Because the Context/Thread relationship the smartest thing I could
        //think to do is modify/touch WEB-INF/web.xml to force a reload.
        logger.info("Detected change to application sources.  Reloading...");
        try{
            logger.info("Trying default reload trigger (/WEB-INF/web.xml)");
            File webXml = new File(this.basePath + "/WEB-INF/web.xml");
            webXml.setLastModified(new java.util.Date().getTime());
        }catch(Exception e){
            //ignore logger.error(ioe.toString());
        }
        //Damn jetty thinks maven is the shit.  
        try{
            logger.info("Trying jetty reload trigger (/scripts/server/contexts/claypool.xml)");
            File webXml = new File(this.basePath + "/scripts/server/contexts/claypool.xml");
            webXml.setLastModified(new java.util.Date().getTime());
        }catch(Exception e){
            //ignore logger.error(ioe.toString());
        }
    }
    
}
