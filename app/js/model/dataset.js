
// a series of data points to be connected by a line
var Series = Backbone.Model.extend({ 
	initialize: function(args){
		if(!args.plotProperty){
			console.log('Warning: no plot property defined');
		}
	},
	defaults: {
		index: 'index',
		type: 'subject',
		timeFormat : d3.time.format('%Y-%m-%d') //iso standard date formatter by default
	},
	domain: function(){
		var prop = this.get('plotProperty');
		return d3.extent(this.get('data'), function(d){
			return parseFloat( d[prop] );
		})
	},
	indexDomain: function(forceDefault){
		var i = this.get('index'),
			p = this.get('indexProperty'),
			data = this.get('data'),
			tf = this.get('timeFormat');

		if(i === 'time' && p !== undefined && !forceDefault){
			return d3.extent(data, function(d){
				return tf.parse( d[p] );
			})
		}
		return [ 0, data.length ];
	},
	series:function(index){
		var m = this;
		return m.get('data').map(function(d, i){
			o = { value:d[m.get('plotProperty')] };
			if(!index){
				index = m.get('index')
			}
			if(index === 'time'){
				o.index = m.get('timeFormat').parse( d[m.get('indexProperty')] );
			}else{
				o.index = i;
			}
			return o;
		});

	}
});


//A group of related Series to be visualised
var DataSet = Backbone.Collection.extend({ 
	model: Series,
	initialize: function(){},
	domain:function(){
		var domain = [];
		this.each(function(model, index) {
			var d = model.domain();
			if(domain[0] && domain[1]){
				domain[0] = Math.min(domain[0], d[0]);
				domain[1] = Math.max(domain[1], d[1]);
			}else{
				domain[0] = d[0];
				domain[1] = d[1];
			}
		});
		return domain;
	},
	index:function(){
		var type = 'time';
		this.each(function(model, index) {
			if ( model.get('index') === 'index' ){
				type = 'index';
			}
		});
		return type;
	},
	indexDomain:function(){
		var domain = [];
		var forceDefault = (this.index() === 'index');
		this.each(function(model, index){
			var d = model.indexDomain(forceDefault);
			if(domain[0] && domain[1]){
				domain[0] = Math.min( domain[0], d[0] );
				domain[1] = Math.max( domain[1], d[1] );
				domain[0] = new Date( domain[0] );
				domain[1] = new Date( domain[1] );
			}else{
				domain[0] = d[0];
				domain[1] = d[1];
			}
		});
		return domain;
	}
});