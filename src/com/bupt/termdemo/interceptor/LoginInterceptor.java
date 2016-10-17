package com.bupt.termdemo.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

/**
 * ��½ ����������
 *
 */
public class LoginInterceptor extends HandlerInterceptorAdapter{
	
	// ����ҳ�涼ʹ�� PageController���ʣ�ֻ��Ҫ���� page.do
	@Override
	public boolean preHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler) throws Exception {
		// ����û�û�е�½ ����false
		if(request.getSession().getAttribute("user")==null){
			// ��ת����½ҳ��
			response.sendRedirect(request.getContextPath() + "/login.jsp"); 
			// û�е�½
			return false;
		}
		return true;
	}
}