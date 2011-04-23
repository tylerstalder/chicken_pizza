// force database reload
// force_db
// if (confirm('are you sure?')){simple_control('/reload_db','put');}; return false

// clear queue
// clear_queue
// return simple_control('/queue/clear','put');

// play from beginning
// play_from_beginning
// return simple_control('/playback/play','put');

//volume
// vol
// onchange="return simple_control('/playback/setvol?vol='+this.value,'put');

//genre
//clear_genre
//  onclick="clear_selector('genre'); false"

//artist
//clear_artist
//onclick="clear_selector('artist'); false" 

//album
//clear_album
//onclick="clear_selector('album'); false 

//album_selctor
//ondblclick="add_tracks();

//tracks_selector
//ondblclick="add_tracks();

//add_tracks
//onclick="add_tracks()"

//search_box
//onkeydown="debounce_search();

//clear search box
//onclick="document.getElementById('search_box').value='';update_view();false"

var utils = {
	ajax: function(url,method,postdata,f) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange=function(){
			if (xhr.readyState==4 && xhr.status==200){
				f(JSON.parse(xhr.responseText));
			}
		}
		xhr.open(method,url,true);
		xhr.send(postdata);
	},
	tag_to_id: function(tag) {
		return tag.toLowerCase()+"_selector";
	},
	obj_to_query_string: function(obj,base_string) {
		if ( typeof(obj) == "object" ){
			var res = [];
			if ( typeof(obj.length) == "undefined" ){ // not an array
				if ( utils.key_count(obj) == 0 )
					return base_string;
				for (var i in obj)
					res.push(utils.obj_to_query_string(obj[i],base_string+"["+i+"]"));
			}
			else{ //an array
				if (obj.length==0)
					return base_string;
				for (var i = 0; i<obj.length;i++)
					res.push(utils.obj_to_query_string(obj[i],base_string+"[]")); //same line as above ;)
			}
			return res.join("&");
		}
		else{
			return base_string+"="+encodeURIComponent(obj)
		}
	},
	key_count: function(obj) {
		var count = 0;
		for (i in obj) {if (obj.hasOwnProperty(i)) count++;}
		return count;
	}, 
	array_include: function(arr,val) {
		var aLen = arr.length;
		for (var i=0; i<aLen; i++)
			if (arr[i] == val)
				return true;
		return false;
	}
};


var chicken_pizza = function() {
	// Constants
	var THE_STATUS = {queue_version: -1};
	var TIMEOUT_ID = null;
	
	var update_view = function() {
		var filters = collect_filters();
		var url="/search_and_filter?"+utils.obj_to_query_string(filters,"filters")+"&query="+document.getElementById("search_box").value;
		utils.ajax(url,"GET",null,function(response){
			update_selectors(response,filters);
		});
	};
	
	var collect_filters = function() {
		var all = {};
		var tags = ["Genre","Artist","Album"];
		for (var i in tags){
			var tag=tags[i]
			all[tag]=[];
			var e=document.getElementById(utils.tag_to_id(tag));
			for (var i=0; i<e.options.length; i++)
				if(e.options[i].selected)
					all[tag].push(e.options[i].value);
			//if (all[tag].length==0)
			//	delete all[tag];
		}
		return all;
	};
	
	var update_selectors = function(data,filters){
		var all_data = data;
		for (tag in data){
			var e=document.getElementById(utils.tag_to_id(tag));
			//e.options.length=0; <-- this seems to break things
			e.innerHTML="";
			for (var i=0;i<data[tag].length;i++){
				//possibly factor this out later...
				if (tag=="Tracks"){
					var fname=data[tag][i]["file"]
					var title=data[tag][i]["Title"] || "(Unknown Title, file="+fname+")"
					e.appendChild(new Option(title,fname))
				}
				else{
					var val=data[tag][i];
					var inc=false;
					if (typeof(filters[tag])!="undefined"){
						inc=utils.array_include(filters[tag],val||"");
					}
					if (val)
						var o=new Option(val,val,inc,inc);
					else
						var o=new Option("(Unknown "+tag+")","",inc,inc)
					e.appendChild(o);
					if (inc)
						o.selected="true"
				}
			}
		}
	};
	
	var clear_selector = function (tag){
		var e=document.getElementById(utils.tag_to_id(tag));
		for (var i=0; i<e.options.length; i++)
			e.options[i].selected=null;
		update_view();
	};
	
	var update_status = function(){
		utils.ajax("/status","GET",null,function(data){
			var ul=document.getElementById("status_list")
			ul.innerHTML=""
			for (var i in data){
				var li=document.createElement("li")
				li.textContent=i+": "+data[i]
				ul.appendChild(li)
			}
			if (THE_STATUS.queue_version!=data.queue_version || THE_STATUS.song!=data.song ||THE_STATUS.songid!=data.songid){
				update_queue(data.song);
			}
			document.getElementById("vol").value=data.volume;

			//now that comparisons are done, use this
			THE_STATUS=data;
		});
	};
	
	function update_queue(song_i){
		utils.ajax("/queue/list","GET",null,function(data){
			var ul = document.getElementById("queue_list");
			ul.innerHTML="";
			for (var i=0; i<data.length; i++){
				var track=data[i];

				var li= document.createElement("li");
				var minus = document.createElement("a");
				minus.onclick=function(){return simple_control("/queue/delete/"+this.parentElement.i,"delete");}
				li.ondblclick=function(){return simple_control("/playback/play?pos="+this.i,"put");}
				ul.appendChild(li);
				li.appendChild(minus);
				minus.appendChild(document.createTextNode("(-)"));
				minus.setAttribute("href","#");
				var playNext=document.createElement("a");

				playNext.onclick=function(){
					var cur = parseInt(THE_STATUS.song);
					var target = (this.parentElement.i <=cur) ? cur : cur+1;
					return simple_control("/queue/move/"+this.parentElement.track_id+"?pos="+target,"put");}
				li.appendChild(playNext);
				playNext.appendChild(document.createTextNode("(play next)"));
				playNext.setAttribute("href","#");
				li.appendChild(document.createTextNode("  ["+(track["Requester"]||"Unknown Requester")+"]: "+(track["Artist"]||"(Unknown Artist)")+" - "+(track["Title"]||"(Unknown Title, file="+track["file"]+")")));
				li.i=i
				li.track_id=track["Id"]
				if (i<song_i)
					li.className="already_played"
				if (i==song_i)
					li.className="current_song"

			}

		});
	};
	
	var simple_control = function(url,method){
		utils.ajax(url,method,null,function(d){update_status();});
		return false;
	};

	var add_tracks = function (){
		var e=document.getElementById("tracks_selector")
		for (var i=0; i<e.options.length; i++){
			if (e.options[i].selected){
				utils.ajax("/queue/add?filename="+encodeURIComponent(e.options[i].value),"post",null,function(d){})
			}
		}
		update_status();
	};

	var debounce_search = function(){
		if (TIMEOUT_ID)
			clearTimeout(TIMEOUT_ID)
		TIMEOUT_ID=setTimeout(function(){
			update_view();
		},250);
	};

	var do_search = function (query){
		alert("do_search depreciating, not meant to be called")
		utils.ajax("/search/"+encodeURIComponent(query)+"?"+utils.obj_to_query_string(["Genre","Artist","Album"],"tags"),"GET",null,function(d){
			update_selectors(d,{});
		});
	};
	
	return {
		
		next: function(){simple_control('/playback/next','post');},
		previous: function(){simple_control('/playback/previous','post');},
		init: function(){
			var arr=document.getElementsByClassName("filter_selector");
			for (var i in arr){
				arr[i].onchange = update_view;
			}
			update_view();
			update_status();
			setInterval(update_status,10*1000);

			var uploader = new qq.FileUploader({
				element: document.getElementById('file-uploader'),
				action: '/upload_file',
				onComplete:function(){utils.ajax('/reload_db','put',null,function(d){update_view();});}
			});
			//document.getElementById('qq-upload-button').textContent="Upload Songs";
		}
	}
}();

window.onload=function(){
	//chicken_pizza.init();
}

