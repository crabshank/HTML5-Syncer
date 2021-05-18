try {

function messageSyncTabs(msg){
	chrome.tabs.query({}, function(tabs) {
		
		if(typeof msg.syncTabs !== 'undefined'){
			for (let i=0; i<msg.syncTabs.length; i++) {
			chrome.tabs.sendMessage(msg.syncTabs[i], msg);
			}
		}else{
			for (let i=0; i<tabs.length; i++) {
			chrome.tabs.sendMessage(tabs[i].id, msg);
			}
		}

	});
}


chrome.tabs.onReplaced.addListener(function(addedTabId, removedTabId) {
	messageSyncTabs({message:"repl",og: removedTabId, nw:addedTabId});
});

 
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		console.log(request);
	switch (request.message){
	case "Flush!":
		messageSyncTabs({message:"Flush!"});
	break;
		
	case "Buttons created!":
		messageSyncTabs({message:"Buttons creation noted!"});
	break;
	case "Sync this!":
		messageSyncTabs({message:"scIncr",request,sender});
	break;
	case "sEvt":
		messageSyncTabs(request);	
	break;

	default:
		;
	break;
	 }
	 return true;
	});
}catch (e) {	
  console.error(e);
}