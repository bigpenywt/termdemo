<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <link rel="stylesheet" href="./public/css/page/login.css">
<title>Insert title here</title>
</head>
<body>
	<form action="/termdemo/loginCtl/login">
    <div class="login-block">
      <p class="login-title">登陆到术语库</p>
      <p class="login-tips">用户名</p>
  		<input type="text" placeholder="请输入您的用户名" name="username"/>
      <p class="login-tips">密码</p>
  		<input type="password" placeholder="请输入您的密码" name="password"/>
  		<button class="submit-btn" type="submit">登录</button>
    </div>
	</form>
	${msg }

</body>
</html>
