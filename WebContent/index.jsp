<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <link rel="stylesheet" href="./public/css/base.min.css">
<title>Insert title here</title>
</head>
<body>
	<jsp:forward page="/page.do">
		<jsp:param value="common" name="module"/>
		<jsp:param value="admin_main" name="resource"/>
	</jsp:forward>

	<%-- 根据角色不同进入不同页面
		<c:if test="${userrole == 1}">
			<jsp:param value="common" name="module"/>
			<jsp:param value="admin_main" name="resource"/>
		</c:if>
		<c:if test="${userrole == 2 }">
			<jsp:param value="common" name="module"/>
			<jsp:param value="reviewer_main" name="resource"/>
		</c:if>
		<c:if test="${userrole == 3 }">
			<jsp:param value="common" name="module"/>
			<jsp:param value="creator_main" name="resource"/>
		</c:if> --%>
</body>
</html>
