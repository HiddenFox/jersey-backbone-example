$(document).ready(function() { //注释一
	
	//定义User
	var User = Backbone.Model.extend({
	});
	
	//定义UserList，是User的集合
	var UserList = Backbone.Collection.extend({
		model : User,
		url : "/backbone-sample/rest/user", //注释二
		/*****重载fetch****
		fetch : function() {
			var self = this;
			$.ajax({
				url: self.url,
	            cache:false,
				type: 'GET',
				async: true,
				dataType: 'json',
				timeout: 300000,
				success: function( data, textStatus ) {							
					self.reset(data.user);
				},		
			});
		}
		*************/
	});
	
	//定义UserItemView，用来显示用户列表中的一个条目
	var UserItemView = Backbone.View.extend({
		tagName : "li",
		userItemTemplate : _.template($("#user-item-template").html()), //绑定模板
		render : function() {
			this.$el.html(this.userItemTemplate(this.model.toJSON()));
			return this;
		},
	});
	
	//定义UserListView，用来显示用户列表
	var UserListView = Backbone.View.extend({
		el : $("#main"),
		initialize : function() {
			this.userList = new UserList();
			this.userList.bind('reset', this.addAll, this);
			this.userList.bind('all', this.render, this); //注释三
			this.userList.fetch({silent: true, success:function(collection, response){ //注释四
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
	
	var userListView = new UserListView();//注释五
});