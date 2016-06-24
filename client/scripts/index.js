function getData(){
    $.getJSON('./scripts/tweets.json',function(data){
        console.log(data);
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
}

$(document).ready(function(){
	getData();
});