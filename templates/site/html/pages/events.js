<e4x>
	{extend("site/html/base.js")}
    <block id='main'>
            <div id='events' >
                <h3>events</h3>
                    <div style='width:auto;overflow-x:auto;text-align:center;'>
                    
                        {_('.*', events).map(function(index){
                            return [{
                                div:{
                                    $class:'event column span-6 colborder',
                                    $:[
                                        {span:this.date},
                                        {strong:this.title},
                                        {br:{}},
                                        {a:{
                                            $href:this.url,
                                            img:{
                                                $src:$.env('root')+this.image,
                                                $alt:this.title,
                                                $width:'60px'
                                            }
                                        }},
                                        {p:{
                                            a:{
                                                $href:this.url,
                                                $:this.location
                                            }
                                        }},
                                        _.e4x(this.description)
                                    ]
                                }
                            }, (index%6==5)?
                                {div:{
                                    $style:'margin-top:8em;clear:both;',
                                    $:[
                                        {h6:'more...'},
                                        {hr:{ }}
                                     ]
                                 }} : 
                                 { }];
                        }).e4x()}
                  </div>      
            </div>
    </block> 
</e4x> 
