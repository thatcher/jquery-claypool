<e4x>
    {extend("site/html/base.js")}
    {extend("site/html/pages/examples/base.js?quiz")}
	<block id='script_extra'>
		
        <!--
        /**
         * Plugins
         */
        -->
        <script type="text/javascript" src={$.env('root')+"plugins/jquery.jtemplates.js"}><!--    --></script>
        
        
        <!--
        /**
         * Configs
         */
        -->
        <script type="text/javascript" src={$.env('root')+"apps/quiz/configs/config.js"}><!--           --></script>
        <script type="text/javascript" src={$.env('root')+"apps/quiz/configs/environments.js"}><!--     --></script>
        <script type="text/javascript" src={$.env('root')+"apps/quiz/configs/logging.js"}><!--          --></script>
        <script type="text/javascript" src={$.env('root')+"apps/quiz/configs/routes.js"}><!--           --></script>
        
        <!--
        /**
         * Models, Views, and Controllers
         */
        -->
        <script type="text/javascript" src={$.env('root')+"apps/quiz/models/quiz.js"}><!--              --></script>
        <script type="text/javascript" src={$.env('root')+"apps/quiz/views/quiz.js"}><!--               --></script>
        <script type="text/javascript" src={$.env('root')+"apps/quiz/controllers/quiz.js"}><!--         --></script>
        
        <!--
        /**
         * Boot 
         */
        -->
        <script type="text/javascript" src={$.env('root')+"apps/quiz/boot/client.js"}><!--              --></script>
	</block>
    
    <block id='example'>
        <h5>
            <a href='#examples/quiz/'>
                Start Example
            </a><br/>
            <a id='mini-app' href='#test/miniapp/'>
                Mini-App(loading)
            </a>
        </h5>
        <div id='quiz' 
             class='column'>
                <!-- quiz will go here -->
        </div>
    </block>
</e4x>
