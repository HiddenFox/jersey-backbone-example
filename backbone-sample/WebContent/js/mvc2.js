$(document).ready(function() { 
	
	var User = Backbone.Model.extend({
	});
	
	var UserList = Backbone.Collection.extend({
		model : User,
		url : "/backbone-sample/rest/user", 
	});
	
	var UserItemView = Backbone.View.extend({
		tagName : "li",
		userItemTemplate : _.template($("#user-item-template").html()), 
		events : { //注释一
		      "click a" : "displayInfo", //新增
		},
		initialize : function() { 
			this.infoView = new UserInfoView({model : this.model}); //新增
		},
		render : function() {
			this.$el.html(this.userItemTemplate(this.model.toJSON()));
			return this;
		},
		displayInfo : function() { //新增
			this.infoView.render();
		},
	});
	
	//新增UserInfoView，用来显示User详细信息
	var UserInfoView = Backbone.View.extend({
		el : $("#right"),
		userInfoTemplate : _.template($("#user-info-template").html()),
		render : function(){
			this.$el.html(this.userInfoTemplate(this.model.toJSON()));
			return this;
		},
	});
	
	var UserListView = Backbone.View.extend({
		el : $("#main"),
		initialize : function() {
			this.userList = new UserList();
			this.userList.bind('reset', this.addAll, this);
			this.userList.bind('all', this.render, this); 
			this.userList.fetch({silent: true, success:function(collection, response){ 
				if(response != null){
					collection.reset(response.user);
				}else{
					userListView.render();
				}
			}});
		},
		render : function() {
			this.$("#left h3").html("Total Number:"+this.userList.length);
		},
		addOne : function(user) {
			var view = new UserItemView({model : user});
			this.$("#user-list").append(view.render().el);
		},
		addAll : function() { 
			this.userList.each(this.addOne);
		},
	});
	
	var userListView = new UserListView();
});