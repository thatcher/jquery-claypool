<e4x>
	{extend("site/html/base.js")}
	<block id='script_extra'>
		
        <!--
        /**
         * Plugins
         */
        -->
        <script type="text/javascript" src={$.env('root')+"plugins/jquery.jtemplates.js"}><!--    --></script>
        <script type="text/javascript" src={$.env('root')+"plugins/jquery.jspath.js"}><!--        --></script>
        <script type="text/javascript" src={$.env('root')+"plugins/jquery.json.js"}><!--          --></script>
        <script type="text/javascript" src={$.env('root')+"plugins/jquery.loremipsum.js"}><!--    --></script>
        <script type="text/javascript" src={$.env('root')+"plugins/jquery.objtree.js"}><!--       --></script>
        
        
        <!--
        /**
         * Configs
         */
        -->
        <script type="text/javascript" src={$.env('root')+"apps/quiz/configs/config.js"}><!--           --></script>
        <script type="text/javascript" src={$.env('root')+"apps/quiz/configs/environments.js"}><!--     --></script>
        <script type="text/javascript" src={$.env('root')+"apps/quiz/configs/filters.js"}><!--          --></script>
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
    <block id='main'>
        <div id='examples'>
            <h3><a href={$.env('root')+'examples'}>&lt; examples</a></h3>
            <div class='first column span-5 colborder'>
                <h4>{example.title}</h4>
                <h5>
                    <a href='#examples/quiz/'>
                        Start Example
                    </a>
                </h5>
                <em>Example</em><br/>
                <span>( {example.id} )</span> 
            </div>
             
            <div id='quiz' 
                 class='column'>
                    <!-- quiz will go here -->
            </div>
            
            <div id='description' class='column span-22'>
                <div class='column span-18 push-3'>
                    {example.description}
                    <div class='column'>
                        {example.more}
                    </div>
                    <div class='column'>
                        <ul class='clear'>
                            {_('.*', example.notes).map(function(index, note){
                                return {li:note};
                            }).e4x()}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </block>
</e4x> 
