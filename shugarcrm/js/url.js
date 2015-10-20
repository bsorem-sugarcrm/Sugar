// ONLY FOR TESTING - REMOVE REFERENCE L8R
var treeData;
$("#urlButton").click(function(){
	var url = $("#urlInput").val();
	var path = url.replace(/^https?:\/\/[^\/]+\//i, "").replace(/\/$/, "");
	var pathArr = path.split("/");

	var searchPath = "";
	// https://support.sugarcrm.com/Documentation/Sugar_Versions/7.6/Ent/Application_Guide/Getting_Started
	if(pathArr[0] == "Get Started"){

	}else if(pathArr[0] == "Documentation"){
		if(pathArr[1] == "Sugar_Versions"){
			searchPath = getPathUntilDepth(pathArr, 5);
		}else if(pathArr[1] == "Mobile_Solutions"){

		}else if(pathArr[1] == "Plug_ins"){

		}else if(pathArr[1] == "Installable_Connectors"){

		}else if(pathArr[1] == "Sugar_Developer"){

		}
	}else if(pathArr[0] == "Knowledge_Base"){

	}

	//No MAX
	searchPath = "/"+path;

	//This will go into the Tree if on live site
	if(treeData == null)
		treeData = NavTree.getData();
	
	var branch = NavTree.findKey({ "href" : searchPath }, treeData);

	//Get top-level sibling nodes
	var searchPathParent = searchPath.substring(0, searchPath.lastIndexOf("/"));
	var branchParent = NavTree.findKey({ "href" : searchPathParent }, treeData);
	var siblingList = NavTree.createSiblingList(branchParent.children, branch.name);

	
	if(branch){
		NavTree.addToc(branch, "/"+path, getHeaderTags());
		// NavTree.setTreeTitle(branch.name);
		NavTree.setData(branch);
		var content = document.querySelector('#tree-navigation-content .widget-body');
		NavTree.init("root");
		NavTree.setHover();

		$('#tree-title').html("");
		$('#tree-title').append(siblingList);

		$('body').scrollspy({ target: '#toc-body' });
		$('[data-spy="scroll"]').each(function () {
		  var $spy = $(this).scrollspy('refresh')
		})

		$('#toc-body').on('activate.bs.scrollspy', function () {
		  console.log("spy");
		})
	}


});


//TEMP - DOCUMENT PAGE
$(document).ready(function () {
	var url = window.location.href.replace("http://", "").replace("https://", "");
	var path = window.location.href.replace(/^https?:\/\/[^\/]+\//i, "").replace(/\/$/, "");
	if(path.indexOf("Documentation/Sugar_Versions") > 0){

		if( path == "Documentation/Sugar_Versions"){
			$(".content-heading").appendChild(editionVersions);
		}else{
			Utils.transformTableToDivs();
		}

	}

	//Change SEARCH FORM ACTION
	$("section.filters form").change(function() {
	  var action = $(this).val();// == "people" ? "user" : "content";
	});
	$("section.filters form").attr("action", "/search/");

	//Select ULTIMATE RIGHT AWAY
	$("#searchForm select[name='tag1']").selectpicker('val', 'Ultimate');

	var edition = "Ultimate";
	var version = "7.6";
	$("#groupEdition > .btn").click(function(){
	    edition = $(this).html();
	    $("#editionTitle").html(version+" "+edition);
	});
	$("#groupVersion > .btn").click(function(){
	    version = $(this).html();
	    $("#editionTitle").html(version+" "+edition);
	});
	$(".btn-group > .btn").click(function(){
	    $(this).addClass("active").siblings().removeClass("active");
	    $("#okButton").addClass("btn-primary");

	    //Only for demo
	    $("#sugar-on-ultimate .row").toggleClass("hidden");

	    //AJAX call to get site
	    var ed = Utils.getAbbreviatedEdition(edition);
	    var url = "/Documentation/Sugar_Versions/"+version+"/"+ed+"/";
	    loadEditionVersion(url);
	    // $( ".content" ).load( url + " .content" );
	});
});

function getPathUntilDepth(path, depth){
	var result = "";
	var i = 0;
	while(path[i] != undefined && path[i].length > 0){
		result += "/" + path[i];
		i++;
		if(i == depth)
			break;
	}
	return result;
}

function getHeaderTags(){
	var order = 0;
	var tags = [];
	$('.content-body h2').each(function() {
		var node = { 
			children : [],
			href : "#" + $(this).attr('id'), 
			name : $(this).text(),
			order: order,
			sort : "m"
		};
		order++;
		tags.push(node);
	});
	return tags;
}

function showEditionVersion(){
	var ed = Utils.getAbbreviatedEdition(edition);

  	var url = "/Documentation/Sugar_Versions/"+version+"/"+ed+"/";
  	window.location.replace("http://dock-dev.sugarcrm.com"+url);
  // $("section.active-filters form").attr("action", url);
}

function loadEditionVersion(url){
	$( ".content" ).load( url + " .content" );
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
     '<div class="container">'+
      '   <label>Edition:</label>'+
      '   <div class="btn-group btn-group-sm" role="groupEdition" id="groupEdition">'+
      '     <button type="button" class="btn btn-default active">Ultimate</button>'+
      '    <button type="button" class="btn btn-default">Enterprise</button>'+
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


//Workaround hack-remove later!!!!
// loadScript("http://scarlett.sugarcrm.com/Sugar/shugarcrm/js/search.js");
