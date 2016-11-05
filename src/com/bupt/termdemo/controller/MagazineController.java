package com.bupt.termdemo.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bupt.termdemo.model.Magazine;
import com.bupt.termdemo.service.IMagazineService;

@Controller
@RequestMapping("/Magazine")
public class MagazineController {

	@Autowired
	private IMagazineService magazineService;
	
	@RequestMapping("/ListAll")
	@ResponseBody
	public Map<String, Object> ListAll(){
		
		Map<String, Object> resultmap = new HashMap<>();
		List<Magazine> magazines = new ArrayList<>();
		try {
			magazines = magazineService.ListAll();
			resultmap.put("status", "1");
			resultmap.put("magazines", magazines);
		} catch (Exception e) {
			resultmap.put("status", "0");
			resultmap.put("msg", e.getMessage());
		} finally {
			return resultmap;
		}
	}
	
	@RequestMapping("/AddMagazine")
	@ResponseBody
	public Map<String, Object> AddMagazine(Magazine magazine){
		Map<String, Object> resultmap = new HashMap<>();
		try {
			magazineService.AddMagazine(magazine);
			resultmap.put("status", "1");
		} catch (Exception e) {
			resultmap.put("status", "0");
			resultmap.put("msg","添加失败" + e.getMessage());
		} finally {
			return resultmap;
		}
	}
	
}
