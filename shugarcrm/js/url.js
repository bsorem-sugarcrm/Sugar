// ONLY FOR TESTING - REMOVE REFERENCE L8R
var treeData;
$("#urlButton").click(function(){
	var url = $("#urlInput").val();
	var path = url.replace(/^https?:\/\/[^\/]+\//i, "").replace(/\/$/, "");
	var pathArr = path.split("/");

	//This will go into the Tree if on live site
	if(treeData == null)
		treeData = NavTree.getData();
	var branch = NavTree.findKey({ "href" : "/"+path }, treeData);

	if(branch){
		// NavTree.setTreeTitle(branch.name);
		NavTree.setData(branch);
		var content = document.querySelector('#tree-navigation-content .widget-body');
		NavTree.init("root");
		NavTree.setHover();

		$('#tree-title').text(branch.name);
	}

	if(pathArr[0] == "Documentation"){
		if(pathArr[1] == "Sugar Versions"){

		}
	}

});
