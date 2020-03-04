var vdad1 = 0;
var vdad2 = 0;
var sk = 1;


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
        switch (message.message) {
			
                case "Flush!":
                        chrome.extension.sendMessage({
                                message: "Flush!"
                        }, function(response) {});
                        console.log(message);
						
                        var sync_butns = document.getElementsByClassName("sync_butn");
						
                        for (var i = sync_butns.length - 1; 0 <= i; i--){
                                if (sync_butns[i] && sync_butns[i].parentElement){
								sync_butns[i].parentElement.removeChild(sync_butns[i]);
								}
						}
						
                break;
						
						
                case "Scan!":
                        console.log(message);
						var butn = [];
						var clse = [];

						                        var videoTags = [
    ...document.getElementsByTagName('video'),
    ...document.getElementsByTagName('audio')
];
var tmpVidTags = videoTags;
						getStrms();
						function getStrms(){

   
                        for (var k = 0, len = videoTags.length; k < len; k++) {
                                if ((videoTags[k].src == "") && (videoTags[k].currentSrc == "")) {
									 tmpVidTags=removeEls(videoTags[k], videoTags);
								}
                        }
						
						videoTags=tmpVidTags;
						
						                        for (var i = 0, len = videoTags.length; i < len; i++) {
                                if (videoTags[i].src !== "") {
                                        createbutn(i, videoTags[i], videoTags[i].src);
                                } else if (videoTags[i].currentSrc !== "") {
                                        createbutn(i, videoTags[i], videoTags[i].currentSrc);
                        }
												}


   console.log(videoTags);
						
                        
		}
		
		
		
		
                        function b_hide(b, v) {
                                var timer;
                                var hide = false;
                                b.style.display = '';
                                v.addEventListener('mousemove', cursorhide, true);

                                function cursorhide() {
                                        if (!hide) {
                                                b.style.display = '';
                                                clearTimeout(timer);
                                                timer = setTimeout(function() {
                                                        b.style.display = 'none';
                                                        hide = true;
                                                        setTimeout(function() {
                                                                hide = false;
                                                        }, 1);
                                                }, 3000);
                                        }
                                }
                        }

                        function createbutn(i, video, src) {
                       
                                butn[i] = document.createElement("button");
                                butn[i].style.zIndex = "999999";
                                butn[i].style.position = "absolute";
								butn[i].style.webkitTextFillColor="black";
								butn[i].style.borderWidth="2px";
								butn[i].style.borderStyle="outset";
								butn[i].style.borderColor="buttonface";
                                butn[i].innerHTML = "Sync: " + video.nodeName + ", " + src;
                                butn[i].className = "sync_butn";
                                video.insertAdjacentElement('beforebegin', butn[i]);
                                butn[i].addEventListener("click", btclk(i, src));
								clse[i] = document.createElement("button");
								clse[i].style.zIndex = "999999";
                                clse[i].style.position = "absolute";
                                clse[i].style.left = butn[i].clientWidth+12+"px";
                                clse[i].innerHTML = "×";
								clse[i].className = "sync_butn";
								clse[i].style.backgroundColor="#de0000";
								clse[i].style.webkitTextFillColor="#ececec";
								clse[i].style.borderWidth="2px";
								clse[i].style.borderStyle="outset";
								clse[i].style.borderColor="#de0000";
								butn[i].insertAdjacentElement('afterend', clse[i]);
                                clse[i].onclick = function btclse() {
									clse[i].remove();
									butn[i].remove();
								};
                                video.addEventListener('mouseenter', b_hide(butn[i], video), true);
                                video.addEventListener('mouseenter', b_hide(clse[i], video), true);
                        }
						



                        function btclk(i, src) {
                                return function() {
                                        chrome.extension.sendMessage({
                                                message: "Sync this!",
                                                id: i,
                                                time: videoTags[i].currentTime,
                                                src: src
                                        }, function(response) {});
                                        butn[i].innerHTML = "SYNCED!: " + videoTags[i].nodeName + ", " + src;
                                        butn[i].style.borderColor="#00e900";
                                        butn[i].style.backgroundColor = "#00e900";
										clse[i].style.left = butn[i].clientWidth+12+"px";
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
                                                        seeked: 0,
                                                        ratechange: 1,
                                                        rate: videoTags[i].playbackRate,
                                                        time: videoTags[i].currentTime
                                                }, function(response) {});
                                        });
                                };
                        }
						
                        console.log(butn);
						
                        chrome.extension.sendMessage({
                                message: "Buttons created!"
                        }, function(response) {});
                        break;
						
						
                case "sEvt":
                        console.log(message);

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
                        console.log(message);
                        break;
        }
}