<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>跳转页</title>
</head>
<body>
	<%if(request.getSession().getAttribute("userrole").equals("admin")){ %>
		<jsp:forward page="/page.do">
			<jsp:param value="common" name="module"/>
			<jsp:param value="admin_main" name="resource"/>
		</jsp:forward>
	<%}if(request.getSession().getAttribute("userrole").equals("publisher")){ %>
		<jsp:forward page="/page.do">
			<jsp:param value="common" name="module"/>
			<jsp:param value="publisher_main" name="resource"/>
		</jsp:forward>
	<%}if(request.getSession().getAttribute("userrole").equals("reviewer")){ %>
		<jsp:forward page="/page.do">
			<jsp:param value="common" name="module"/>
			<jsp:param value="reviewer_main" name="resource"/>
		</jsp:forward>
	<%}if(request.getSession().getAttribute("userrole").equals("creator")){ %>
		<jsp:forward page="/page.do">
			<jsp:param value="common" name="module"/>
			<jsp:param value="creator_main" name="resource"/>
		</jsp:forward>
	<%} %>

</body>
</html>