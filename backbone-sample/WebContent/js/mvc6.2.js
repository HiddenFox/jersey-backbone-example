$(document).ready(function() { 
	
	var User = Backbone.Model.extend({
		validate : function(attrs) { //新增
			$("input").blur();
			if ($("span.error").size() > 0) {
				return "hahaha"; //随便返回什么，触发error事件就能阻止sync的发生了
			}
		}
	});
	
	var UserList = Backbone.Collection.extend({
		model : User,
		url : "/backbone-sample/rest/user", 
	});
	
	var UserItemView = Backbone.View.extend({
		tagName : "li",
		userItemTemplate : _.template($("#user-item-template").html()), 
		events : { 
		      "click a" : "displayInfo",
		      "click #delete-submit" : "clear", 
		},
		initialize : function() { 
			this.model.bind('change', this.render, this);  
			this.model.bind('destroy', this.remove, this); 
		},
		render : function() {
			this.$el.html(this.userItemTemplate(this.model.toJSON()));
			return this;
		},
		displayInfo : function() { 
			if(_.isEmpty(infoView)){
				infoView = new UserInfoView({model : this.model});
			}else{
				infoView.model = this.model;
				infoView.model.unbind('change');
				infoView.model.bind('change', this.render, this);
				infoView.model.bind('change', infoView.render, infoView);
			}
			infoView.render();
		},
		clear : function(){ 
			this.model.destroy();
		},
	});
	
	var UserInfoView = Backbone.View.extend({
		el : $("#right"),
		userInfoTemplate : _.template($("#user-info-template").html()),
		events : {
			"click #edit" : "displayEdit", 
			"click #edit-submit" : "submitEdit", 
		},
		initialize : function() {
			this.model.bind('change', this.render, this); 
			this.model.bind('destroy', this.remove, this); 
		},
		render : function(){
			this.$el.html(this.userInfoTemplate(this.model.toJSON()));
			return this;
		},
		displayEdit : function() { 
			this.$("#user-info").addClass("editing");
		},
		submitEdit : function() { //修改
//			$("input").blur();
//			if ($("span.error").size() > 0) {
//				return;
//			}
			this.model.save({ 
				"username":$("input[name='username']").val(),
				"password":$("input[name='password']").val(),
				"email":$("input[name='email']").val(),
				"phone":$("input[name='phone']").val(),
			});
			this.$("#user-info").removeClass("editing"); 
		},
	});
	
	var UserListView = Backbone.View.extend({
		el : $("#main"),
		userFormTemplate : _.template($("#user-form-template").html()), 
		events : {
		      "click #add" : "displayUserForm", 
		      "click #add-submit" : "submitUserForm", 
		},
		initialize : function() {
			this.userList = new UserList();
			this.userList.bind('add', this.addOne, this); 
			this.userList.bind('reset', this.addAll, this);
			this.userList.bind('all', this.render, this); 
			this.userList.fetch({silent: true, success:function(collection, response){ 
				if(response != null){
					collection.reset(response.user);
				}else{
					userListView.render();
				}
			}});
			this.displayUserForm(); 
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
		displayUserForm : function() {
			this.$("#right").html(this.userFormTemplate());
		},
		submitUserForm : function() { //修改
//			$("input").blur();
//			if ($("span.error").size() > 0) {
//				return;
//			}
			var user  = new User({
				"username":$("input[name='username']").val(),
				"password":$("input[name='password']").val(),
				"email":$("input[name='email']").val(),
				"phone":$("input[name='phone']").val(),
			});

			this.userList.create(user,{
				wait:true,
				success : function(){
					$("input[name='username']").val(""),
					$("input[name='password']").val(""),
					$("input[name='email']").val(""),
					$("input[name='phone']").val(""),
					alert("Add a user!");
				},
			});
		},
	});
	
	var userListView = new UserListView();
	var infoView; 
});