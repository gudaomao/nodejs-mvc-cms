
// Libs.
var tmpl = require('jqtpl'),
		ser = require('../lib/service'),
		c = require('../../config'),
		Mongolian = require("mongolian");

// Db.
var server = new Mongolian(c.config.dbConnection),
		db = server.db(c.config.dbName);
		
if(c.config.dbConnection !== 'localhost'){
	db.auth(c.config.dbUserName, c.config.dbPassword);
}

var pages = db.collection("pages"),
		zonesDb = db.collection("zones");

// Shared vars.
var zones = [];

var helpers = {
	htmlString: function(html){
	
		try {
			
			// Search zones.
			for(var i in zones) {
				html = html.replace('{zone:' + zones[i].key + '}', zones[i].content);
			}

		return html;
		} catch (ex){
			return ex;
		}
	}
};

// HTTP content getter.
exports.get = function(params, view, callBack){

	var pageUrl = params.p1;
	if(pageUrl === ''){
		pageUrl = 'index';
	}
	
	// Get zone list.
	zonesDb.find().limit(50).toArray(function (err, zonesList) {
  	
  	// Zone list.
  	zones = zonesList;
		
		// Array to obj conversion.  	
  	var zone = {};
		for(var i in zones) {
			zone[zones[i].key] = zones[i].content;
		}
			
		// Page.
		pages.findOne({url: pageUrl}, function(err, obj) {
			
			if(obj){
			
				var content = tmpl.tmpl(view, {
					page: obj, 
					zone: zone
					}, helpers);
					
				callBack(content);
			} else {
				
				// 404.
				callBack('404 Page not found!');
			}
			
		});
	});

	/*
	ser.get('pages/detail', {url: pageUrl}, function(page){
		
		ser.get('zone/list', {}, function(zoneList){
		
			zones = zoneList.zone;
		
			// Merge model with template.
			var content = tmpl.tmpl(view, {page: page.page}, helpers);
			
			// Spit content.
			callBack(content);
		});
	});
	
	} else if(pageUrl === 'xxx'){
	
		// Get data through service layer.
		ser.get('hypoteky/list', {}, function(hypoteky){
		
			// Merge model with template.
			var content = tmpl.tmpl(view, hypoteky);
			
			// Spit content.
			callBack(content);
		});
	
	} else {
	
		//hypoteka-ceske-sporitelny
	
		// Get data through service layer.
		ser.get('hypoteky/detail', {pageUrl: pageUrl}, function(hypoteka){
			
			console.log(hypoteka);
			
			// Merge model with template.
			var content = tmpl.tmpl(view, hypoteka);
			
			// Spit content.
			callBack(content);
		});
	}
	*/
};