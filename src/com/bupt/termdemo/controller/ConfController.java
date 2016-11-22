package com.bupt.termdemo.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bupt.termdemo.service.IConfService;

@Controller("confController")
@RequestMapping("/Conf")
public class ConfController {

	@Autowired
	private IConfService confService;
	
	@RequestMapping("/getConf")
	@ResponseBody
	public Map<String, Object> getConf(){
		Map<String, Object> resultmap = new HashMap<>();
		String configuration = "";
		try {
			configuration = confService.getConf();
			resultmap.put("status", "1");
			resultmap.put("configuration", configuration);
		} catch (Exception e) {
			resultmap.put("status", "0");
			resultmap.put("msg", "获取个性化配置失败：" + e.getMessage());
		} finally {
			return resultmap;
		}
		
	}
	
	@RequestMapping("/setConf")
	@ResponseBody
	public Map<String, Object> setConf(@RequestParam String configuration){
		Map<String, Object> resultmap = new HashMap<>();
		try {
			confService.setConf(configuration);
			resultmap.put("status", "1");
		} catch (Exception e) {
			resultmap.put("status", "0");
			resultmap.put("msg", "修改个性化配置失败：" + e.getMessage());
		} finally {
			return resultmap;
		}
		
	}
	
}
