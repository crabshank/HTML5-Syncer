var sc=0;
var sync=[];
var dly=0;
var msg=0;
var ids=[];
 
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(request);
	switch (request.message){
		case "Flush!":
		sc=0;
			msg={message:"Flush!"};
		 for (var i = 0, len = sync.length; i < len; i++){
	chrome.tabs.sendMessage(sync[i].sender.tab.id,msg);
		 }
		sync=[];
		ids=[];

		break;
		
	case "Buttons created!":
		msg={message:"Buttons creation noted!"};
	chrome.tabs.sendMessage(sender.tab.id,msg);
	break;
	case "Sync this!":
	sc++;
	if(sc<3){
	sync.push({request,sender})
		msg={message:"Sync request received!"};
	chrome.tabs.sendMessage(sender.tab.id,msg);
	ids.push(request.id);
	if(sc==2){
		dly=sync[1].request.time-sync[0].request.time;
	}
	
	}else
	{
	
		console.log("2 already synced");
		console.log(sync);
		
	}
	break;
	case "sEvt":
		msg=request;
		msg.dly=dly;
		msg.self_id=(ids[0]==msg.id)?ids[1]:ids[0];
		 for (var i = 0, len = sync.length; i < len; i++){
	chrome.tabs.sendMessage(sync[i].sender.tab.id,msg);
		 }
	break;

	default:
	/*console.log(request)*/;
	break;
	 }
	});
