<block id='stylesheet'>
	<!--
	/**
	 * Print Stylesheets
	 */
	-->
    <link 	href={$.env('root')+"css/blueprint/print.css"} 
			rel="stylesheet"         
			type="text/css" 
			media="print"/>
	
	<!--
	/**
	 * Screen Stylesheets
	 */
	-->		
    <link 	href={$.env('root')+"css/blueprint/screen.css"}        
			type="text/css" 
			media="screen, projection"
			rel="stylesheet" />
	<link 	href={$.env('root')+"css/site.css"} 
			type="text/css" 
			rel="stylesheet" />
	
	<!--
	/**
	 * Quirks Mode Stylesheets
	 */
	-->				
    <!--[if IE]>
	<link 	href={$.env('root')+"css/blueprint/ie.css"} 
			type="text/css" 
			media="screen, projection"
			rel="stylesheet" />
	<![endif]-->
</block>