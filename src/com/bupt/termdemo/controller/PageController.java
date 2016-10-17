package com.bupt.termdemo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 页面跳转控制器
 */
@Controller("pageController")
public class PageController {
	/**
	 * 通用页面访问方法
	 * @return
	 */
	@RequestMapping("/page.do")
	public String viewpage(String module, String resource){
		//System.out.println("访问页面....");
		return module+"/"+resource;
	}
}