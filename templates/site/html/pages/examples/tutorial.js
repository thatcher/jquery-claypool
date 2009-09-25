<e4x>
    {extend("site/html/base.js")}
    {extend("site/html/pages/examples/base.js?tutorial")}
    <block id='script_extra'>
        <script type="text/javascript" src={$.env('root')+"scripts/tutorial.js"}><!--          --></script>
    </block>
    
    <block id='example'>
        <div id='tutorial' class='column span-16' style='height:auto;'>
             <iframe id='tutorial_src' class='span-16'>
                tutorial
             </iframe>
        </div>
    </block>
</e4x>
