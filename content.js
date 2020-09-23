var vdad1 = 0;
var vdad2 = 0;
var sk = 1;
var butn = [];
var clse = [];
var sdivs = [];
var bdkCol="buttonface";
var attached_vids=[];

function get_src(vid){
	if (vid.src !== "") {
		return vid.src;
	} else if (vid.currentSrc !== "") {
		return vid.currentSrc;
	}else{
		return '';
	}
}

function removeEls(d, array) {
    var newArray = [];
    for (let i = 0; i < array.length; i++) {
        if (array[i] != d) {
            newArray.push(array[i]);
        }
    }
    return newArray;
}

function find_attached_info(vid){
	for (let i = 0; i < attached_vids.length; i++) {
        if (vid==attached_vids[i][0]) {
                return [attached_vids[i][1],attached_vids[i][2]];
        }
    }
}

var seeking_hdl=function(e){
	let i=find_attached_info(this);
	if (sk == 1) {
		chrome.extension.sendMessage({
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
				time: this.currentTime
		}, function(response) {});
	}
}


var seeked_hdl=function(e){
	let i=find_attached_info(this);
	if (sk == 1) {
			chrome.extension.sendMessage({
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
					time: this.currentTime
			}, function(response) {});
	} else {
			sk = 1;
	}
}

var play_hdl=function(e){
	let i=find_attached_info(this);
			chrome.extension.sendMessage({
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
					time: this.currentTime
			}, function(response) {});
}


var pause_hdl=function(e){
	let i=find_attached_info(this);
			chrome.extension.sendMessage({
					message: "sEvt",
					src: i[1],
					play: 0,
					pause: 1,
					seeking: 0,
					id: i[0],
					self_id: i[0],
					seeked: 0,
					ratechange: 0,
					durationchange: 0,
					rate: this.playbackRate,
					time: this.currentTime
			}, function(response) {});
}

var ratechange_hdl=function(e){
	let i=find_attached_info(this);
			chrome.extension.sendMessage({
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
					time: this.currentTime
			}, function(response) {});
}

var durchange_hdl=function(e){
	/*let i=find_attached_info(this);
			chrome.extension.sendMessage({
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
					time: this.currentTime
			}, function(response) {});*/
			//alert('Syncer: Duration changed!');
			console.log('Syncer: Duration changed!');
}

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse) {
        //console.log(message);
		switch (message.message) {
                case "Flush!":
                        chrome.extension.sendMessage({
                                message: "Flush!"
                        }, function(response) {});
						
                        var sync_butns = document.getElementsByClassName("sync_butn");
						
                        for (let i = sync_butns.length - 1; 0 <= i; i--){
                                if (sync_butns[i] && sync_butns[i].parentElement){
								sync_butns[i].parentElement.removeChild(sync_butns[i]);
								}
						}

                        for (let k = attached_vids.length - 1; 0 <= k; k--){
							attached_vids[k][0].removeEventListener("seeking", seeking_hdl);
							attached_vids[k][0].removeEventListener("seeked", seeked_hdl);
							attached_vids[k][0].removeEventListener("play", play_hdl);
							attached_vids[k][0].removeEventListener("pause", pause_hdl);
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

                break;
						
						
                case "Scan!":
						                        var videoTags = [
    ...document.getElementsByTagName('video'),
    ...document.getElementsByTagName('audio')
];
var tmpVidTags = videoTags;
						getStrms();
						function getStrms(){

   
                        for (let k = 0, len = videoTags.length; k < len; k++) {
                                if ((videoTags[k].src == "") && (videoTags[k].currentSrc == "") && (videoTags[k].readyState != 0)) {
									 tmpVidTags=removeEls(videoTags[k], videoTags);
								}
                        }
						
						videoTags=tmpVidTags;
						
						for (let i = 0, len = videoTags.length; i < len; i++) {
								let source=get_src(videoTags[i]);
                                if (source !== '') {
                                        createbutn(i, videoTags[i], source);
                                }
						}

						 if (videoTags.length>1){ 
						 console.log(videoTags);
						 }else if (videoTags.length==1){
						 console.log(videoTags[0]);
						 }
							
                        
						}
		
                        function b_hide(b, v) {
                                function cursorhide() {
									if((typeof b.childNodes[0]!=="undefined")&&(typeof b.childNodes[1]!=="undefined")){
									bdkCol=(b.childNodes[0].getAttribute("grn_synced")=="true")?"#00e900":"buttonface";
                                        if (!hide) {
												b.style.cssText = "display: initial !important; visibility: initial !important; z-index: "+Number.MAX_SAFE_INTEGER+" !important; position: absolute !important; background-color: transparent !important;";
												if (b.childNodes.length==2){
													b.childNodes[0].style.cssText = "display: initial !important; visibility:initial !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: "+bdkCol+" !important; border-color: "+bdkCol+" !important";
													b.childNodes[1].style.cssText = "display: initial !important; visibility:initial !important; background-color: #de0000 !important; webkit-text-fill-color: #ececec !important; border-width: 2px !important; border-style: outset !important; border-color: #de0000 !important";
												}
                                                clearTimeout(timer);
                                                timer = setTimeout(function() {
													if ((!(b.childNodes[0].matches(':hover')))&&(!(b.childNodes[1].matches(':hover')))){
                                                        b.style.cssText = "display: none !important; visibility: hidden !important;";
														if (b.childNodes.length==2){
															b.childNodes[0].style.cssText = "display: none !important; visibility:hidden !important;";
															b.childNodes[1].style.cssText = "display: none !important; visibility:hidden !important;";
														}
                                                        hide = true;
                                                        setTimeout(function() {
                                                                hide = false;
                                                        }, 1);
													}
                                                }, 3000);
                                        }
								}
                                }
							    v.removeEventListener('mousemove', cursorhide, true);
                                var timer;
                                var hide = false;
                                b.style.cssText = "display: initial !important; visibility: initial !important; z-index: "+Number.MAX_SAFE_INTEGER+" !important; position: absolute !important; background-color: transparent !important;";
								if (b.childNodes.length==2){
								bdkCol=(b.childNodes[0].getAttribute("grn_synced")=="true")?"#00e900":"buttonface";
                                b.childNodes[0].style.cssText = "display: initial !important; visibility:initial !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: "+bdkCol+" !important; border-color: "+bdkCol+" !important";
                                b.childNodes[1].style.cssText = "display: initial !important; visibility:initial !important; background-color: #de0000 !important; webkit-text-fill-color: #ececec !important; border-width: 2px !important; border-style: outset !important; border-color: #de0000 !important";
								}
                                v.addEventListener('mousemove', cursorhide, true);
                        }

                        function createbutn(i, video, src) {
                       				for (let j=0; j<i; j++){
										if (typeof butn[j]==="undefined"){
											butn[j]="";
										}
										if (typeof sdivs[j]==="undefined"){
											sdivs[j]="";
										}
										if (typeof clse[j]==="undefined"){
											clse[j]="";
										}
									}
                                sdivs[i] = document.createElement("div");
                                sdivs[i].style.cssText = "display: initial !important; visibility: initial !important; z-index: "+Number.MAX_SAFE_INTEGER+" !important; position: absolute !important; background-color: transparent !important;";
                                butn[i] = document.createElement("button");
								butn[i].setAttribute("grn_synced", false);	
								butn[i].style.cssText = "display: initial !important; visibility: initial !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: buttonface !important; border-color: buttonface !important";
                                butn[i].innerHTML = "Sync: " + video.nodeName + ", " + src;
                                butn[i].className = "sync_butn";
                                video.insertAdjacentElement('beforebegin', sdivs[i]);
                                butn[i].addEventListener("click", btclk(i, src));
								clse[i] = document.createElement("button");
								clse[i].style.cssText = "display: initial !important; visibility: initial !important; background-color: #de0000 !important; webkit-text-fill-color: #ececec !important; border-width: 2px !important; border-style: outset !important; border-color: #de0000 !important";
                                clse[i].innerHTML = "×";
								clse[i].className = "sync_butn";
								sdivs[i].appendChild(butn[i]);
								sdivs[i].appendChild(clse[i]);
                                clse[i].onclick = function btclse() {
									clse[i].remove();
									butn[i].remove();
									sdivs[i].remove();
								};
                                video.addEventListener('mouseenter', b_hide(sdivs[i], video), true);
                        }
						

                        function btclk(i, src) {
                                return function() {
									
									event.preventDefault();
									event.stopPropagation();
										videoTags[i].playbackRate=1;
                                        chrome.extension.sendMessage({
                                                message: "Sync this!",
                                                id: i,
                                                self_id: i,
                                                time: videoTags[i].currentTime,
                                                src: src
                                        }, function(response) {});
                                        butn[i].innerHTML = "SYNCED!: " + videoTags[i].nodeName + ", " + src+' (Delay:';
										butn[i].style.cssText="display: initial !important; visibility: initial !important; webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: #00e900 !important; border-color: #00e900 !important;";
										butn[i].setAttribute("grn_synced", true);	
                                        if (vdad1 == 0) {
                                                vdad1 = videoTags[i];
                                        } else {
                                                vdad2 = videoTags[i];
                                        }
										attached_vids.push([videoTags[i],i,src]);
                                        videoTags[i].addEventListener("seeking", seeking_hdl);
                                        videoTags[i].addEventListener("seeked", seeked_hdl);
                                        videoTags[i].addEventListener("play", play_hdl);
                                        videoTags[i].addEventListener("pause", pause_hdl);
                                        videoTags[i].addEventListener("ratechange", ratechange_hdl);
                                        videoTags[i].addEventListener("durationchange", durchange_hdl);
                                };
                        }

					if (butn.length>1){ 
					 console.log(butn);
					 }else if(butn.length==1){
					 console.log(butn[0]);
					 }
						
                        chrome.extension.sendMessage({
                                message: "Buttons created!"
                        }, function(response) {});
                        break;
						
						
                case "sEvt":

                        function sEvts(vdad) {
							    console.log(message);
                                if (message.play == 1) {
                                        vdad.play();
                                } else if (message.pause == 1) {
                                        vdad.pause();
                                } else if (message.seeking == 1) {
                                        sk = 0;
                                        if (message.time < vdad.currentTime) {
                                                vdad.currentTime = message.time + Math.abs(message.dly);
                                        } else {
                                                vdad.currentTime = message.time - Math.abs(message.dly);
                                        }
                                } else if (message.seeked == 1) {
                                        sk = 0;
                                        if (message.time < vdad.currentTime) {
                                                vdad.currentTime = message.time + Math.abs(message.dly);	
                                        } else {
                                                vdad.currentTime = message.time - Math.abs(message.dly);
                                        }
                                } else if (message.ratechange == 1) {
                                        vdad.playbackRate = message.rate;
                                }
														
								if ((butn[message.self_id] !='')&&(typeof butn[message.self_id] !=='undefined')){
									if ((message.time <= vdad.currentTime)||(message.dly==0)) {
									butn[message.self_id].innerHTML=butn[message.self_id].innerHTML.split(' (Delay:')[0]+(' (Delay: ')+(message.dly).toLocaleString('en-GB',{useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 7})+'s)';
									}else{
									butn[message.self_id].innerHTML=butn[message.self_id].innerHTML.split(' (Delay:')[0]+(' (Delay: ')+(-1*message.dly).toLocaleString('en-GB',{useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 7})+'s)';
									}
								}
                        }
						
						g_src_vdad1=get_src(vdad1);
						g_src_vdad2=get_src(vdad2);
						
							if(typeof g_src_vdad2=="undefined"){
								if(!((message.src==g_src_vdad1)||(message.src==g_src_vdad2))){
									sEvts(vdad1);
								}
							}else if(message.src==g_src_vdad2){
								sEvts(vdad1);
							}else{
								sEvts(vdad2);
							}
							
                        break;
						
                default:
                        ;
                        break;
        }
}