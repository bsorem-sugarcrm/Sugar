var BASE_URL = "http://scarlett.sugarcrm.com/Sugar/shugarcrm/";

$(document).ready(function () {

	//Change SEARCH FORM ACTION - HEADER
	$("section.filters form").change(function() {
	  var action = $(this).val();
	});
	$("section.filters form").attr("action", "/search/");

	//Select ULTIMATE RIGHT AWAY - HEADER
	$("#searchForm select[name='tag1']").selectpicker('val', 'Ultimate');


	//Documentation START
	var edition = "Ultimate";
	var version = "7.6";
	var url = window.location.href.replace("http://", "").replace("https://", "");
	var path = window.location.href.replace(/^https?:\/\/[^\/]+\//i, "").replace(/\/$/, "");
	if(path.indexOf("Documentation/Sugar_Versions") > -1){

		if( path == "Documentation/Sugar_Versions"){
			$(".content-heading").append(editionVersions);
			var url = "/Documentation/Sugar_Versions/"+version+"/"+Utils.getAbbreviatedEdition(edition)+"/";
			loadEditionVersion(url);

		}
		if(path.split("/").length == 4)
			Utils.transformTableToDivs();		
	}
	
	//Edition Button Bar CLICK
	$("#groupEdition > .btn").click(function(){
	    edition = $(this).html();
	    if(edition == "Community Edition"){
	    	version = "6.5";
	    	$("#groupVersion > .btn").removeClass("active");
	    	$("#groupVersion button:nth-child(4)").addClass("active").siblings().addClass("disabled");
	    }else{
	    	$("#groupVersion > .btn").removeClass("disabled");
	    }

	    $("#editionTitle").html(version+" "+edition);
	});


	//Documentation PAGES
	if(window.location.href.indexOf("Documentation/Sugar_Versions/")>-1){
		//Version Button Bar CLICK
		$("#groupVersion > .btn").click(function(){
			if($(this).hasClass("disabled"))
				return;
		    version = $(this).html();
		    $("#editionTitle").html(version+" "+edition);
		});
		//Button Bar CLICK - ALL
		$(".btn-group > .btn").click(function(){
			if($(this).hasClass("disabled"))
				return;
		    $(this).addClass("active").siblings().removeClass("active");
		    $("#okButton").addClass("btn-primary");

		    //Only for demo
		    $("#sugar-on-ultimate .row").toggleClass("hidden");

		    //AJAX call to get site
		    var url = "/Documentation/Sugar_Versions/"+version+"/"+Utils.getAbbreviatedEdition(edition)+"/";
		    loadEditionVersion(url);
		});
	}else{
		//INDEX PAGE - load external script
		loadScript(BASE_URL+"js/index.js");
	}
});

function loadEditionVersion(url){
	$( ".content-body" ).load( url + " .content-body", function() {
  		Utils.transformTableToDivs();
   	});
}

function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}

var editionVersions = '<section class="active-filters">'+
     '<div>'+
      '   <label>Edition:</label>'+
      '   <div class="btn-group btn-group-sm" role="groupEdition" id="groupEdition">'+
      '     <button type="button" class="btn btn-default active">Ultimate</button>'+
      '    	<button type="button" class="btn btn-default">Enterprise</button>'+
      '     <button type="button" class="btn btn-default">Corporate</button>'+
      '     <button type="button" class="btn btn-default">Professional</button>'+
      '     <button type="button" class="btn btn-default">Community Edition</button>'+
      '   </div>'+
      '   &nbsp;'+
      '   <label>Version:</label>'+
      '   <div class="btn-group btn-group-sm" role="groupVersion" id="groupVersion">'+
      '     <button type="button" class="btn btn-default active">7.6</button>'+
      '     <button type="button" class="btn btn-default">7.5</button>'+
      '     <button type="button" class="btn btn-default">6.7</button>'+
      '     <button type="button" class="btn btn-default">6.5</button>'+
      '   </div>'+
     '</div>  '+
   '</section>';

var indexTemplate ='<div class="tabs" id="indexTabs"><h1></h1><ul class="nav nav-tabs"> '+            
'</ul>         </div><div class="tab-content"></div> ';

