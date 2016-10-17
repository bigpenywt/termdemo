package com.bupt.termdemo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.bupt.termdemo.dao.IUserDao;
import com.bupt.termdemo.model.User;

@Controller
@RequestMapping("/loginCtl")
public class LoginController {

	@Autowired
	private IUserDao userDao;
	
	@RequestMapping("/login")
	public String login(User user){
		System.out.println(user.getUsername());
		System.out.println(user.getPassword());
		System.out.println(user.getPassword());
		
		User loginuser = userDao.login(user);
		System.out.println(loginuser.getUserrole());
		
		return "index";
	}
	
}
