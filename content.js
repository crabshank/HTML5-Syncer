var vdad1 = 0;
var vdad2 = 0;
var sk = 1;
var butn = [];
var clse = [];
var sdivs = [];
var bdkCol="buttonface";

function removeEls(d, array) {
    var newArray = [];
    for (let i = 0; i < array.length; i++) {
        if (array[i] != d) {
            newArray.push(array[i]);
        }
    }
    return newArray;
}


chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse) {
        console.log(message);
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
                                if (videoTags[i].src !== "") {
                                        createbutn(i, videoTags[i], videoTags[i].src);
                                } else if (videoTags[i].currentSrc !== "") {
                                        createbutn(i, videoTags[i], videoTags[i].currentSrc);
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
											butn[j]="";
										}
										if (typeof clse[j]==="undefined"){
											butn[j]="";
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
                                        videoTags[i].addEventListener("seeking", function() {
                                                if (sk == 1) {
                                                        chrome.extension.sendMessage({
                                                                message: "sEvt",
                                                                src: src,
                                                                play: 0,
                                                                pause: 0,
                                                                seeking: 1,
                                                                id: i,
                                                                self_id: i,
                                                                seeked: 0,
                                                                ratechange: 0,
                                                                rate: videoTags[i].playbackRate,
                                                                time: videoTags[i].currentTime
                                                        }, function(response) {});
                                                }
                                        });
                                        videoTags[i].addEventListener("seeked", function() {
                                                if (sk == 1) {
                                                        chrome.extension.sendMessage({
                                                                message: "sEvt",
                                                                src: src,
                                                                play: 0,
                                                                pause: 0,
                                                                seeking: 0,
                                                                id: i,
																self_id: i,
                                                                seeked: 1,
                                                                ratechange: 0,
                                                                rate: videoTags[i].playbackRate,
                                                                time: videoTags[i].currentTime
                                                        }, function(response) {});
                                                } else {
                                                        sk = 1;
                                                }
                                        });
                                        videoTags[i].addEventListener("play", function() {
                                                chrome.extension.sendMessage({
                                                        message: "sEvt",
                                                        src: src,
                                                        play: 1,
                                                        pause: 0,
                                                        seeking: 0,
                                                        id: i,
                                                        self_id: i,
                                                        seeked: 0,
                                                        ratechange: 0,
                                                        rate: videoTags[i].playbackRate,
                                                        time: videoTags[i].currentTime
                                                }, function(response) {});
                                        });
                                        videoTags[i].addEventListener("pause", function() {
                                                chrome.extension.sendMessage({
                                                        message: "sEvt",
                                                        src: src,
                                                        play: 0,
                                                        pause: 1,
                                                        seeking: 0,
                                                        id: i,
                                                        self_id: i,
                                                        seeked: 0,
                                                        ratechange: 0,
                                                        rate: videoTags[i].playbackRate,
                                                        time: videoTags[i].currentTime
                                                }, function(response) {});
                                        });
                                        videoTags[i].addEventListener("ratechange", function() {
                                                chrome.extension.sendMessage({
                                                        message: "sEvt",
                                                        src: src,
                                                        play: 0,
                                                        pause: 0,
                                                        seeking: 0,
                                                        id: i,
                                                        self_id: i,
                                                        seeked: 0,
                                                        ratechange: 1,
                                                        rate: videoTags[i].playbackRate,
                                                        time: videoTags[i].currentTime
                                                }, function(response) {});
                                        });
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
														
								if (typeof butn[message.self_id] !=='undefined'){
									if (message.time < vdad.currentTime) {
									butn[message.self_id].innerHTML=butn[message.self_id].innerHTML.split(' (Delay:')[0]+(' (Delay: ')+(message.dly).toLocaleString('en-GB',{useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 7})+'s)';
									}else{
									butn[message.self_id].innerHTML=butn[message.self_id].innerHTML.split(' (Delay:')[0]+(' (Delay: ')+(-1*message.dly).toLocaleString('en-GB',{useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 7})+'s)';
									}
								}
                        }
						
                        if (message.src == vdad2.src) {
                                sEvts(vdad1);
                        } else if (message.src !== vdad1.src) {
                                sEvts(vdad1);
                        } else if (vdad2 !== 0) {
                                sEvts(vdad2);
                        }

                        break;
						
                default:
                        ;
                        break;
        }
}