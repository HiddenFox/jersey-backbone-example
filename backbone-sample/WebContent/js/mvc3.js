$(document).ready(function() { 
	
	var User = Backbone.Model.extend({
		/*****如果将id改成uid，需要重载下面两个方法*****
		url: function() {
		    var base = this.collection.url ;
		    if (this.isNew()) return base;
		    return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + encodeURIComponent(this.uid);
	    },
	    isNew: function() {
	        return this.attributes.uid == null;
        },
        *********************************************/
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
			//this.infoView = new UserInfoView({model : this.model}); //删除
			this.model.bind('change', this.render, this);  //新增，修改成功后会触发
		},
		render : function() {
			this.$el.html(this.userItemTemplate(this.model.toJSON()));
			return this;
		},
		/*displayInfo : function() { 
			this.infoView.render();
		},*/
		displayInfo : function() { //修改，注释一
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
			"click #edit" : "displayEdit", //新增
			"click #edit-submit" : "submitEdit", //新增
		},
		initialize : function() {
			this.model.bind('change', this.render, this); //新增
		},
		render : function(){
			this.$el.html(this.userInfoTemplate(this.model.toJSON()));
			return this;
		},
		displayEdit : function() { //新增，改变 class，显示表单
			this.$("#user-info").addClass("editing");
		},
		submitEdit : function() { //新增，提交表单
			this.model.save({ //注释二
				"username":$("input[name='username']").val(),
				"password":$("input[name='password']").val(),
				"email":$("input[name='email']").val(),
				"phone":$("input[name='phone']").val(),
			});
			this.$("#user-info").removeClass("editing"); //改变 class，隐藏表单
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
	var infoView;  //新增
});