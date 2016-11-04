package com.bupt.termdemo.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.bupt.termdemo.model.User;
import com.bupt.termdemo.service.ILoginService;

@Controller
@RequestMapping("/loginCtl")
public class LoginController {

	@Autowired
	private ILoginService loginService;
	
	@RequestMapping("/login")
	public String login(User user, Model model, HttpServletRequest request){
		User loginuser = loginService.login(user);
		
		if (loginuser == null) {
			model.addAttribute("msg", "用户名或密码错误");
			return "forward:/login.jsp";
		} else {
			request.getSession().setAttribute("user", loginuser);
			request.getSession().setAttribute("userrole", loginuser.getUserrole());
			request.getSession().setAttribute("username", loginuser.getUsername());
		    return "redirect:/index.jsp";
		}
	}
	
	@RequestMapping("/logout")
	public String logout(HttpServletRequest request){
		request.getSession().invalidate();
		return "redirect:/login.jsp";
	}
	
}
