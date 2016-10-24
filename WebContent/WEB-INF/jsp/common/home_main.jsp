<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>首页</title>
</head>
<body>
  <div id="index"></div>
  <input type="hidden" value="${userrole}"/>
	<script src="<%=request.getContextPath()%>/public/js/index.bundle.js"></script>
</body>
</html>
