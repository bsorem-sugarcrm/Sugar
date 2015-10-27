//TEMP - DOCUMENT PAGE
$(document).ready(function () {

	  var edition;
	  var sitemap;

	  //Load SITEMAP.JS
	  $.ajax({
	      // url: '/assets/js/scripts/sitemap.js',
	      url: 'http://support.sugarcrm.com/assets/js/scripts/sitemap.js',
	      dataType: "jsonp",
	      jsonp: false,
	      jsonpCallback: 'sitemap'
	  }).done(function (tree) {
	  	// var branch = Utils.findKey({href:"/Get_Started/End_Users/Community_Edition"}, data);
	  	sitemap = tree;
	  });

	  //Initial HACK - REMOVE!!!
	  $(".content-section .accordion li:nth-child(1)").siblings().remove();
	  $(".content-section .accordion").append("<div class='section-holder'></div>");

	  //All Button Bar Click
	  $(".btn-group > .btn").click(function(){
	  	  $(this).addClass("active").siblings().removeClass("active");
	  });

	  //User Type Button Bar Click
	  $("#groupUserType > .btn").click(function(){
	      usertype = $(this).html();
	      $(".section-holder" ).empty();	
	      if(usertype == "Developers"){
	      	$('#editionHolder').addClass("hidden");
	      	edition = "";
	      	showTabs(edition);	
	  	  }else{
	      	$('#editionHolder').removeClass("hidden");
	      	$("#groupEdition > .btn").removeClass("active");
	      }
	  });

	  //Edition type Button bar Click
	  $("#groupEdition > .btn").click(function(){
	      edition = $(this).html();
	      $(".section-holder" ).empty();	
	      showTabs(edition);	
	  });

	  //Show the tabs from the Button Bar Selection
	  function showTabs(tabs){
	  	$(".content-section .accordion a").addClass("collapsed");
	  	$(".content-section .accordion div").removeClass("in");

	  	var url = "/Get_Started/"+Utils.replaceSpaceToUnderScore(usertype);
	  	if(edition != "")
	  		url += "/"+Utils.replaceSpaceToUnderScore(edition);
	  	var branch = Utils.findKey({href: url }, sitemap);
	  	if(branch){
	  		$(".section-holder" ).append(indexTemplate);	
	  		for(var i=0; i<branch.children.length; i++){
	  			$("#indexTabs ul").append('<li role="presentation"><a href="#">'+branch.children[i].name+'</a></li>');
	  		}
	  		$("#indexTabs ul li:nth-child(1)").addClass("active");
	  		$("#indexTabs h1").text("Getting Started with Sugar "+edition+" for "+usertype);


	  		loadSection($("#indexTabs ul li:nth-child(1) a").html());
	  	}
	  	
	  	$(".nav-tabs a").click(function(){
	  		var section = $(this).html();
	  		if(section != "Plug-Ins")
	  			section = section.split("-").join("_").split(" ").join("_");
	  		loadSection(section);
	  		$(this).parent().addClass("active").siblings().removeClass("active");
	  	});
	  }

	  //Load the selected Section into the Tab
	  function loadSection(section){
	  	 var url = "/Get_Started/"+Utils.replaceSpaceToUnderScore(usertype);
	  	 if(edition != "")
	  	 	url += "/"+Utils.replaceSpaceToUnderScore(edition);
	  	 url += "/"+section;
	      $( ".tab-content" ).load( url + " .content-body", function() {
	        
	      });
	  }
});
