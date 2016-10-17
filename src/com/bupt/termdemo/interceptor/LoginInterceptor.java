package com.bupt.termdemo.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

/**
 * 登陆 控制拦截器
 *
 */
public class LoginInterceptor extends HandlerInterceptorAdapter{
	
	// 所有页面都使用 PageController访问，只需要拦截 page.do
	@Override
	public boolean preHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler) throws Exception {
		// 如果用户没有登陆 返回false
		if(request.getSession().getAttribute("user")==null){
			// 跳转到登陆页面
			response.sendRedirect(request.getContextPath() + "/login.jsp"); 
			// 没有登陆
			return false;
		}
		return true;
	}
}