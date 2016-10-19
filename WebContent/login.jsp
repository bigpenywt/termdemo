<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page isELIgnored="false"%>
<!DOCTYPE HTML>
<html>
<head>
	<meta charset="utf-8">
  <link rel="stylesheet" href="./public/css/page/login.css">
<title>登录页</title>
</head>
<body>
	<form action="/termdemo/loginCtl/login">
    <div class="login-block">
      <p class="login-title">登陆到术语库</p>
      <p class="login-tips">用户名</p>
  		<input type="text" class="user-name" placeholder="请输入您的用户名" name="username"/>
      <p class="login-tips">密码</p>
  		<input type="password" placeholder="请输入您的密码" name="password"/>
  		<button class="submit-btn" type="submit">登录</button>
    </div>
	</form>
	${msg }

</body>
</html>
