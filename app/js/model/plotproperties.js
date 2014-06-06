//Configureation to plotting a DataSet
var PlotProperties = Backbone.Model.extend({ 
	defaults: {
		height:500,
		width:500,
		margin:{
			top:30,
			left:50,
			bottom:30,
			right:50
		}
	},
	initialize: function(args){
		if(!args.title){
			title = "Title";
		}
	}
});