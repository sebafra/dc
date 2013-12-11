

window.ModelManager = {

	type:{
		hotel:{code:"hotel",url:"/getHotels",fileName:"hotel.json"}, 
		restaurant:{code:"restaurant",url:"/getRestaurants",fileName:"restaurant.json"}
	},

	setup:{
		hotel:{
	            items: [	
	                     {"name":"hotel 1","id":"1"}
		           		,{"name":"hotel 2","id":"2"}
		           		,{"name":"hotel 3","id":"3"}
		           		,{"name":"hotel 4","id":"4"}
	           	   ],
	           labelPlural: "Hoteles",
	           labelSingular: "Hotel",
	           type: "hotel"
		}, 
		restaurant:{
	            items: [	
	                     {"name":"rest 1","id":"1"}
		           		,{"name":"rest 2","id":"2"}
		           		,{"name":"rest 3","id":"3"}
		           		,{"name":"rest 4","id":"4"}
	           	   ],
	           labelPlural: "Restaurantes",
	           labelSingular: "Restaurante",
	           type: "restaurant"
		}
	},
    
	getDefinition:function (type) {

		alert("getDefinition-type:"+type);
		
    	if(type == this.type.restaurant.code){
    		return this.type.restaurant;
    	} else {
    		return this.type.hotel;
    	}
    	
    	return;
    },

	getSetup:function (type) {

		alert("getSetup-type:"+type);

		if(type == this.type.restaurant.code){
    		return this.setup.restaurant;
    	} else {
    		return this.setup.hotel;
    	}
    	
    	return;
    },

	urlBase:"http://www.diproach.com/api/dc",
	//urlBase:"http://localhost:8888/api/dc",
	
    getAll:function (type, successCallback, errorCallback) {

		alert("getAll-type:"+type);

		var definition = App.getDefinition(type);
    	JSonUtil.read(definition.fileName, successCallback, errorCallback);
    	
    },

    getById:function (id, collection) {
		
    	alert("getById-id:"+id);

		for (var x=0; x < collection.length; x++) {
            var item = collection[x];
            if (item.id == id){
                return item;
            }
        }
        return null;
    },
    
    updateAll:function(){
        _.each(this.type, function (item) {

        	alert("updateAll-each-item:"+item);

        	this.update(item);
        }, this);    	
    },
    
    update:function(item){

    	alert("update-item:"+item);
    	
    	var setup = this.getSetup(item.code);
    	
    	JSonUtil.exists(item.fileName, 
			function(){
    			// If exists update from server
    			alert("update-exists-item:"+item);
    			this.updateFromServer(item);
			}, 
			function(){

    			alert("update-not-exists-item.fileName:"+item.fileName+"-setup:"+setup);
				// If not exist create file with setup values 
				JSonUtil.save(item.fileName, setup,	
					function(){

						alert("update-not-exists-saveFile");

						// If file was created we must try update from server
						this.updateFromServer(item);
						
					}, 
					function(){}
				);
			}, 
			function(){} 
		);
    },
    
    updateFromServer:function (definition) {

		alert("updateFromServer-definition:"+definition);

		var loadUrl = this.urlBase + definition.url;
        
		$.getJSON(loadUrl, function(result) {

			alert("updateFromServer-ok-result:"+result);

			var jsonString = JSON.stringify(result.data);
        	JSonUtil.save(definition.fileName, jsonString, function(){}, function(){} );
			
		  }).error(function(result) {
		  });

    },
    
    
};
