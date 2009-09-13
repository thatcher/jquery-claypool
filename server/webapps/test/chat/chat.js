
function $() {
  return document.getElementById(arguments[0]);
}

function $F() {
  return document.getElementById(arguments[0]).value;
}

var room = 
{
  _last: "",
  _username: null,
  
  join: function(name)
  {
    if (name == null || name.length==0 )
    {
      alert('Please enter a username!');
    }
    else
    {
       this._username=name;
       $('join').className='hidden';
       $('joined').className='';
       $('phrase').focus();
       Behaviour.apply();
       ajax.sendMessage('join', room._username);
    }
  },
  
  leave: function()
  {
       // switch the input form
       $('join').className='';
       $('joined').className='hidden';
       $('username').focus();
       Behaviour.apply();
       ajax.sendMessage('leave',room._username);
       room._username=null;
  },
  
  chat: function(text)
  {
    if (text != null && text.length>0 )
    {
        ajax.sendMessage('chat',text);
    }
  },
  
  _chat: function(message)
  {
     var divChat=document.getElementById("chat");
     var from=message.getAttribute('from');
     var special=message.getAttribute('alert');
     var text=message.childNodes[0].data;
     
     if ( special!='true' && from == room._last )
         from="...";
     else
     {
         room._last=from;
         from+=":";
     }
     
     
     
     var parentElement = divChat;
     if (special=='true')
     {
       var span = document.createElement("span");
       span.className="alert";
       divChat.appendChild(span);
       parentElement=span;
     }
     var spanFrom = document.createElement("span");
     spanFrom.className="from";
     spanFrom.innerHTML=from+"&nbsp;";
     var spanText = document.createElement("span");
     spanText.className="text";
     spanText.innerHTML=text;
     var lineBreak = document.createElement("br");
     parentElement.appendChild(spanFrom);
     parentElement.appendChild(spanText);
     divChat.appendChild(lineBreak);
     divChat.scrollTop = divChat.scrollHeight - divChat.clientHeight;     
  },
   
  _members: function(message)
  {   
    try
    {
        var divMembers = document.getElementById("members");
        divMembers.innerHTML="";
        var spanMember = document.createElement("span");
        var ul = document.createElement("ul");
        spanMember.appendChild(ul);
        var x = message.getElementsByTagName("li");
        for (var i=0;i<x.length;i++)
        {
          var li = document.createElement("li");
          li.innerHTML = x[i].firstChild.nodeValue;
          ul.appendChild(li);
        } 
        divMembers.appendChild(spanMember);
    }
    catch(e)
    {
    	window.status="ERROR: members "+e.name + ": " + e.message;
        // alert("_members " + e);
    }
  }
};

ajax.addListener('chat',room._chat);
ajax.addListener('members',room._members);
ajax.addPollHandler(room._poll);

var chatBehaviours = 
{ 
  '#username' : function(element)
  {
    element.setAttribute("autocomplete","OFF"); 
    element.onkeyup = function(ev)
    {          
        var keyc=EvUtil.getKeyCode(ev);
        if (keyc==13 || keyc==10)
        {
          room.join($F('username'));
	  return false;
	}
	return true;
    } 
  },
  
  '#joinB' : function(element)
  {
    element.onclick = function(event)
    {
      room.join($F('username'));
      return false;
    }
  },
  
  '#phrase' : function(element)
  {
    element.setAttribute("autocomplete","OFF");
    element.onkeyup = function(ev)
    {   
        var keyc=EvUtil.getKeyCode(ev);
        if (keyc==13 || keyc==10)
        {
          room.chat($F('phrase'));
          $('phrase').value='';
	  return false;
	}
	return true;
    }
  },
  
  '#sendB' : function(element)
  {
    element.onclick = function(event)
    {
      room.chat($F('phrase'));
      $('phrase').value='';
      return false;
    }
  },
  
  
  '#leaveB' : function(element)
  {
    element.onclick = function()
    {
      room.leave();
      return false;
    }
  }
};

Behaviour.register(chatBehaviours); 


