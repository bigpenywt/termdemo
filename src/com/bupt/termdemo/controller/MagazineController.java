package com.bupt.termdemo.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
	public Map<String, Object> ListAll(@RequestParam Map<String, String> params){
		int page = Integer.valueOf(params.get("page"));
		int rows = Integer.valueOf(params.get("rows"));
		Map<String, Object> resultmap = new HashMap<>();
		List<Magazine> magazines = new ArrayList<>();
		int total = 0;
		try {
			magazines = magazineService.ListAll(page, rows);
			total = magazineService.CountAll();
			resultmap.put("status", "1");
			resultmap.put("total", total);
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
		int ifexist = 0;
		try {
			ifexist = magazineService.FindMagazine(magazine.getName());
			if(ifexist == 0){
				magazineService.AddMagazine(magazine);
				resultmap.put("status", "1");
			}
			else{
				resultmap.put("status", "0");
				resultmap.put("msg","添加失败，杂志已存在");
			}
		} catch (Exception e) {
			resultmap.put("status", "0");
			resultmap.put("msg","添加失败" + e.getMessage());
		} finally {
			return resultmap;
		}
	}
	
	@RequestMapping("/Delete")
	@ResponseBody
	public Map<String, Object> DeleteMagazine(@RequestParam String name){
		Map<String, Object> resultmap = new HashMap<>();
		try {
			magazineService.DeleteMagazine(name);
			resultmap.put("status", "1");
		} catch (Exception e) {
			resultmap.put("status", "0");
			resultmap.put("msg","删除失败" + e.getMessage());
		} finally {
			return resultmap;
		}
	}
	
}
