/*
 *  
 */
package claypool.server;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


/**
 */
public class Servlet extends HttpServlet {

    //protected ThreadLocal threadRequestHandler;
    protected RequestHandler requestHandler = null;
    protected String applicationContainer;
    protected String applicationLocation;
    protected String applicationBasePath;
    
	/* (non-Javadoc)
	 * @see javax.servlet.GenericServlet#init(javax.servlet.ServletConfig)
	 */
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		applicationContainer = config.getInitParameter("applicationContainer");
		applicationLocation  = config.getInitParameter("applicationLocation");
		applicationBasePath  = config.getInitParameter("applicationBasePath")!=null?
		    config.getInitParameter("applicationBasePath"):
		    getServletConfig().getServletContext().getRealPath("/").toString();
	}

	/* (non-Javadoc)
	 * @see javax.servlet.http.HttpServlet#doGet(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	    if(requestHandler == null){
    		getServletConfig().getServletContext().log("CONTEXT PATHNAME : " + request.getContextPath());
    		getServletConfig().getServletContext().log("SERVLET PATHNAME : " + request.getServletPath());
    		getServletConfig().getServletContext().log("APPLICATION BASE PATH : "+applicationBasePath);
    		getServletConfig().getServletContext().log("APPLICATION LOCATION : "+applicationLocation);
    		getServletConfig().getServletContext().log("APPLICATION CONTAINER : "+applicationContainer);
            requestHandler = new RequestHandler(
                applicationContainer, 
                applicationLocation, 
                applicationBasePath,
                getServletConfig().getServletContext());
	    }
	    if(!requestHandler.processRequest(request, response)){
	        String staticResource = applicationBasePath + request.getPathInfo();
	        getServletConfig().getServletContext().log("Forwarding 404 to real resource if available: " + staticResource);
	        response.reset();
	        getServletConfig()
                .getServletContext()
                .getRequestDispatcher( request.getPathInfo())
                .forward(request, response);
	    }
	}
	/* (non-Javadoc)
	 * @see javax.servlet.http.HttpServlet#doPost(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
		doGet(request, response);
	}
	/* (non-Javadoc)
	 * @see javax.servlet.http.HttpServlet#doPut(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
	 */
	protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
		doGet(request, response);
	}
	/* (non-Javadoc)
	 * @see javax.servlet.http.HttpServlet#doDelete(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
	 */
	protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
		doGet(request, response);
	}
	/* (non-Javadoc)
	 * @see javax.servlet.http.HttpServlet#doHead(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
	 */
	protected void doHead(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
		doGet(request, response);
	}
    /* (non-Javadoc)
	 * @see javax.servlet.http.HttpServlet#doOptions(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
	 */
	protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
		doGet(request, response);
	}
	
    /* (non-Javadoc)
     * @see javax.servlet.GenericServlet#destroy()
     */
    public void destroy() {
        super.destroy();
    }
    

}
