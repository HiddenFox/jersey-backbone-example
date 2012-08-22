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
		events : { 
		      "click a" : "displayInfo",
		},
		initialize : function() { 
			this.model.bind('change', this.render, this);  
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
		},
		render : function(){
			this.$el.html(this.userInfoTemplate(this.model.toJSON()));
			return this;
		},
		displayEdit : function() { 
			this.$("#user-info").addClass("editing");
		},
		submitEdit : function() { 
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
		userFormTemplate : _.template($("#user-form-template").html()), //新增，绑定模板
		events : {
		      "click #add" : "displayUserForm", //新增
		      "click #add-submit" : "submitUserForm", //新增
		},
		initialize : function() {
			this.userList = new UserList();
			this.userList.bind('add', this.addOne, this); //新增，每当userList中加一个User时，列表中会加一个条目
			this.userList.bind('reset', this.addAll, this);
			this.userList.bind('all', this.render, this); 
			this.userList.fetch({silent: true, success:function(collection, response){ 
				if(response != null){
					collection.reset(response.user);
				}else{
					userListView.render();
				}
			}});
			this.displayUserForm(); //新增，加载页面的时候默认显示增加User的表单
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
		displayUserForm : function() { //新增，显示增加用户的表单
			this.$("#right").html(this.userFormTemplate());
		},
		submitUserForm : function() { //新增，提交增加用户的表单
			var user  = new User({
				"username":$("input[name='username']").val(),
				"password":$("input[name='password']").val(),
				"email":$("input[name='email']").val(),
				"phone":$("input[name='phone']").val(),
			});

			/**** 注释一 报错：id is not defined *****
			this.userList.create(user);
			$("input[name='username']").val(""),
			$("input[name='password']").val(""),
			$("input[name='email']").val(""),
			$("input[name='phone']").val(""),
			alert("Add a user!");
			*****************************************/
			
			/************** 注释二 正确 *************
			this.userList.create(user,{wait:true});
			$("input[name='username']").val(""),
			$("input[name='password']").val(""),
			$("input[name='email']").val(""),
			$("input[name='phone']").val(""),
			alert("Add a user!");
			****************************************/
			
			/**** 注释三 报错：A "url" property or function must be specified ****
			user.save({success : function(){
				$("input[name='username']").val(""),
				$("input[name='password']").val(""),
				$("input[name='email']").val(""),
				$("input[name='phone']").val(""),
				this.userList.add(user);
				alert("Add a user!");
			}});
			**********************************************************************/
			
			/************** 注释四 正确 *************/
			var ul = this.userList;
			user.urlRoot = "/backbone-sample/rest/user";
			user.save({},{success : function(){
				$("input[name='username']").val(""),
				$("input[name='password']").val(""),
				$("input[name='email']").val(""),
				$("input[name='phone']").val(""),
				ul.add(user);
				alert("Add a user!");
			}});
			/*****************************************/
		},
	});
	
	var userListView = new UserListView();
	var infoView; 
});