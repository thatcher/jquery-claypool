<block id='main'>
    <div id='examples'>
        <h3><a href={$.env('root')+'examples'}>&lt; examples</a></h3>
        <div class='first column span-5 colborder'>
            <h4>{example.title}</h4>
            <em>Example</em><br/>
            <span>( {example.id} )</span> 
        </div>
        
        <block id='example'>
           <p> example will go here </p>
        </block>
        
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
 
