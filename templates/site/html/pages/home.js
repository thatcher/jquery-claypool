<e4x>
	{extend("site/html/base.js")}
    <block id='main'>
        <div class="span-11 push-7">
            <p class="large">
                Claypool is a small, fast, railable <strong>Javascript Application Framework</strong>, built on jQuery
                that provides all the usual important patterns for large, long-lived client-side apps,
                server-side apps, or something strangely, beautifully in the middle.
            </p>
        </div>
        
       <div id='recentnews' class='column span-12 colborder' >
            <h3>recent <a href={$.env('root')+'news'}>news</a></h3>
            <ul class='recent_news'>
                {_('.*', news).map(function(){
                    return {li: {
                        div: {
                            $class: 'clear',
                            $: [{strong: {
                                    $: ['- -'+this.title + '-', {
                                        em: this.date
                                    }]
                                }}, 
                                _.e4x(this.description)]
                        }
                    }};
                }).e4x()} 
            </ul>
			<br class='clear'/>
            <a href={$.env('root')+'news'}>news archives</a>
        </div>
		
        <div class="span-10 column last">
            <div id='newreleases'>
                <h3>recent <a href={$.env('root')+'releases'}>releases</a></h3>
                <ul>
                
                    {_('.*', recent).map(function(){
                        return {li:{ $:[
                            {strong:{
                                a:{
                                    $href: $.env('root')+'release/'+this.id,
                                    $:this.name
                                }
                            }},
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
                            }},
                            {p:_.e4x(this.description).text().toString().substring(0,128)+'...'}
                        ]}};
                    }).e4x()}

                 </ul>
            </div>
            <div id='upcomingevents'>
                <h3>upcoming <a href={$.env('root')+'events'}>events</a></h3>
                <ul>
                    {_('.*',events).map(function(){
                        return {li:{ $:[
                            {a:{
                                $href:this.url,
                                $target:'_new',
                                $:this.title + ' ' + this.date
                            }},
                            {a:{
                                $href:$.env('root')+'events',
                                img:{ 
                                    $src:$.env('root')+this.image,
                                    $alt:this.title + '  '+this.location,
                                    $title:this.title+'  '+this.location,
                                    $height:'60px'
                                }
                            }},
                            {strong:this.location},
                            _.e4x(this.description).text().toString().substring(0,128)+'...'
                        ]}};
                    }).e4x()}

                 </ul>
            </div> 
        </div> 
		
		
        <div class='span-24' style='margin-top:20px;'>
            <div class="column span-9 colborder">
                <h2>New to Claypool? Peruse it.</h2>
                <ul>
                    <li>
                        Download / fork / watch jquery-claypool at 
                        <a  target='_blank' 
                            href="http://github.com/thatcher/jquery-claypool/tree/master">Github</a>   
                    </li>
                    <li>
                        Join the discussion group / mailing list at 
                        <a  target='_blank' 
                            href="http://groups.google.com/group/jquery-claypool">Google Groups</a>
                    </li>
                    <li>
                        Report any bugs you find on the 
                        <a  target='_blank' 
                            href="http://claypooljs.lighthouseapp.com/">bug tracker</a>
                    </li>
                    <li>
                        Documentation is being constructed at 
                        <a  target='_blank' 
                            href="http://docs.jquery.com/Plugins/Claypool">jquery plugins</a>
                    </li>
                </ul>
            </div>
        
        
            <div class="column span-5 colborder">
                <h2>Choose it.</h2>
                <ul>
                    <li>Small, 14K gzipped.</li>
                    <li>MIT/GPL Style License.</li>
                    <li>Scales memory effeciency.</li>
                    <li>Powered by jQuery.</li>
                </ul>
            </div>
            
            <div class="column span-7">
                <h2>Use it.</h2>
                <p>
                    Claypool comes with a template project to get you rolling in minutes.
                    In fact you are currently using the <b>jquery-server-template</b> project and 
                    you can find some additional examples <a href={$.env('root')+'/docs'}>here</a>
                </p>
            </div>
        </div>
        
    </block>
</e4x>