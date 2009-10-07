<e4x>
	{extend("site/html/base.js")}
    <block id='main'>
        <div id='release'>
            <h3><a href={$.env('root')+'releases'}>&lt; releases</a></h3>
            <div class='first column span-5 colborder'>
                <h4>{release.name}</h4>
                <h5>
                    <a href={$.env('root')+'docs'}>
                        Getting Started
                    </a>
                </h5>
                <h5>
                    <a href={$.env('root')+'docs'}>
                        API
                    </a>
                </h5>
                <em>Release</em><br/>
                <span>jQuery-Claypool {release.id}</span> 
            </div>
             
            <div id='cover' 
                 class='column span-3 colborder'>
                    {(function(){
                        return _.e4x([
                            {a:{
                                $href:this.zip,
                                img:{ 
                                    $src:$.env('root')+'images/zip.jpg',
                                    $alt:'zip',
                                    $height:'70px'
                                }
                            }},
                            {a:{
                                $href:this.tar,
                                img:{ 
                                    $src:$.env('root')+'images/tar.jpg',
                                    $alt:'tar',
                                    $height:'70px'
                                }
                            }}
                        ]);
                    })()}
            </div>
            <div id='media' 
                 class='column span-12'>
                <ol class='clear'>
                    {_('.*', release.artifacts).map(function(index, note){
                        return {li:{
                            $class:'quiet small',
                            $style:'margin-bottom:0;font-size:11px;',
                            $:[
                                {a:{
                                    $href:this.url,
                                    $:this.label
                                }},
                                _.e4x(this.description)
                            ]}};
                    }).e4x()}
                    
                </ol>
            </div>
            
            <div id='description' class='column span-22'>
                <div class='column span-18 push-3'>
                    {_.e4x(release.description)}
                    <div class='column'>
                        <h5>
                            <a href='#'>
                                NOTES
                            </a>
                        </h5>
                    </div>
                    <div class='column'>
                        <ul class='clear'>
                            {_('.*', release.notes).map(function(index, note){
                                return {li:note};
                            }).e4x()}
                        </ul>
                    </div>
                    <!--div class='column'>
                        <strong>jQuery 1.3.2</strong>
                        <img src={'http://chart.apis.google.com/chart'+
                             '?chs=150x75'+
                             '&cht=gom'+
                             '&chd=t:95'+
                             '&chl=1348 of 1420'}/>
                    </div-->
                        
                </div>
            </div>
        </div>
    </block>
</e4x> 
