const { remote } = require('electron');
const { app } = remote;
const storage = require('electron-json-storage')
const $ = require('jquery');
const shell = require('electron').shell;
import 'bootstrap/dist/js/bootstrap.bundle.js';

var a = new Audio(),
    podcasts = new Array(),
	progress = document.getElementById('pr'),
	file = a.src,
	rfile = new File([], file),
	timer = document.getElementById('timecode'),
	interval, tags, playing = false,
    tc_mode = 0,
    button_play_svg = '<svg class="bi bi-play-fill" width="2em" height="2em" viewBox="0 0 16 16" fill="#ffffff" xmlns="http://www.w3.org/2000/svg"><path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>',
    button_play_svg_black = '<svg class="bi bi-play-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="#000000" xmlns="http://www.w3.org/2000/svg"><path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>',
    button_pause_svg = '<svg class="bi bi-pause-fill" width="2em" height="2em" viewBox="0 0 16 16" fill="#ffffff" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/></svg>',
    x_svg = '<svg class="bi bi-x" width="1em" height="1em" viewBox="0 0 16 16" fill="#000000" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/><path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/></svg>',
    precent = document.getElementById('precentage'),
    playing_title, playing_author,
    pr = document.getElementById('progress');
    a.addEventListener("durationchange", (event) => {pr.max = a.duration; storage.set("Podcast."+playing_title, {"done": a.currentTime, "max": a.duration});});
    a.addEventListener("ended", (event) => {playing = false; play_button_state(); player();})
    a.addEventListener("pause", (event) => {clearInterval(interval); interval = undefined; playing = false; play_button_state(); player();});
    a.addEventListener("play", (event) => {if(!interval){interval = setInterval(player, 1000/60);} playing = true; play_button_state();})
    window.addEventListener("close", (event) => {storage.set("Podcast."+playing_title, {"done": a.currentTime, "max": a.duration});})

    $(document).on('click', 'a[href^="http"]', function(event) {
        event.preventDefault();
        shell.openExternal(this.href);
    });
        
function change_view(view){
    console.log(view);
    switch (view) {
        case "NowPlaying":
            $('#SettingsLink').removeClass('active');
            $('#SubsListLink').removeClass('active'); 
            $('#PodcatsListLink').removeClass('active');
            $('#NowPlayingLink').addClass('active');
            $('#NowPlaying').css("display", "block");
            $('#SubsList').css("display", "none");
            $('#PodcatsList').css("display", "none");
            $('#Settings').css("display", "none");
            break;
        case "PodcatsList":
            $('#SettingsLink').removeClass('active');
            $('#SubsListLink').removeClass('active'); 
            $('#PodcatsListLink').addClass('active');
            $('#NowPlayingLink').removeClass('active');
            $('#NowPlaying').css("display", "none");
            $('#SubsList').css("display", "none");
            $('#PodcatsList').css("display", "block");
            $('#Settings').css("display", "none");
            break;
        case "SubsList":
            $('#SettingsLink').removeClass('active');
            $('#SubsListLink').addClass('active'); 
            $('#PodcatsListLink').removeClass('active');
            $('#NowPlayingLink').removeClass('active');
            $('#NowPlaying').css("display", "none");
            $('#SubsList').css("display", "block");
            $('#PodcatsList').css("display", "none");
            $('#Settings').css("display", "none");
            break;
        case "Settings":
            $('#SettingsLink').addClass('active');
            $('#SubsListLink').removeClass('active'); 
            $('#PodcatsListLink').removeClass('active');
            $('#NowPlayingLink').removeClass('active');
            $('#NowPlaying').css("display", "none");
            $('#SubsList').css("display", "none");
            $('#PodcatsList').css("display", "none");
            $('#Settings').css("display", "block");
            break;
    }
}
function play_button_state(){
    if (playing) {
        $("#play").html(button_pause_svg)
        document.getElementById('play').setAttribute('onclick', 'pause(); play_button_state()');
    }else{
        $("#play").html(button_play_svg)
        document.getElementById('play').setAttribute('onclick', 'play(); play_button_state()');
    }
}
play_button_state();
function player(){
	var timecode = a.currentTime,
		sec_t = Math.floor(timecode % 60),
		min_t = Math.floor(timecode / 60);
	var duration = a.duration,
		sec_d = Math.floor(a.duration % 60),
		min_d = Math.floor(a.duration / 60),
		prcnt = (a.currentTime/a.duration)*100;
	var rtimecode = duration - timecode,
		sec_rt = Math.floor(rtimecode % 60),
		min_rt = Math.floor(rtimecode / 60);

	//timer
	switch (tc_mode){
		case 0:
			if(timecode > rtimecode){
				if(rtimecode >= 60){
					timer.innerHTML = '-' + min_rt + ':' + ('0'+sec_rt).slice(-2)
				}else if(rtimecode >= 1){
					timer.innerHTML = '-' + Math.trunc(rtimecode)
				}else{timer.innerHTML = ''}
			}else if(timecode >= 60){
				timer.innerHTML = min_t + ':' + ('0'+sec_t).slice(-2)
			}else if(timecode >= 1){
				timer.innerHTML = Math.trunc(timecode)
			}else{timer.innerHTML = ''}
			break;
		case 1:
			if(timecode >= 60){
				timer.innerHTML = min_t + ':' + ('0'+sec_t).slice(-2)
			}else if(timecode >= 1){
				timer.innerHTML = Math.trunc(timecode)
			}else{timer.innerHTML = ''}
			break;
		case 2:
			if(rtimecode >= 60){
				timer.innerHTML = '-' + min_rt + ':' + ('0'+sec_rt).slice(-2)
			}else if(rtimecode >= 1){
				timer.innerHTML = '-' + Math.trunc(rtimecode)
			}else{timer.innerHTML = ''}
			break;
		case 3:
			timer.innerHTML = min_t + ':' + ('0'+sec_t).slice(-2)+'/'+ min_d + ':' + ('0'+sec_d).slice(-2)+' (-'+min_rt + ':' + ('0'+sec_rt).slice(-2)+')';
			break;
	}

    if(playing_title){
        if(playing){
            if(min_rt > 0){
                document.title = playing_title+" от "+playing_author+" — осталось "+min_rt+" мин. — LazyPodcastPlayer"
            }else{
                document.title = playing_title+" от "+playing_author+" — последняя минута — LazyPodcastPlayer"
            }
        }else{
            if(rtimecode > 0){
                if(min_rt > 0){
                    document.title = "Приостановлено: "+playing_title+" от "+playing_author+" — осталось "+min_rt+" мин. — LazyPodcastPlayer"
                }else{
                    document.title = "Приостановлено: "+playing_title+" от "+playing_author+" — последняя минута — LazyPodcastPlayer"
                } 
            }else{
                document.title = playing_title+" от "+playing_author+" — завершено — LazyPodcastPlayer" 
            }  
        }
    }

	pr.value = timecode;
}
player();
function play(){
    if (a.src){
        a.play();
        if(!interval){interval = setInterval(player, 1000/60);}
        playing = true
    }
}
function pause(){
	a.pause();
    clearInterval(interval);
    interval = undefined;
    playing = false;
    player();
    storage.set("Podcast."+playing_title, {"done": a.currentTime, "max": a.duration});
}
function change(){
	a.currentTime = pr.value;
}
function stopProgressbar(){
    clearInterval(interval);
    interval = undefined;
}
function rewind(){
    a.currentTime = pr.value;
    if (playing) {
        if(!interval){interval = setInterval(player, 1000/60);}  
    }
    player();
}
function changeTimecode(){
	tc_mode++;
	if(tc_mode == 4){
		tc_mode = 0;
	}
}
function ReadablePubDate(pubDate) {
    var ourDate = Date.parse(pubDate),
        ms = new Date(ourDate),
        year = ms.getFullYear(),
        jsmonth = ms.getMonth(),
        month = [],
        day = ms.getDate(),
        hour = ms.getHours(),
        minutes = ms.getMinutes(),
        second = ms.getSeconds();

        month[0] = "января";
        month[1] = "февраля";
        month[2] = "марта";
        month[3] = "апреля";
        month[4] = "мая";
        month[5] = "июня";
        month[6] = "июля";
        month[7] = "августа";
        month[8] = "сентября";
        month[9] = "октября";
        month[10] = "ноября";
        month[11] = "декабря";

        return day + " " + month[jsmonth] + " " + year + " г. " + hour + ":" + ('0' + minutes).slice(-2) + ":" + ('0' + second).slice(-2)
}
function UsefulTimecode(time) {
    if (Number.isInteger(time)){
        var s = Math.floor(time % 60),
            m = Math.floor(time / 60);
        return m+":"+('0'+s).slice(-2)
    }else{
        var timesp = time.split(":"), sec, mins, hrs, s, m;
        switch (timesp.length){
            case 1:
                sec = parseInt(time, 10);
                s = Math.floor(sec % 60);
                m = Math.floor(sec / 60);
                return m+":"+('0'+s).slice(-2)
            case 2:
                return time
            case 3:
                sec = parseInt(timesp[2])
                mins = parseInt(timesp[1]);
                hrs = parseInt(timesp[0]);
                s = timesp[2];
                m = mins + hrs*60
                return m+":"+('0'+s).slice(-2)
        }
        console.log(parseInt(time, 10));
        console.log(timesp)
    }
}
function CheckSubs(){
    storage.getAll(function(err, data){
        var subs, ch, xmlDoc, Imagehref, title_sub, parser = new DOMParser();
        subs = data['Subs'];
        $('#SubList').html(null)
        for(ch in subs){
            console.log(ch);
            xmlDoc = parser.parseFromString(subs[ch]['xml'],"text/xml");
            try{
                Imagehref = xmlDoc.getElementsByTagName("itunes:image")[0].getAttribute('href')
                console.log(Imagehref);
                
            }
            catch(e){
                Imagehref = xmlDoc.getElementsByTagName("url")[0].childNodes[0].href
                console.log("in catch "+Imagehref);
            }
            title_sub = xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
            $('#SubList').html('<li class="list-group-item" id="'+title_sub+'"><img style="float: left; margin-right: 5px;" src="'+Imagehref+'" height="64"><h3>'+title_sub+'<button class="main_buttons" style="float: right;" onclick="DeleteSub(\''+title_sub+'\')">'+x_svg+'</button></h3><p>'+xmlDoc.getElementsByTagName("description")[0].childNodes[0].nodeValue+'</p></li>'+$('#SubList').html())
        }
    })

}
CheckSubs();
function CheckURL(suburl){
    var SubName, SubRss;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseXML.getElementsByTagName("rss")){
                SubName = this.responseXML.getElementsByTagName("title")[0].childNodes[0].nodeValue;
                SubRss = this.responseText;
                storage.set('Subs.'+SubName, {xml: SubRss, link: suburl}, function(error) {if (error) throw error;});
            }
            else{
                console.log("not rss");
            }
        }else{
            console.log(this);   
        }
    };
  xmlhttp.open("GET", suburl, true);
  xmlhttp.send();
}
function CheckPodcasts(){
    storage.getAll(function(err, data){
        var subs, ch, xmlDoc, Imagehref, parser = new DOMParser(), items, iterable = 0,
        subs = data['Subs'];
        podcasts = [];
        $('#PodcastList').html(null)
        console.log(podcasts)
        for(ch in subs){
            console.log(ch);
            xmlDoc = parser.parseFromString(subs[ch]['xml'],"text/xml");
            items = xmlDoc.getElementsByTagName('item')
            for (const i in items) {
                if(items[i].nodeType == 1){
                    podcasts[iterable] = items[i];
                    iterable++;
                }
            }
        }
        podcasts.sort(function(a, b){
            if(Date.parse(a.getElementsByTagName("pubDate")[0].childNodes[0].nodeValue) > Date.parse(b.getElementsByTagName("pubDate")[0].childNodes[0].nodeValue)){
                return 1
            }
            if(Date.parse(a.getElementsByTagName("pubDate")[0].childNodes[0].nodeValue) < Date.parse(b.getElementsByTagName("pubDate")[0].childNodes[0].nodeValue)){
                return -1
            }
            return 0
        })
        for(const i in podcasts){
            var author, l;
            author = podcasts[i].parentNode.getElementsByTagName("itunes:author")[0].childNodes[0].nodeValue;
            l = UsefulTimecode(podcasts[i].getElementsByTagName("itunes:duration")[0].childNodes[0].nodeValue);
            $('#PodcastList').html('<li class="list-group-item"><h3><button class="main_buttons" id="'+i+'" onclick="PlayPodcast(this.id)">'+button_play_svg_black+'</button>'+podcasts[i].getElementsByTagName("title")[0].childNodes[0].nodeValue+'</h3><p>'+l+' ● '+author+' ● '+ReadablePubDate(podcasts[i].getElementsByTagName("pubDate")[0].childNodes[0].nodeValue)+'</p></li>'+$('#PodcastList').html())
        }
    }) 
}
function PlayPodcast(id) {
    if (playing){
        pause();
    }
    playing_author = podcasts[id].parentNode.getElementsByTagName("itunes:author")[0].childNodes[0].nodeValue;
    playing_title = podcasts[id].getElementsByTagName("title")[0].childNodes[0].nodeValue;
    $("#podcastnow_img").attr('src', podcasts[id].parentNode.getElementsByTagName("itunes:image")[0].getAttribute('href'));
    $("#podcastnow_title").html(playing_title);
    $("#podcastnow_author").html(playing_author);
    a.src = podcasts[id].getElementsByTagName("enclosure")[0].getAttribute('url');
    change_view('NowPlaying');
    play();
    play_button_state();
}
CheckPodcasts();
function UpdatePodcasts() {
    storage.getAll(function (e, data) {
        var forcheck = data["Subs"]
        for(const i in forcheck){
            CheckURL(data["Subs"][i]["link"]);
            CheckPodcasts();
            CheckSubs();
        }
    })
}
function DeleteSub(sub){
    storage.remove("Subs."+sub, function(e){
        CheckPodcasts();
        CheckSubs();
    })
}
function SoftReload(){
    document.location.reload();
}
function ClearAllData(){
    storage.clear(function(e){console.log(e)})
}
storage.getAll(function(e, d){console.log(d)})