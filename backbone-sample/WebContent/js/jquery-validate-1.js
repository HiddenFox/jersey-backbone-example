$(document).ready(function(){

	//光标移动到username的input时触发，如果已经有错误/正确提示则不改变提示，如果没有提示输入
	$("input[name='username']").focus(function(){
		if ($("input[name='username']+span.error").size() == 0 
			&& $("input[name='username']+span.success").size() == 0) {
			$(this).after("<span class='hint'>Please enter your username.</span>");
		}
	});
	//光标移出username的input时触发
	$("input[name='username']").blur(function(){
		$("input[name='username']+span").remove(); //去掉之前的提示
		if($(this).val().length < 6 || $(this).val().length>12){ //判断长度，给出提示
			$(this).after("<span class='error'>Username contains 6-12 characters.</span>");
		}else{ //向服务器发出AJAX请求，判断username是否已经存在，给出提示
			$.ajax({
				url:"./rest/user/validate/"+$(this).val(),
				success:function(data, textStatus){
					if(data == "true"){
						$("input[name='username']").after("<span class='success'>Passed.</span>");
					}else{
						$("input[name='username']").after("<span class='error'>Username has been used.</span>");
					}
				}
			});
		}
	});

	$("input[name='password']").focus(function(){
		if ($("input[name='password']+span.error").size() == 0 
			&& $("input[name='password']+span.success").size() == 0) {
			$(this).after("<span class='hint'>Please enter password again.</span>");
		}
	});
	$("input[name='password']").blur(function(){
		$("input[name='password']+span").remove();
		if($(this).val().length < 6 || $(this).val().length>12){
			$(this).after("<span class='error'>Password contains 6-12 characters.</span>");
		}else{
			$(this).after("<span class='success'>Passed.</span>");
		}
	});


	$("input[name='re-password']").focus(function(){
		if ($("input[name='re-password']+span.error").size() == 0 
			&& $("input[name='re-password']+span.success").size() == 0 ) {
			$(this).after("<span class='hint'>Please enter your password again.</span>");
		}
	});
	$("input[name='re-password']").blur(function(){
		$("input[name='re-password']+span").remove();
		if($(this).val() ==""){
			$(this).after("<span class='error'>Please enter your password again.</span>");
		}else if($(this).val() != $("input[name='password']").val()){ //判断两次输入的password是否相同
			$(this).after("<span class='error'>Two passwords are not same.</span>");
		}else{
			$(this).after("<span class='success'>Passed.</span>");
		}
	});

	$("input[name='email']").focus(function(){
		if ($("input[name='email']+span.error").size() == 0 
			&& $("input[name='email']+span.success").size() == 0 ) {
			$(this).after("<span class='hint'>Please enter your email.</span>");
		}
	});
	$("input[name='email']").blur(function(){
		$("input[name='email']+span").remove();
		if(!$(this).val().match(/^\w{3,}@\w+(\.\w+)+$/)){ //正则表达式判断email格式是否正确
			$(this).after("<span class='error'>Invalid email format.</span>");
		}else{
			$(this).after("<span class='success'>Passed.</span>");
		}
	});

	//表单提交的时候触发所有input的blur事件，如果没有error才能提交表单
	$("form").submit(function(){
		$("input").blur();
		if ($("form span.error").size() > 0) {
			return false;
		}
	});

});