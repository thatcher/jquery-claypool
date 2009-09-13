<html 	xml:lang="eng" 
			dir="ltr">
	    <head 	profile="http://a9.com/-/spec/opensearch/1.1/">
			<block id='title'>
				<title>Claypool: A jQuery Web 1.6180339... Application Framework </title>
			</block>
			{extend('site/html/meta.js')}
			<block id='meta_extra'>
				<!-- /**
					standard extension point for additional metadata 
				*/ -->
			</block>
			{extend('site/html/stylesheets.js')}
			<block id='stylesheet_extra'>
				<!-- /**
					standard extension point for additional stylesheets 
				*/ -->
			</block>
			{extend('site/html/links.js')}
			<block id='link_extra'>
				<!-- /**
					standard extension point for additional links 
				*/ -->
			</block>
			{extend('site/html/scripts.js')}
			<block id='script_extra'>
				<!-- /**
					standard extension point for additional stylesheets 
				*/ -->
			</block>
	    </head>
	    <body>
			<!--
			/**
			 * Header
			 */
			-->
			<div id='header' class="container">
				{extend('site/html/header.js')}
			</div>
			
	        <div id='main' class="container">
			     
                <div  class='span-24'>
				<block id='main'>
		            <!--
		            /**
		             * Main Content
		             */
		            -->
				</block>
				</div>
			</div>
			<hr/>
				
				
			<!--
			/**
			 * Footer
			 */
			-->
			<div 	id="global-footer" 
					class="container">
				<div class="column span-24 last">
					{extend('site/html/footer.js')}
					<block id='global-footer_extra'>
						<!-- /**
							standard extension point for additional elements 
						*/ -->
					</block>
				</div>
			</div>
			
			<!--
			/**
			 * Analytics
			 */
			-->
			{extend('site/html/analytics.js')}
	    </body>
	</html>
