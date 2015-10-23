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
			searchPath = NavTree.getPathUntilDepth(pathArr, 5);
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

	
	if(branch){
		// NavTree.addToc(branch, "/"+path, NavTree.getHeaderTags());
		NavTree.addMainContent(branch, "/"+path, NavTree.getHeaderTags());
		// NavTree.setTreeTitle(branch.name);
		NavTree.setData(branch);
		var content = document.querySelector('#tree-navigation-content .widget-body');
		NavTree.init("root");
		NavTree.setHover();

		$('#tree-title').html("");

		var branchParent = NavTree.findKey({ "href" : searchPathParent }, treeData);
		if(branchParent){
			var siblingList = NavTree.createSiblingList(branchParent.children, branch.name);
			if(siblingList)
				$('#tree-title').append(siblingList);
		}



		var widgets_bottom = $(".content-footer");
        if (widgets_bottom && siblingList) {
            // html container
            var prevnext = document.createElement('div');
            prevnext.setAttribute('id', 'prevnext');
            prevnext.setAttribute('class', 'row');
            // Set vars
            var prev = NavTree.siblingPrev;
            var next = NavTree.siblingNext;
            var pHTML = '', nHTML = '';
            var maxlen = 40;
            var showPaging = false;

            if (prev) {
                var pFull = prev.name;
                var pName = (pFull.length > maxlen) ? pFull.substring(0, maxlen).trim() + '...' : pFull;
                pHTML = '<div class="col-xs-6 text-left"><span id="prevnext_previous" data-toggle="tooltip" title="' + pFull + '"><a href="' + prev.href + '"> < Previous</a> | ' + pName + '</span></div>';
                showPaging = true;
            }
            if (next) {
                var nFull = next.name;
                var nName = (nFull.length > maxlen) ? nFull.substring(0, maxlen).trim() + '...' : nFull;
                nHTML = '<div class="col-xs-6 text-right"><span id="prevnext_next" data-toggle="tooltip" title="' + nFull + '">' + nName + ' | <a href="' + next.href + '">Next ></a></span></div>';
                showPaging = true;
            }
            if (showPaging) {
                prevnext.innerHTML = pHTML + nHTML;
                var fi = widgets_bottom.children().first();
                $(prevnext).insertBefore(widgets_bottom.children().first());
                // widgets_bottom.insertBefore(prevnext, widgets_bottom.first());
                $('[data-toggle="tooltip"]').tooltip({ placement: 'top' });
            }
        }

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

	//Change SEARCH FORM ACTION - HEADER
	$("section.filters form").change(function() {
	  var action = $(this).val();// == "people" ? "user" : "content";
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
	//INDEX PAGE
	  var edition;

	  $("#groupUserType > .btn").click(function(){
	      usertype = $(this).html();
	      $('#editionHolder').removeClass("hidden");
	  });

	  $("#groupEdition > .btn").click(function(){
	      edition = $(this).html();
	      if(!($("#indexTabs").length)){
	      	$( ".content-section" ).empty();	
	      	$( ".content-section" ).append(indexTabs);	
	      }


	      var url = "/Get_Started/"+Utils.replaceSpaceToUnderScore(usertype)+"/"+Utils.replaceSpaceToUnderScore(edition);
	      $( ".tab-content" ).load( url + " .content-body", function() {
	        
	      });
	  });
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

var indexTabs ='<div class="tabs" id="indexTabs">           <ul class="nav nav-tabs"> '+            
'<li role="presentation" class="active"><a href="#">On-Demand</a></li>  '+           
'<li role="presentation"><a href="#">On-Site</a></li>'+
'<li role="presentation"><a href="#">Mobile</a></li>'+   
'<li role="presentation"><a href="#">Plug-Ins</a></li>'+     
'</ul>         </div><div class="tab-content"></div> ';
