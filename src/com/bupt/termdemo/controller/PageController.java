package com.bupt.termdemo.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller("pageContrller")
public class PageController {

	@RequestMapping("/page.do")
	public String page(String module, String resource, Model model, HttpServletRequest request){
		model.addAttribute("userrole", request.getSession().getAttribute("userrole"));
		return module + "/" + resource;
	}
	
}
