$(document).ready(function() { 
	
	var User = Backbone.Model.extend({
		validate : function(attrs) { //新增，验证属性是否合法
			if (attrs.username.length<6 || attrs.username.length>12) {
				return "Username contains 6-12 characters.";
			}
			var obj = $.ajax({
				url : "./rest/user/validate/" + attrs.username, 
				async : false,
			});
			if (obj.responseText == "false") {
				return "Username has been used.";
			}
			if (attrs.password.length<6 || attrs.password.length>12) {
				return "Password contains 6-12 characters.";
			}
			if (attrs.email.length == 0) {
				return "Please enter your email.";
			}
			if(!attrs.email.match(/^\w{3,}@\w+(\.\w+)+$/)){
				return "Invalid email format.";
			}
		},
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
			var m = this.model;
			this.model.save({ 
				"username":$("input[name='username']").val(),
				"password":$("input[name='password']").val(),
				"email":$("input[name='email']").val(),
				"phone":$("input[name='phone']").val(),
			},
			{
				error : function(m,error) {  //显示错误信息
					$(".error").html(error);
				},
				success : function() {
					$("#user-info").removeClass("editing"); 
				}
			});
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
		submitUserForm : function() {
			var user  = new User({
				"username":$("input[name='username']").val(),
				"password":$("input[name='password']").val(),
				"email":$("input[name='email']").val(),
				"phone":$("input[name='phone']").val(),
			});
			var m = this.model; //修改
			this.userList.create(user,{
				wait : true,
				error : function(m,error) { //显示错误信息
					$(".error").html(error);
				},
				success : function() {
					$("input[name='username']").val(""),
					$("input[name='password']").val(""),
					$("input[name='email']").val(""),
					$("input[name='phone']").val(""),
					alert("Add a user!");
				}
			});
		},
	});
	
	var userListView = new UserListView();
	var infoView; 
});