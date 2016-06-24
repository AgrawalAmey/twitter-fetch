var sb = null;

function getData(){
    $.getJSON('/get_tweets',function(data){
        $.each(data.data, function(i,data){
        	var content = '';
			content += "<div class='card-panel grey lighten-5 z-depth-1'>";
			content +=		"<span class='card-title'>" + data.author + "</span>";
			content +=      "<div class='row valign-wrapper card-content'>";
			content +=      	"<div class='col s2'>";
			content +=          	"<img src="+ data.avatar +" alt='' class='circle responsive-img'>";
			content +=          "</div>";
			content +=	        "<div class='col s10'>";
			content +=	         	"<span class='black-text'>";
			content +=	            	data.body;
			content +=	            "</span>";
			content +=	        "</div>";
			content +=      "</div>";
			content +=      "<span class='date-log'><i>"+ data.date +"</i></span>";
			content += "</div>";
            $(content).appendTo('#'+ data.sentiment + '-col');
        });
    });
    sb.update();  
}

$(document).ready(function(){
	sb = ScrollBars();

	getData();
	
	// Refresh every 6 Hrs
	setInterval(function(){
		getData();
	}, 86400000);
});

function ScrollBars(){
	this.containers = document.getElementsByClassName('tweet-col');
	//Start
	$.each(this.containers, function(index, container){
		Ps.initialize(container);
	});
	//Update
	this.update = function(){
		$.each(this.containers, function(index, container){
			Ps.update(container);
		});
	}
}