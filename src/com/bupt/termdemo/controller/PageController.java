package com.bupt.termdemo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller("pageController")
public class PageController {
	
	@RequestMapping("/page.do")
	public String viewpage(String module, String resource){
		return module+"/"+resource;
	}
}