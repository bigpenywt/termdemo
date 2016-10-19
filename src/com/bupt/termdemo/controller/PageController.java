package com.bupt.termdemo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller("pageContrller")
public class PageController {

	@RequestMapping("/page.do")
	public String page(String module, String resource){
		return module + "/" + resource;
	}
	
}
