package com.bupt.termdemo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * ҳ����ת������
 */
@Controller("pageController")
public class PageController {
	/**
	 * ͨ��ҳ����ʷ���
	 * @return
	 */
	@RequestMapping("/page.do")
	public String viewpage(String module, String resource){
		//System.out.println("����ҳ��....");
		return module+"/"+resource;
	}
}