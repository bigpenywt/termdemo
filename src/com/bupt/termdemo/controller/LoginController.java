package com.bupt.termdemo.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.bupt.termdemo.dao.IUserDao;
import com.bupt.termdemo.model.User;

@Controller
@RequestMapping("/loginCtl")
public class LoginController {

	@Autowired
	private IUserDao userDao;
	
	@RequestMapping("/login")
	public String login(User user, Model model, HttpServletRequest request){
		System.out.println(user.getUsername());
		System.out.println(user.getPassword());

		System.out.println();
		
		User loginuser = userDao.login(user);
		
		if (loginuser == null) {
			model.addAttribute("msg", "用户名或者密码错误");
			return "forward:/login.jsp";
		} else {
			request.getSession().setAttribute("user", loginuser);
			request.getSession().setAttribute("userrole", loginuser.getUserrole());
		    return "redirect:/index.jsp";
		}
	}
	
}
