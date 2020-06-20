const { remote } = require('electron');
const { app } = remote;
const storage = require('electron-json-storage-sync')
const $ = require('jquery')
const jQuery = require('jquery')
const shit = require("jquery-ui-dist/jquery-ui");
const shell = require('electron').shell;
import 'bootstrap/dist/js/bootstrap.bundle.js';

$('.progress').slider({
    orientation: "horizontal",
    max: 1,
    value: 0,
    range: "min",
    slide: rewind,
    disabled: true
  });

function StoreProgress(podcact){
    var podcasts = storage.get("Podcasts")
    if(podcasts['status']){
        podcasts['data'][podcact] = {"done": a.currentTime, "max": a.duration};
        storage.set("Podcasts", podcasts['data'])
    }else{
        let massive = {};
        massive[podcact] = {"done": a.currentTime, "max": a.duration};
        console.log(massive)
        storage.set("Podcasts", massive)
    }
}
function StoreSetting(setting, value){
    var sets = storage.get("Settings")
    if(sets['status']){
        sets['data'][setting] = value;
        storage.set("Settings", sets['data'])
    }else{
        let massive = {};
        massive[setting] = value;
        console.log(massive)
        storage.set("Settings", massive)
    }
}

var a = new Audio(),
    podcasts = new Array(),
	file = a.src,
	timer = document.getElementById('timecode'),
	interval, tags, playing = false,
    tc_mode = 0,
    button_play_svg = '<svg class="bi bi-play-fill" width="2em" height="2em" viewBox="0 0 16 16" fill="#ffffff" xmlns="http://www.w3.org/2000/svg"><path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>',
    button_play_svg_black = '<svg class="bi bi-play-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="#000000" xmlns="http://www.w3.org/2000/svg"><path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>',
    button_pause_svg = '<svg class="bi bi-pause-fill" width="2em" height="2em" viewBox="0 0 16 16" fill="#ffffff" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/></svg>',
    x_svg = '<svg class="bi bi-x" width="1em" height="1em" viewBox="0 0 16 16" fill="#000000" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/><path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/></svg>',
    playing_title, playing_author, settings = storage.get("Settings");
    a.addEventListener("durationchange", (event) => {$( ".progress" ).slider( "option", "max", a.duration ); $( ".progress" ).slider( "option", "disabled", false );});
    a.addEventListener("ended", (event) => {playing = false; play_button_state(); player(); StoreProgress(playing_title);})
    a.addEventListener("pause", (event) => {clearInterval(interval); interval = undefined; playing = false; play_button_state(); player();});
    a.addEventListener("play", (event) => {if(!interval){interval = setInterval(player, 1000/60);} playing = true; play_button_state();})
    storage.get("Setting.timecodemode", function(e, d){if(!e){tc_mode = d;}});
    setInterval(function(){StoreProgress(playing_title);}, 5000)
    if(settings['status']){
        if(settings['data']['TimerMode'] != undefined){
            tc_mode = settings['data']['TimerMode']
        }
    }

    $(document).on('click', 'a[href^="http"]', function(event) {
        event.preventDefault();
        shell.openExternal(this.href);
    });

function change_view(view){
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
var player_function_called_times = 0;
function player(){
	var timecode = a.currentTime,
		sec_t = Math.floor(timecode % 60),
        min_t = Math.floor(timecode / 60);
        var duration;
        if(a.duration){duration = a.duration}else{duration = 0}
	var sec_d = Math.floor(duration % 60),
		min_d = Math.floor(duration / 60),
	    rtimecode = duration - timecode,
		sec_rt = Math.floor(rtimecode % 60),
        min_rt = Math.floor(rtimecode / 60);

	//timer
	switch (tc_mode){
		case 0:
			if(timecode >= 60){
				timer.innerHTML = min_t + ':' + ('0'+sec_t).slice(-2)
			}else if(timecode >= 1){
				timer.innerHTML = Math.trunc(timecode)
			}else{timer.innerHTML = ''}
			break;
		case 1:
			timer.innerHTML = min_t + ':' + ('0'+sec_t).slice(-2)+' / '+ min_d + ':' + ('0'+sec_d).slice(-2)
			break;
		case 2:
			if(rtimecode >= 60){
				timer.innerHTML = '-' + min_rt + ':' + ('0'+sec_rt).slice(-2)
			}else if(rtimecode >= 1){
				timer.innerHTML = '-' + Math.trunc(rtimecode)
			}else{timer.innerHTML = ''}
            break;
        case 3:
			timer.innerHTML = '-' + min_rt + ':' + ('0'+sec_rt).slice(-2)+' / '+ min_d + ':' + ('0'+sec_d).slice(-2)
			break;
		case 4:
			timer.innerHTML = min_t + ':' + ('0'+sec_t).slice(-2)+' / '+ min_d + ':' + ('0'+sec_d).slice(-2)+' (-'+min_rt + ':' + ('0'+sec_rt).slice(-2)+')';
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

    if(player_function_called_times > 60){
        player_function_called_times = 0;
        $( ".progress" ).slider( "value", a.currentTime );
    }
    
    player_function_called_times++;
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
    StoreProgress(playing_title);
}
function stopProgressbar(){
    clearInterval(interval);
    interval = undefined;
}
function rewind(){
    if (a.src){
        a.currentTime = $('.progress').slider( "value" );
        console.log("rewind")
        if (playing) {
            if(!interval){interval = setInterval(player, 1000/60);}  
        }
        player();
    }
}
function changeTimecode(){
	tc_mode++;
	if(tc_mode == 5){
		tc_mode = 0;
    }
    StoreSetting('TimerMode', tc_mode);
    player();
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
    var subs, ch, xmlDoc, Imagehref, title_sub, parser = new DOMParser();
    subs = storage.get("Subs");
    $('#SubList').html(null)
    for(ch in subs['data']){
        xmlDoc = parser.parseFromString(subs['data'][ch]['rss'],"text/xml");
        try{
            Imagehref = xmlDoc.getElementsByTagName("itunes:image")[0].getAttribute('href')
        }
        catch(e){
            Imagehref = xmlDoc.getElementsByTagName("url")[0].childNodes[0].href
        }
        title_sub = xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
        $('#SubList').html('<li class="list-group-item" id="'+title_sub+'"><img style="float: left; margin-right: 5px;" src="'+Imagehref+'" height="64"><h3>'+title_sub+'<button class="main_buttons" style="float: right;" onclick="DeleteSub(\''+title_sub+'\')">'+x_svg+'</button></h3><p>'+xmlDoc.getElementsByTagName("description")[0].childNodes[0].nodeValue+'</p></li>'+$('#SubList').html())
    }
}
CheckSubs();
function CheckURL(suburl){
    var subs = storage.get("Subs");
    var massive_for_json = {}, SubName;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseXML.getElementsByTagName("rss")){
                SubName = this.responseXML.getElementsByTagName("title")[0].childNodes[0].nodeValue;
                if(subs['status']){
                    subs['data'][SubName] ={rss: this.responseText, url: suburl}
                    storage.set('Subs', subs['data']);
                }else{
                    massive_for_json[SubName]={rss: this.responseText, url: suburl}
                    storage.set('Subs', massive_for_json);
                }
            }
            else{
                console.log("not rss");
            }
        }else{
            console.log(this);   
        }
        CheckSubs();
    };
  xmlhttp.open("GET", suburl, true);
  xmlhttp.send();
}
function CheckPodcasts(){
    var ch, xmlDoc, Imagehref, parser = new DOMParser(), items, iterable = 0,
    subs = storage.get("Subs");
    podcasts = [];
    $('#PodcastList').html(null)
    for(ch in subs['data']){
        xmlDoc = parser.parseFromString(subs['data'][ch]['rss'],"text/xml");
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
        var ptitle, author, l, pdone, pleft, sleft = "";
        ptitle = podcasts[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
        try{
            author = podcasts[i].parentNode.getElementsByTagName("itunes:author")[0].childNodes[0].nodeValue;
        }catch(e){
            author = podcasts[i].parentNode.getElementsByTagName("itunes:name")[0].childNodes[0].nodeValue;
        }
        var ipodcasts = storage.get("Podcasts");
        if(ipodcasts['status']){
            if(ipodcasts['data'][ptitle] != undefined){
                pdone = ipodcasts['data'][ptitle]['done'];
                pleft = ipodcasts['data'][ptitle]['max'] - ipodcasts['data'][ptitle]['done'];
            }else{
                sleft = "Вы ещё не слушали";
                pleft = undefined;
                pdone = 0;
            }
            if(pleft){
                sleft = Math.floor(pleft / 60)+" мин. осталось"
            }else if(pleft == 0){
                sleft = "Прослушано"
                pdone = 0;
            }else{
                sleft = "Вы ещё не слушали"
            }
        }else{sleft = "Вы ещё не слушали"; pdone = 0;}
        l = UsefulTimecode(podcasts[i].getElementsByTagName("itunes:duration")[0].childNodes[0].nodeValue);
        $('#PodcastList').html('<li class="list-group-item"><h3><button class="main_buttons" id="'+i+'" onclick="PlayPodcast(this.id, '+pdone+')">'+button_play_svg_black+'</button>'+ptitle+'</h3><p>'+l+' ● '+author+' ● '+ReadablePubDate(podcasts[i].getElementsByTagName("pubDate")[0].childNodes[0].nodeValue)+' ● '+ sleft +'</p></li>'+$('#PodcastList').html())
    }
}
function PlayPodcast(id, done) {
    if (playing){
        pause();
    }
    try{
        playing_author = podcasts[id].parentNode.getElementsByTagName("itunes:author")[0].childNodes[0].nodeValue;
    }catch(e){
        playing_author = podcasts[id].parentNode.getElementsByTagName("itunes:name")[0].childNodes[0].nodeValue;
    }
    playing_title = podcasts[id].getElementsByTagName("title")[0].childNodes[0].nodeValue;
    try{
        $("#podcastnow_img").attr('src', podcasts[id].parentNode.getElementsByTagName("itunes:image")[0].getAttribute('href'));
    }catch(e){
        $("#podcastnow_img").attr('src', "lpp_icon_w.png");
    }
    $("#podcastnow_title").html(playing_title);
    $("#podcastnow_author").html(playing_author);
    a.src = podcasts[id].getElementsByTagName("enclosure")[0].getAttribute('url');
    a.currentTime = done;
    change_view('NowPlaying');
    play();
    play_button_state();
}
CheckPodcasts();
function UpdatePodcasts() {
    var forcheck = storage.get("Subs");
    for(const i in forcheck['data']){
        CheckURL(forcheck['data'][i]["url"]);
        CheckPodcasts();
    }
}
function DeleteSub(sub){
    var subs = storage.get("Subs");
    delete subs.data[sub];
    storage.set("Subs", subs['data']);
    CheckSubs();
    CheckPodcasts();
}
function SoftReload(){
    document.location.reload();
}
function ClearAllData(){
    storage.clear()
}