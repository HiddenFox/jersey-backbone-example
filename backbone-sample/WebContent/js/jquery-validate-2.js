$(document).ready(function(){

	$("#right").delegate("input[name='username']","focus",function(){
		if ($("input[name='username']+span.error").size() == 0 
			&& $("input[name='username']+span.success").size() == 0) {
			$(this).after("<span class='hint'>Please enter your username.</span>");
		}
	});
	$("#right").delegate("input[name='username']","blur",function(){
		$("input[name='username']+span").remove(); 
		if($(this).val().length < 6 || $(this).val().length>12){ 
			$(this).after("<span class='error'>Username contains 6-12 characters.</span>");
		}else{
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

	$("#right").delegate("input[name='password']","focus",function(){
		if ($("input[name='password']+span.error").size() == 0 
			&& $("input[name='password']+span.success").size() == 0) {
			$(this).after("<span class='hint'>Please enter password again.</span>");
		}
	});
	$("#right").delegate("input[name='password']","blur",function(){
		$("input[name='password']+span").remove();
		if($(this).val().length < 6 || $(this).val().length>12){
			$(this).after("<span class='error'>Password contains 6-12 characters.</span>");
		}else{
			$(this).after("<span class='success'>Passed.</span>");
		}
	});


	$("#right").delegate("input[name='re-password']","focus",function(){
		if ($("input[name='re-password']+span.error").size() == 0 
			&& $("input[name='re-password']+span.success").size() == 0 ) {
			$(this).after("<span class='hint'>Please enter your password again.</span>");
		}
	});
	$("#right").delegate("input[name='re-password']","blur",function(){
		$("input[name='re-password']+span").remove();
		if($(this).val() ==""){
			$(this).after("<span class='error'>Please enter your password again.</span>");
		}else if($(this).val() != $("input[name='password']").val()){ 
			$(this).after("<span class='error'>Two passwords are not same.</span>");
		}else{
			$(this).after("<span class='success'>Passed.</span>");
		}
	});

	$("#right").delegate("input[name='email']","focus",function(){
		if ($("input[name='email']+span.error").size() == 0 
			&& $("input[name='email']+span.success").size() == 0 ) {
			$(this).after("<span class='hint'>Please enter your email.</span>");
		}
	});
	$("#right").delegate("input[name='email']","blur",function(){
		$("input[name='email']+span").remove();
		if(!$(this).val().match(/^\w{3,}@\w+(\.\w+)+$/)){ 
			$(this).after("<span class='error'>Invalid email format.</span>");
		}else{
			$(this).after("<span class='success'>Passed.</span>");
		}
	});

});