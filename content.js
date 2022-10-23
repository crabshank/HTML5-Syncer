var vdad1 = 0;
var vdad2 = 0;
var sk = 1;
var butn = [];
var clse = [];
var sdivs = [];
var bdkCol = "buttonface";
var bdkCol2 = "black";
var videoTags = [];
var attached_vids = [];
var trk = 0;
var trk2 = 0;
var sync = [];
var dly = 0;
var msg = 0;
var last_msg;
var btnClass='sync_butn';

function keepMatchesShadow(els,slc,isNodeName){
   if(slc===false){
      return els;
   }else{
      let out=[];
   for(let i=0, len=els.length; i<len; i++){
      let n=els[i];
           if(isNodeName){
	            if((n.nodeName.toLocaleLowerCase())===slc){
	                out.push(n);
	            }
           }else{ //selector
	               if(!!n.matches && typeof n.matches!=='undefined' && n.matches(slc)){
	                  out.push(n);
	               }
           }
   	}
   	return out;
   	}
}

function getMatchingNodesShadow(docm, slc, isNodeName, onlyShadowRoots){
slc=(isNodeName && slc!==false)?(slc.toLocaleLowerCase()):slc;
var shrc=[docm];
var shrc_l=1;
var out=[];
let srCnt=0;

while(srCnt<shrc_l){
	let curr=shrc[srCnt];
	let sh=(!!curr.shadowRoot && typeof curr.shadowRoot !=='undefined')?true:false;
	let nk=keepMatchesShadow([curr],slc,isNodeName);
	let nk_l=nk.length;
	
	if( !onlyShadowRoots && nk_l>0){  
		out.push(...nk);
	}
	
	shrc.push(...curr.childNodes);
	
	if(sh){
		   let cs=curr.shadowRoot;
		   let csc=[...cs.childNodes];
			   if(onlyShadowRoots){
			      if(nk_l>0){
			       out.push({root:nk[0], childNodes:csc});
			      }
			   }
			   shrc.push(...csc);
	}

	srCnt++;
	shrc_l=shrc.length;
}

return out;
}

function absBoundingClientRect(el){
	let st = [window?.scrollY,
					window?.pageYOffset,
					el?.ownerDocument?.documentElement?.scrollTop,
					document?.documentElement?.scrollTop,
					document?.body?.parentNode?.scrollTop,
					document?.body?.scrollTop,
					document?.head?.scrollTop];
					
		let sl = [window?.scrollX,
						window?.pageXOffset,
						el?.ownerDocument?.documentElement?.scrollLeft,
						document?.documentElement?.scrollLeft,
						document?.body?.parentNode?.scrollLeft,
						document?.body?.scrollLeft,
						document?.head?.scrollLeft];
						
				let scrollTop=0;
				for(let k=0; k<st.length; k++){
					if(!!st[k] && typeof  st[k] !=='undefined' && st[k]>0){
						scrollTop=(st[k]>scrollTop)?st[k]:scrollTop;
					}
				}			

				let scrollLeft=0;
				for(let k=0; k<sl.length; k++){
					if(!!sl[k] && typeof  sl[k] !=='undefined' && sl[k]>0){
						scrollLeft=(sl[k]>scrollLeft)?sl[k]:scrollLeft;
					}
				}
	
	const rct=el.getBoundingClientRect();
	let r={};

	r.left=rct.left+scrollLeft;
	r.right=rct.right+scrollLeft;
	r.top=rct.top+scrollTop;
	r.bottom=rct.bottom+scrollTop;
	r.height=rct.height;
	r.width=rct.width;
	
	return r;
}
function elRemover(el) {
    if (typeof el !== 'undefined' && !!el) {
        if (typeof el.parentNode !== 'undefined' && !!el.parentNode) {
            el.parentNode.removeChild(el);
        }
    }
}
function get_src(vid) {
    if (vid.src != "") {
        return vid.src;
    } else if (vid.currentSrc != "") {
        return vid.currentSrc;
    } else {
        return '';
    }
}
function eligVid(vid) {
    if ((get_src(vid) != '') && (vid.readyState != 0)) {
        return true;
    } else {
        return false;
    }
}
function checkInclude(arr, el) {
    let inside = false;
    for (let i = arr.length - 1; i >= 0; i--) {
        if ( arr[i].isSameNode(el) ) {
            inside = true;
            break;
        }
    }
    return inside;
}
function simpleCopyArray(array) {
    var newArray = [];
    for (let i = 0; i < array.length; i++) {
        newArray.push(array[i]);
    }
    return newArray;
}
function removeEls(d, array) {
    var newArray = [];
    for (let i = 0; i < array.length; i++) {
        if (array[i] !== d) {
            newArray.push(array[i]);
        }
    }
    return newArray;
}
function find_attached_info(vid) {
    for (let i = 0; i < attached_vids.length; i++) {
        if (vid == attached_vids[i][0]) {
            return [attached_vids[i][1], attached_vids[i][2],attached_vids[i][0],i];
        }
    }
}
var seeking_hdl = function(e) {
    let i = find_attached_info(this);
    if (sk == 1) {
        chrome.runtime.sendMessage({
            message: "sEvt",
            src: i[1],
            play: 0,
            pause: 0,
            seeking: 1,
            id: i[0],
            self_id: i[0],
            seeked: 0,
            ratechange: 0,
            durationchange: 0,
            rate: this.playbackRate,
            time: this.currentTime,
            syncTabs: [sync[0].sender.tab.id, sync[1].sender.tab.id]
        }, function(response) {});
    }
}
var seeked_hdl = function(e) {
    let i = find_attached_info(this);
    if (sk == 1) {
        chrome.runtime.sendMessage({
            message: "sEvt",
            src: i[1],
            play: 0,
            pause: 0,
            seeking: 0,
            id: i[0],
            self_id: i[0],
            seeked: 1,
            ratechange: 0,
            durationchange: 0,
            rate: this.playbackRate,
            time: this.currentTime,
            syncTabs: [sync[0].sender.tab.id, sync[1].sender.tab.id]
        }, function(response) {});
    } else {
        sk = 1;
    }
}
var play_hdl = function(e) {
    let i = find_attached_info(this);
	if (attached_vids[i[3]][3].waiting){
		attached_vids[i[3]][3].waiting=false;
		}
    chrome.runtime.sendMessage({
        message: "sEvt",
        src: i[1],
        play: 1,
        pause: 0,
        seeking: 0,
        id: i[0],
        self_id: i[0],
        seeked: 0,
        ratechange: 0,
        durationchange: 0,
        rate: this.playbackRate,
        time: this.currentTime,
        syncTabs: [sync[0].sender.tab.id, sync[1].sender.tab.id]
    }, function(response) {});
}
var play_it = function(e) {
    let i = find_attached_info(this);
	if(attached_vids[i[3]][3].waiting){
	i[2].play();
	}
}
var pause_hdl = function(e) {
    let i = find_attached_info(this);
		if (!attached_vids[i[3]][3].waiting){
    chrome.runtime.sendMessage({
        message: "sEvt",
        src: i[1],
        play: 0,
        pause: 1,
        seeking: 0,
        id: i[0],
        self_id: i[0],
        seeked: 1,
        ratechange: 0,
        durationchange: 0,
        rate: this.playbackRate,
        time: this.currentTime,
        syncTabs: [sync[0].sender.tab.id, sync[1].sender.tab.id]
    }, function(response) {});
}
}
var waiting_hdl = function(e) {
    let i = find_attached_info(this);
	attached_vids[i[3]][3].waiting=true;
	i[2].pause();
    chrome.runtime.sendMessage({
        message: "sEvt",
        src: i[1],
        play: 0,
        pause: 1,
        seeking: 0,
        id: i[0],
        self_id: i[0],
        seeked: 1,
        ratechange: 0,
        durationchange: 0,
        rate: this.playbackRate,
        time: this.currentTime,
        syncTabs: [sync[0].sender.tab.id, sync[1].sender.tab.id]
    }, function(response) {});

}
var ratechange_hdl = function(e) {
    let i = find_attached_info(this);
    chrome.runtime.sendMessage({
        message: "sEvt",
        src: i[1],
        play: 0,
        pause: 0,
        seeking: 0,
        id: i[0],
        self_id: i[0],
        seeked: 0,
        ratechange: 1,
        durationchange: 0,
        rate: this.playbackRate,
        time: this.currentTime,
        syncTabs: [sync[0].sender.tab.id, sync[1].sender.tab.id]
    }, function(response) {});
}
var durchange_hdl = function(e) {
    /*let i=find_attached_info(this);
    		chrome.runtime.sendMessage({
    				message: "sEvt",
    				src: i[1],
    				play: 0,
    				pause: 0,
    				seeking: 0,
    				id: i[0],
    				self_id: i[0],
    				seeked: 0,
    				ratechange: 0,
    				durationchange: 1,
    				rate: this.playbackRate,
    				time: this.currentTime,
    				syncTabs:[sync[0].sender.tab.id,sync[1].sender.tab.id]
    		}, function(response) {});*/
    //alert('Syncer: Duration changed!');
    console.log('Syncer: Duration changed!');
}

chrome.runtime.onMessage.addListener(gotMessage);
function gotMessage(message, sender, sendResponse) {
    //console.log(message);
    switch (message.message) {
        case "repl":
            for (let i = 0; i < sync.length; i++) {
                if (sync[i].sender.tab.id == message.og) {
                    sync[i].sender.tab.id = nw;
                }
            }
            break;
        case "Flush!":
            try {
                chrome.runtime.sendMessage({
                    message: "Flush!",
                    syncTabs: [sync[0].sender.tab.id, sync[1].sender.tab.id]
			}, function(response) {});}catch(e){;}
			
			try{
                var sync_butns = getMatchingNodesShadow(document,('button.'+btnClass),false,false);
                
                for (let i = sync_butns.length - 1; i>=0; i--) {
					elRemover(sync_butns[i]);
                }
                for (let k = attached_vids.length - 1; 0 <= k; k--) {
                    attached_vids[k][0].removeEventListener("seeking", seeking_hdl);
                    attached_vids[k][0].removeEventListener("seeked", seeked_hdl);
                    attached_vids[k][0].removeEventListener("play", play_hdl);
                    attached_vids[k][0].removeEventListener("playing", play_it);
                    attached_vids[k][0].removeEventListener("canplay", play_it);
                    attached_vids[k][0].removeEventListener("canplaythrough", play_it);
                    attached_vids[k][0].removeEventListener("pause", pause_hdl);
                    attached_vids[k][0].removeEventListener("waiting", waiting_hdl);
                    attached_vids[k][0].removeEventListener("ratechange", ratechange_hdl);
                    attached_vids[k][0].removeEventListener("durationchange", durchange_hdl);
                }
                attached_vids = [];
                vdad1 = 0;
                vdad2 = 0;
                sk = 1;
                butn = [];
                clse = [];
                sdivs = [];
                sync = [];
                msg = 0;
                dly = 0;
            } catch (e) {;
            }
            break;
        case "Scan!":
            getStrms();
            function getStrms() {
                var tmpVidTags = [
                    ...getMatchingNodesShadow(document,'VIDEO',true,false),
                    ...getMatchingNodesShadow(document,'AUDIO',true,false)
                ];
                if (videoTags.length == 0) {
                    videoTags = simpleCopyArray(tmpVidTags);
                    trk = 0;
                    for (let k = 0; k < videoTags.length; k++) {
                        if (!eligVid(videoTags[k])) {
                            videoTags = removeEls(videoTags[k], videoTags);
                        }
                    }
                } else {
                    trk2 = videoTags.length;
                    for (let k = 0; k < tmpVidTags.length; k++) {
                        if (!checkInclude(videoTags, tmpVidTags[k])) {
                            videoTags.push(tmpVidTags[k]);
                            trk = trk2;
                        }
                    }
                    for (let k = trk; k < videoTags.length; k++) {
                        if (!eligVid(videoTags[k])) {
                            videoTags = removeEls(videoTags[k], videoTags);
                            trk--;
                        }
                    }
                }
                for (let i = trk; i < videoTags.length; i++) {
                    createbutn(i, videoTags[i], get_src(videoTags[i]));
                }
                if (videoTags.length > 1) {
                    console.log(videoTags);
                } else if (videoTags.length == 1) {
                    console.log(videoTags[0]);
                }
            }
            function b_hide(b, v) {
                function cursorhide() {
                    if ((typeof b.childNodes[0] !== "undefined") && (typeof b.childNodes[1] !== "undefined")) {
                        bdkCol = (b.childNodes[0].getAttribute("grn_synced") == "true") ? "#004200" : "buttonface";
                        bdkCol2 = (b.childNodes[0].getAttribute("grn_synced") == "true") ? "white" : "black";
                        if (!hide) {
                            b.style.cssText = "left: inherit !important; display: initial !important; visibility: initial !important; z-index: " + Number.MAX_SAFE_INTEGER + " !important; position: absolute !important; background-color: transparent !important; "+b.getAttribute("top_pos")+" !important;";
                            if (b.childNodes.length == 2) {
                                b.childNodes[0].style.cssText = "display: initial !important; visibility:initial !important;  color: " + bdkCol2 + " !important; border-width: 2px !important; border-style: outset !important; background-color: " + bdkCol + " !important; border-color: " + bdkCol + " !important";
                                b.childNodes[1].style.cssText = "display: initial !important; visibility:initial !important; background-color: #de0000 !important; color: white !important; border-width: 2px !important; border-style: outset !important; border-color: #de0000 !important";
                            }
                            clearTimeout(timer);
                            timer = setTimeout(function() {
								if ((typeof b.childNodes[0] !== "undefined") && (typeof b.childNodes[1] !== "undefined")) {
                                if ((!(b.childNodes[0].matches(':hover'))) && (!(b.childNodes[1].matches(':hover')))) {
                                    b.style.opacity = '0';
                                    if (b.childNodes.length == 2) {
                                        b.childNodes[0].style.opacity = '0';
                                        b.childNodes[1].style.opacity = '0';
                                    }
                                    hide = true;
                                    setTimeout(function() {
                                        hide = false;
                                    }, 1);
                                }
								}
                            }, 3000);
                        }
                    }
                }
                v.removeEventListener('mousemove', cursorhide, true);
                b.removeEventListener('mouseover', cursorhide, true);
                b.removeEventListener('mouseout', cursorhide, true);
                var timer;
                var hide = false;
                b.style.cssText = "left: inherit !important; display: initial !important; visibility: initial !important; z-index: " + Number.MAX_SAFE_INTEGER + " !important; position: absolute !important; background-color: transparent !important; "+b.getAttribute("top_pos")+" !important;";
                if (b.childNodes.length == 2) {
                    bdkCol = (b.childNodes[0].getAttribute("grn_synced") == "true") ? "#004200" : "buttonface";
                    bdkCol2 = (b.childNodes[0].getAttribute("grn_synced") == "true") ? "white" : "black";
                    b.childNodes[0].style.cssText = "display: initial !important; visibility:initial !important;  color: " + bdkCol2 + " !important; border-width: 2px !important; border-style: outset !important; background-color: " + bdkCol + " !important; border-color: " + bdkCol + " !important";
                    b.childNodes[1].style.cssText = "display: initial !important; visibility:initial !important; background-color: #de0000 !important; color: white !important; border-width: 2px !important; border-style: outset !important; border-color: #de0000 !important";
                }
                v.addEventListener('mousemove', cursorhide, true);
                b.addEventListener('mouseover', cursorhide, true);
                b.addEventListener('mouseout', cursorhide, true);
            }
            function createbutn(i, video, src) {
                for (let j = 0; j < i; j++) {
                    if (typeof butn[j] === "undefined") {
                        butn[j] = "";
                    }
                    if (typeof sdivs[j] === "undefined") {
                        sdivs[j] = "";
                    }
                    if (typeof clse[j] === "undefined") {
                        clse[j] = "";
                    }
                }
                sdivs[i] = document.createElement("div");
                sdivs[i].style.cssText = "left: inherit !important; display: initial !important; visibility: initial !important; z-index: " + Number.MAX_SAFE_INTEGER + " !important; position: absolute !important; background-color: transparent !important;";
                butn[i] = document.createElement("button");
                butn[i].setAttribute("grn_synced", false);
                butn[i].style.cssText = "display: initial !important; visibility: initial !important;  color: " + bdkCol2 + " !important; border-width: 2px !important; border-style: outset !important; background-color: buttonface !important; border-color: buttonface !important";
                let btxt= "Sync: " + video.nodeName + ", " + src;
				butn[i].setAttribute('info', btxt);
                butn[i].innerHTML = btxt;
				butn[i].setAttribute('src', src);
                butn[i].className = btnClass;
                video.insertAdjacentElement('beforebegin', sdivs[i]);
                butn[i].addEventListener("click", btclk(i, src));
                clse[i] = document.createElement("button");
                clse[i].style.cssText = "display: initial !important; visibility: initial !important; background-color: #de0000 !important; color: white !important; border-width: 2px !important; border-style: outset !important; border-color: #de0000 !important";
                clse[i].innerHTML = "×";
                clse[i].className = btnClass;
                sdivs[i].appendChild(butn[i]);
                sdivs[i].appendChild(clse[i]);
                clse[i].onclick = function btclse() {
                    elRemover(clse[i]);
                    elRemover(butn[i]);
                    elRemover(sdivs[i]);
                }
				
				let vrct=absBoundingClientRect(video);
				let sdrct=absBoundingClientRect(sdivs[i]);
				let wdrct=absBoundingClientRect(window.document.documentElement);
				if(video.nodeName==='AUDIO'){
					if(vrct.bottom+sdrct.height<=wdrct.bottom){		
					sdivs[i].setAttribute('top_pos','top: '+vrct.bottom+'px');
					}else{
					sdivs[i].setAttribute('top_pos','top: '+(vrct.top-sdrct.height)+'px');
					}
				}else{
					sdivs[i].setAttribute('top_pos','');
				}
				sdivs[i].style.cssText+=" "+sdivs[i].getAttribute('top_pos')+" !important;";
				
                video.addEventListener('mouseenter', b_hide(sdivs[i], video), true);
            }
            function btclk(i, src) {
                return function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    if (butn[i].getAttribute("grn_synced") != "true") {
                        videoTags[i].playbackRate = 1;
                        chrome.runtime.sendMessage({
                            message: "Sync this!",
                            id: i,
                            self_id: i,
                            time: videoTags[i].currentTime,
                            src: src
                        }, function(response) {});
						let btxt= "SYNCED!: " + videoTags[i].nodeName + ", " + src;
						butn[i].setAttribute('info', btxt);
                        butn[i].innerHTML = btxt + ' (Delay:';
                        butn[i].style.cssText = "display: initial !important; visibility: initial !important; color: white !important; border-width: 2px !important; border-style: outset !important; background-color: #004200 !important; border-color: #004200 !important;";
                        butn[i].setAttribute("grn_synced", true);
                        if (vdad1 == 0) {
                            vdad1 = videoTags[i];
                        } else {
                            vdad2 = videoTags[i];
                        }
                        attached_vids.push([videoTags[i], i, src,{waiting: false}]);
                        videoTags[i].addEventListener("seeking", seeking_hdl);
                        videoTags[i].addEventListener("seeked", seeked_hdl);
                        videoTags[i].addEventListener("play", play_hdl);
                        videoTags[i].addEventListener("playing", play_it);
                        videoTags[i].addEventListener("canplay", play_it);
                        videoTags[i].addEventListener("canplaythrough", play_it);
                        videoTags[i].addEventListener("pause", pause_hdl);
                        videoTags[i].addEventListener("waiting", waiting_hdl);
                        videoTags[i].addEventListener("ratechange", ratechange_hdl);
                        videoTags[i].addEventListener("durationchange", durchange_hdl);
                    }
                };
            }
            if (butn.length > 1) {
                console.log(butn);
            } else if (butn.length == 1) {
                console.log(butn[0]);
            }
            chrome.runtime.sendMessage({
                message: "Buttons created!"
            }, function(response) {});
            break;
        case "scIncr":
				if(sync.length<2){
				sync.push({request:message.request,sender:message.sender});
				
				if(sync.length==2){
				dly=sync[1].request.time-sync[0].request.time;
													
				for(let k=0; k<butn.length; k++){
				for (let i=0; i<sync.length; i++){
					if(butn[k]!=='' && sync[i].request.src===butn[k].getAttribute('src')){
						let other=(i==0)?1:0;
						if(sync[i].request.time<=sync[other].request.time){
							butn[k].setAttribute('dly_dir',1);
							butn[k].innerHTML=butn[k].getAttribute('info')+(' (Delay: ')+(Math.abs(dly)).toLocaleString('en-GB',{useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 7})+'s)';
						}else{
							butn[k].setAttribute('dly_dir',-1);
							butn[k].innerHTML=butn[k].getAttribute('info')+(' (Delay: ')+(-1*Math.abs(dly)).toLocaleString('en-GB',{useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 7})+'s)';
						}
						
					i=sync.length-1;
					}
				}

				}
				}
				
				}else{
			console.log("2 streams already synced!");
			console.log(sync);
				}
            break;
        case "sEvt":
            function sEvts(vdad) {
                	if ((vdad!=0) && (JSON.stringify(last_msg) !== JSON.stringify(message))){
                    console.log(message);
                    if (message.play == 1 && vdad.readyState>=3) {
                        vdad.play();
                    }else if (message.play == 1 && vdad.readyState<3) {
                        vdad.pause();
                    } else if (message.pause == 1) {
                        vdad.pause();
                    } else if (message.seeking == 1) {
                        sk = 0;
                        if (message.time < vdad.currentTime) {
                            vdad.currentTime = message.time + Math.abs(dly);
                        } else {
                            vdad.currentTime = message.time - Math.abs(dly);
                        }
                    }else if (message.ratechange == 1) {
                        vdad.playbackRate = message.rate;
                    }
					
					if (message.seeked == 1) {
                        sk = 0;
                        if (message.time < vdad.currentTime) {
                            vdad.currentTime = message.time + Math.abs(dly);
                        } else {
                            vdad.currentTime = message.time - Math.abs(dly);
                        }
                    } 
                }
            }
            g_src_vdad1 = get_src(vdad1);
            g_src_vdad2 = get_src(vdad2);
            if (typeof g_src_vdad2 == "undefined") {
                if (!((message.src == g_src_vdad1) || (message.src == g_src_vdad2))) {
                    sEvts(vdad1);
                }
            } else if (message.src == g_src_vdad2) {
                sEvts(vdad1);
            } else {
                sEvts(vdad2);
            }
			
			
											if ((butn[message.self_id] !='') && (typeof butn[message.self_id] !=='undefined') && (message.src==butn[message.self_id].getAttribute('src'))){
									butn[message.self_id].innerHTML=butn[message.self_id].getAttribute('info')+(' (Delay: ')+(parseFloat(butn[message.self_id].getAttribute('dly_dir'))*Math.abs(dly)).toLocaleString('en-GB',{useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 7})+'s)';
									}
								last_msg=message;
            break;
        default:
            ;
            break;
    }
    return true;
}
