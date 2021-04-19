try {
var sc=0;
var sync=[];
var dly=0;
var msg=0;
 
function check_snd(src,sender){
	if ((typeof sync[0]!=='undefined')&&(typeof sync[0].request.src!=='undefined')&&(sync[0].request.src==src)){
	sync[0].sender=sender;
	}

	if ((typeof sync[1]!=='undefined')&&(typeof sync[1].request.src!=='undefined')&&(sync[1].request.src==src)){
	sync[1].sender=sender;
	}
}
 
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		console.log(request);
	switch (request.message){
	case "Flush!":
		check_snd(request.src,sender);
		sc=0;
		msg={message:"Flush!"};
		for (var i = 0, len = sync.length; i < len; i++){
		chrome.tabs.sendMessage(sync[i].sender.tab.id,msg);
		}
		sync=[];
		msg=0;
		dly=0;
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
			if(sc==2){
				dly=sync[1].request.time-sync[0].request.time;
				for (let i=0; i<sync.length; i++){	
				let other=(i==0)?1:0;
				let s_id=(sync[i].request.id!=sync[other].request.id)?sync[other].request.id:sync[i].request.id;
				let sy_msg={
					"message": "sEvt",
					"src": sync[i].request.src,
					"play": 0,
					"pause": 0,
					"seeking": 0,
					"id": sync[i].request.id,
					"self_id": s_id,
					"seeked": 0,
					"ratechange": 0,
					"durationchange": 0,
					"rate": 1,
					"time":sync[i].request.time,
					"dly": dly
				};
							chrome.tabs.sendMessage(sync[i].sender.tab.id,sy_msg);
							chrome.tabs.sendMessage(sync[other].sender.tab.id,sy_msg);
				}
			}
		
		}else{
			check_snd(request.src,sender);
			console.log("2 streams already synced!");
			console.log(sync);
		}
	break;
	case "sEvt":
		msg=request;
		check_snd(request.src,sender);
		msg.dly=dly;
		msg.self_id=(sync[0].request.id==msg.id)?sync[1].request.id:sync[0].request.id;
		for (var i = 0, len = sync.length; i < len; i++){
		chrome.tabs.sendMessage(sync[i].sender.tab.id,msg);
		}
	break;

	default:
		check_snd(request.src,sender);
	break;
	 }
	});
}
catch (e) {	
  console.error(e);
}