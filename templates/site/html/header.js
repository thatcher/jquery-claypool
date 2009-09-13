<block id='global-header'>
	
	<div class="column span-5">
	   <a href={$.env('root')}>
			<img 	src={$.env('root')+"images/trac_claypool.gif"} 
					alt="Claypool: A Javascript Web 1.6180339... Application Framework " 
					height="130px"/>
	   </a>
	</div>
	<div class="column span-10 prepend-top bottom" 
	     style='margin-top:50px;'>
		<img 	src={$.env('root')+"images/star_inverting.jpg"}  
				height="35px"
                style='margin: 0 5px 10px 0px; float: left;'/>
				
        <h2 style="color:#999; font-size: 0.9em; margin-top:10px">
            A Web 1.618033988749894... <br/>
			Javascript Application Framework
        </h2>
	</div>
    <div id='global-navigation'
	     class='column span-9 last'>
	   <ul>
	       <li><a href={$.env('root')+'home'}>home</a></li> |
           <li><a href={$.env('root')+'releases'}>releases</a></li> |
           <li><a href={$.env('root')+'docs'}>docs</a></li> |
           <li><a href={$.env('root')+'support'}>support</a></li> |
	   </ul>
	</div>
</block>