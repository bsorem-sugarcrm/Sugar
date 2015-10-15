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
	}


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
