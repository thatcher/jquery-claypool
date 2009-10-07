<e4x>
	{extend("site/html/base.js")}
    <block id='main'>
        <div id='docs'>
            <h3>documentation</h3>
            <div class='first column span-2 '>
                <h2 style='text-align:right;'>
                    <img src={$.env('root')+'images/star_inverting.jpg'}/>
                    Guides
                </h2>
                <ul>
                    {_('.*', docs[0].guides).map(function(index, value){
                        return {li:{
                            a:{
                                $href:$.env('root')+'doc/guides/'+docs[0].version+'/'+value,
                                $:[{strong:value}]
                            }
                        }};
                    }).e4x()}
                </ul>
                
                <h2 style='text-align:center;'>
                    Examples
                </h2>
                <ul style='text-align:center;'>
                    <li><a href={$.env('root')+'examples'}>client/server </a></li>
                </ul>
            </div>
            <div class='span-4 column colborder'>
                <h4>Get Lazy!</h4>

                <p>
                 Lazy is important with limited resources. How is it possible 
                 to not create the event handler you need in your application 
                 before your application component is used?
                </p>
                <p>
                 The answer is to be lazy. jquery.claypool.js provides routers 
                 to stand in between the framework and the application, so 
                 events can be registered up front, and the actual component 
                 can be created only when it's required by the actualization 
                 of a relevant event. It's like TiVo for jquery.
                </p>
                
            </div>
            
            <div class='column  span-2'>
                <h2>
                    <img src={$.env('root')+'images/star_inverting.jpg'}/>
                    Plugins
                </h2>
                <ul style='text-align:right;'>
                    {_('.*', docs[0].apis['plugins/user']).map(function(index, value){
                        return {li:{
                            a:{
                                $href:$.env('root')+'doc/apis/'+
                                    docs[0].version+'/plugins/user/'+value,
                                $:[{strong:value}]
                            }
                        }};
                    }).e4x()}
                </ul>
                <h2 style='font-size:1.2em;'>
                    Extension Points
                </h2>
                <ul style='text-align:right;'>
                    {_('.*', docs[0].apis['plugins/developer']).map(function(index, value){
                        return {li:{
                            a:{
                                $href:$.env('root')+'doc/apis/'+
                                    docs[0].version+'/plugins/developer/'+value,
                                $:[{strong:value}]
                            }
                        }};
                    }).e4x()}
                </ul>
            </div>
            <div class='span-4 column colborder'>
                <h4>Cool X-Ray Glasses</h4>

                <p>
                 Using a couple simple conventions to create routers, tune 
                 logging levels, toggle development or production setting, 
                 scan for application components, your applications wiring 
                 becomes transparent to other developers.
                </p>
                <p>
                 jquery.claypool also provides a full featured, highly 
                 efficient category logging implementation so you can quickly 
                 debug very specific areas of your application in any browser 
                 or even running in Rhino. And when you turn it off you will 
                 see nearly zero impact on performance. Claypool itself is 
                 fully instrumented with category logging so you can always 
                 peer under the runtime hood.
                </p>
            </div>
            <div class='span-4 column'>
            
                <h4>Write Less, Do More</h4>
                <p>
                    Lazy also mean we don't want to have to configure any more 
                    than required unless our application really, really, really 
                    needs it.
                </p>
                <p>
                    jquery.claypool provides highly railable patterns to avoid 
                    configuration, while giving your application tons of space 
                    to grow. We didnt try to think of every thing, only what 
                    90% of you will need anyway.
                </p> 
            </div>
            <div class='span-5 '>
                <h2>
                    <img src={$.env('root')+'images/star_inverting.jpg'}/>
                     Project 
                </h2>
                <ul style='text-align:left;'>
                    {_('.*', docs[0].apis['project/conventions']).map(function(index, value){
                        return {li:{
                            a:{
                                $href:$.env('root')+'doc/apis/'+docs[0].version+
                                    '/project/conventions/'+value,
                                $:[{strong:value}]
                            }
                        }};
                    }).e4x()}
                </ul>
            </div>
        </div>
    </block> 
</e4x> 
