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
	
	private String role = "";
	
	@RequestMapping("/login")
	public String login(User user, Model model, HttpServletRequest request){
		User loginuser = loginService.login(user);
		
		if (loginuser == null) {
			model.addAttribute("msg", "用户名或密码错误");
			return "forward:/login.jsp";
		} else {
			request.getSession().setAttribute("user", loginuser);
			if(loginuser.getUserrole().equals("1")){
				role = "admin";
			}
			if(loginuser.getUserrole().equals("2")){
				role = "publisher";
			}
			if(loginuser.getUserrole().equals("3")){
				role = "reviewer";
			}
			if(loginuser.getUserrole().equals("4")){
				role = "creator";
			}
		    return "redirect:/loginCtl/jump";
		}
	}
	
	@RequestMapping("/jump")
	public String pagejump(){
		return "common/" + role + "_main";
	}
	
}
