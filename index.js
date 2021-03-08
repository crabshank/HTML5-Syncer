function send(message) {

    let params = {
      active: true,
      currentWindow: true
    }
    chrome.tabs.query(params, gotTabs);

    function gotTabs(tabs) {
      console.log("got tabs");
      console.log(tabs);
      // send a message to the content script
     // let message = userinput.value();
      let msg = {
        message: message
      };
      chrome.tabs.sendMessage(tabs[0].id, msg);
    }

}

 let scn=document.querySelector('button#scan');
 let fls=document.querySelector('button#flush');
 
 
 scn.onclick=function(){
 send("Scan!");
 } 
 
 fls.onclick=function(){
 send("Flush!");
 }