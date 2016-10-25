package com.bupt.termdemo.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bupt.termdemo.model.Term;
import com.bupt.termdemo.service.ITermService;

@Controller
@RequestMapping("/Term")
public class TermController {

	@Autowired
	private ITermService termService;
	
	@RequestMapping("/GetCreateTerm")
	@ResponseBody
	public Map<String, Object> GetCreateTerm(HttpServletRequest request, @RequestParam Map<String, String> params){
		String status = params.get("status");
		int page = Integer.valueOf(params.get("page"));
		int rows = Integer.valueOf(params.get("rows"));
		String username = (String) request.getSession().getAttribute("username");
		
		Map<String, Object> resultmap = new HashMap<>();
		List<Term> terms = new ArrayList<>();
		int total = 0;
		try {
			terms = termService.GetCreateTerm(username, status, page, rows);
			total = termService.GetCreateTermCount(username, status);
			resultmap.put("status", "1");
			resultmap.put("records", terms);
			resultmap.put("total", total);
		} catch (Exception e) {
			resultmap.put("status", "0");
			resultmap.put("msg", e.getMessage());
		} finally {
			return resultmap;
		}
	}
	
	@RequestMapping("/SaveTerm")
	@ResponseBody
	public Map<String, Object> SaveTerm(HttpServletRequest request, Term term){
		Map<String, Object> resultmap = new HashMap<>();
		term.setCreator(request.getSession().getAttribute("username")+"");
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//设置日期格式
		term.setCreate_time(df.format(new Date()));// new Date()为获取当前系统时间
		term.setStatus("0");
		try {
			termService.SaveTerm(term);
			resultmap.put("status", "1");
		} catch (Exception e) {
			resultmap.put("status", "0");
			resultmap.put("msg", e.getMessage());
		} finally {
			return resultmap;
		}
	}
}
