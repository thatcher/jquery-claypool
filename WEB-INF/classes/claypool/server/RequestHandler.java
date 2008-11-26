// This file doesn't know about Jetty but does know about servlet requests and response.
// This file could be used with servers other than Jetty by changing the caller Java app to this file.
// 
// This file is the only Java file that knows about the JavaScript files of the server-side app being deployed
// 
// This file is the glue that joins the whole system together (servlet, Rhino JavaScript shell, JavaScript files).
//     This file converts Java servlet request object to a JavaScript object.
//     These JavaScript objects are processed in the JavaScript app (interact with database etc).
//     The JavaScript app populates a JavaScript object as the response
//     This file then converts this JavaScript response into the Java servlet response object.

package claypool.server;

import java.io.IOException;
import java.io.File;
import java.io.InputStream;
import java.io.FileInputStream;
import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletInputStream;
import javax.servlet.ServletOutputStream;
import javax.servlet.ServletContext;

import org.apache.log4j.Logger;
import org.mozilla.javascript.*;


public class RequestHandler
{
    static Logger logger = Logger.getLogger("claypool.server.RequestHandler");
    private Shell shell;
    private ServletContext servletContext;
    public RequestHandler( String applicationContainer, String applicationLocation, 
        String applicationBasePath, ServletContext servletContext){
        try {
            shell = new Shell(applicationBasePath, applicationLocation);
        }catch (Exception ee) {
            System.out.println(ee.toString());
            // ...
        }
        this.servletContext = servletContext;
        // load the JavaScript files for the web app framework and
        // the files for the specific web app.
        logger.debug("Loading application container: " + applicationContainer);
        shell.put("cwd", shell, applicationBasePath);
        shell.loadFile( applicationContainer );
        /*Scriptable cwd = shell.getContext().newObject(shell);
        ScriptableObject.defineProperty(cwd, "applicationBasePath", applicationBasePath, 0);*/
        Callable locationSetter = (Callable)shell.getGetterOrSetter( "location", 0, true);
        Object[] args = {applicationLocation};
        locationSetter.call(
            shell.getContext(),
            shell,
            shell,
            args
        );
        /*shell.put("location", shell, applicationContainer);*/
        logger.debug("Application ready... ");
    }

    public boolean processRequest(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
        // ---------------------------------------------------------------------
        // STEP 0: if GET request then look for a static file first.
        // In production this step would be accomplished better by a proxy server
        //      eg. nginx or Apache's httpd
        // ---------------------------------------------------------------------
        
        // ...
        
        
        
        // ---------------------------------------------------------------------
        // STEP 1: prepare JavaScript request object from the Java request object and
        // create an empty response object that the JavaScript web framework and web app
        // will populate. You could send the Java request and response objects
        // to the JavaScript since Rhino allows mixing Java objects directly in 
        // the JavaScript; however, I want to have only JavaScript in the JavaScript.
        // This way the JavaScript could be ported to run on the Spidermonkey or some
        // other JavaScript engine more easily.
        //
        // (A complication arises at this point if you want to have file uploads
        // with multipart HTML forms. See Apache Commons project for Java code
        // to attack the file upload problem.)
        // ---------------------------------------------------------------------

        logger.debug("processing request: " + request);
        // Create the JavaScript request object
        Scriptable req = shell.getContext().newObject(shell);

        ScriptableObject.defineProperty(req, "authType",            request.getAuthType(), 0);// note zero means no attributes
        
        Scriptable attributes = shell.getContext().newObject(shell);
        ScriptableObject.defineProperty(req, "attributes",          attributes, 0);
        Enumeration attrNames = request.getAttributeNames();
        while(attrNames.hasMoreElements()) {
          String attrName = (String)attrNames.nextElement();
          ScriptableObject.defineProperty(attributes, attrName,     request.getAttribute(attrName), 0);
        }
        
        ScriptableObject.defineProperty(req, "characterEncoding",   request.getCharacterEncoding(), 0);
        ScriptableObject.defineProperty(req, "contentLength",       request.getContentLength(), 0);
        ScriptableObject.defineProperty(req, "contentType",         request.getContentType(), 0);
        ScriptableObject.defineProperty(req, "contextPath",         request.getContextPath(), 0);
        ScriptableObject.defineProperty(req, "cookies",             request.getCookies(), 0);
        
        Scriptable requestHeaders = shell.getContext().newObject(shell);
        ScriptableObject.defineProperty(req, "headers", requestHeaders, 0);
        Enumeration requestHeaderNames = request.getHeaderNames();
        while(requestHeaderNames.hasMoreElements()) {
          String headerName = (String)requestHeaderNames.nextElement();
          ScriptableObject.defineProperty(requestHeaders, headerName, request.getHeader(headerName).toString(), 0);
        }
        
        ScriptableObject.defineProperty(req, "locale", request.getLocale().toString(), 0);
        Scriptable locales = shell.getContext().newObject(shell);
        ScriptableObject.defineProperty(req, "locales", locales, 0);
        Enumeration localeNames = request.getLocales();
        int preferenceLevel = 0;
        while(localeNames.hasMoreElements()) {
          String localeName = (String)localeNames.nextElement().toString();
          ScriptableObject.defineProperty(locales, localeName,      preferenceLevel++, 0);
        }
        
        ScriptableObject.defineProperty(req, "method",              request.getMethod(), 0);
        
        Scriptable parameters = shell.getContext().newObject(shell);
        ScriptableObject.defineProperty(req, "parameters", parameters, 0);
        Enumeration paramNames = request.getParameterNames();
        while(paramNames.hasMoreElements()) {
          String paramName = (String)paramNames.nextElement();
          // NOTE use getParameterValues() if could be more than one of the parameter with the same name.
          ScriptableObject.defineProperty(parameters, paramName,    request.getParameter(paramName), 0);
        }
        
        ScriptableObject.defineProperty(req, "pathInfo",            request.getPathInfo(), 0);
        ScriptableObject.defineProperty(req, "pathTranslated",      request.getPathTranslated(), 0);
        ScriptableObject.defineProperty(req, "protocol",            request.getProtocol(), 0);
        ScriptableObject.defineProperty(req, "queryString",         request.getQueryString(), 0);
        ScriptableObject.defineProperty(req, "remoteAddr",          request.getRemoteAddr(), 0);
        ScriptableObject.defineProperty(req, "remoteHost",          request.getRemoteHost(), 0);
        ScriptableObject.defineProperty(req, "remoteUser",          request.getRemoteUser(), 0);
        ScriptableObject.defineProperty(req, "requestedSessionId",  request.getRequestedSessionId(), 0);
        ScriptableObject.defineProperty(req, "requestURI",          request.getRequestURI(), 0);
        ScriptableObject.defineProperty(req, "requestURL",          request.getRequestURL().toString(), 0);
        ScriptableObject.defineProperty(req, "serverName",          request.getServerName(), 0);
        ScriptableObject.defineProperty(req, "serverPort",          request.getServerPort(), 0);
        ScriptableObject.defineProperty(req, "servletPath",         request.getServletPath(), 0);
        
        //TODO add session object and it's properties
        
        // Create the empty JavaScript response object
        Scriptable res = shell.getContext().newObject(shell);

        // ---------------------------------------------------------------------
        // STEP 2: call the web framework to use the request and generate the response
        // The framework *must* build some kind of response even if just an error message.
        // ---------------------------------------------------------------------

        // "Claypool.Server.handle" is the single global entry function of the JavaScript web app framework.
        logger.debug("Handing request/response to Claypool.");
        Object[] args = {req, res};
        shell.callGlobalFunction("ClaypoolServerHandler", args);

        // ---------------------------------------------------------------------
        // STEP 3: take properties from the JavaScript response object
        // and add them to the Java response object
        // ---------------------------------------------------------------------

        logger.debug("Reading response from Claypool.");
        Scriptable responseHeaders = null;
        try{
        	responseHeaders = Context.toObject(
            	ScriptableObject.getProperty(res, "headers"), shell);
        }catch(Exception e){
        	logger.error("Error reading response headers", e);
        }
        
        logger.debug("Headers." + responseHeaders.toString());
        
        Double status = Context.toNumber(
            ScriptableObject.getProperty(responseHeaders, "status"));
        if(status == null){ logger.warn("Status should never be null."); }
        if(status!=null && status.intValue() == 404){
            logger.debug("Redirect to static resource");
            return false;
        }
        response.setStatus(status.intValue());
        logger.debug("status: " + status);
        Object[] responseHeadersFields = ScriptableObject.getPropertyIds(responseHeaders);
        logger.debug("Raw Response fields: " +responseHeadersFields);
        logger.debug("Raw Response fields length: " +responseHeadersFields.length);
        int contentLength = -1;
        //TODO: Why the heck 1!!!
        for(int i = 1; i < responseHeadersFields.length; i++){
            String responseHeaderValue =  Context.toString(
                ScriptableObject.getProperty(
                    responseHeaders, 
                    responseHeadersFields[i].toString()
                ) 
            );
            logger.debug("Adding Header: " + responseHeadersFields[i] );
            logger.debug("Header Value: " + responseHeaderValue );
            if(!responseHeadersFields[i].toString().equalsIgnoreCase("")){
                if(responseHeadersFields[i].toString().equalsIgnoreCase("Content-Length")){
                    logger.debug("contentLength : " + responseHeaderValue);
                    contentLength = Integer.parseInt(responseHeaderValue.replace(" ",""));
                }
                response.addHeader(
                    responseHeadersFields[i].toString(),
                    Context.toString(
                        ScriptableObject.getProperty(
                            responseHeaders, 
                            responseHeadersFields[i].toString())
                    ));
            }
        }
        String body = Context.toString(
            ScriptableObject.getProperty(res, "body")
        );
        if(! (contentLength > -1) ){
            contentLength = body.length();
        }
        response.setContentLength(contentLength);
        //this is not always accurate, not what we know based on the header
        //passed back from the javascript.
        //It's not good to have a mystery like this.
        logger.debug("Actual Body Length ===> " + contentLength);
        response.getWriter().println(body);
        return true;
    }
    
}
