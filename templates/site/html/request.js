<html>
		<!-- 
		/**
		 * Claypool @VERSION - 
		 *
		 * Copyright (c) 2008-2009 ClaypoolJS
		 *
		 */
		-->
	    <head>
	        <title>Claypool Server</title>
	    </head>
	    <body>
	        <div>
	            <h1>Request Details</h1>
	            <p>The current time is : {new Date()}</p>
	            <div id="requestDetails">
	                <h2>Request URL details</h2>
	                <ul>{htmlListItem(model, "Details")}</ul>
	            </div>
	            <div id="requestParams">
	                <h2>Request Parameters</h2>
	                <ul>{htmlListItem(model.parameters, "Parameters")}</ul>
	            </div>
	            <div id="requestHeaders">
	                <h2>Request Headers</h2>
	                <ul>{htmlListItem(model.headers, "Headers")}</ul>
	            </div>
	            <div id="requestLocales">
	                <h2>Prefered Locales</h2>
	                <ul>{htmlListItem(model.locales, "Locales")}</ul>
	            </div>
	            <div id="requestAttributes">
	                <h2>Request Attributes</h2>
	                <ul>{htmlListItem(model.attributes, "Attributes")}</ul>
	            </div>
	        </div>
	    </body> 
	</html>