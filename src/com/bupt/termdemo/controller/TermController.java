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

import com.bupt.termdemo.dao.ILogDao;
import com.bupt.termdemo.model.Log;
import com.bupt.termdemo.model.Term;
import com.bupt.termdemo.service.ILogService;
import com.bupt.termdemo.service.ITermService;

@Controller
@RequestMapping("/Term")
public class TermController {

	@Autowired
	private ITermService termService;
	
	@Autowired
	private ILogService logService;
	
	@RequestMapping("/GetCreateTerm")
	@ResponseBody
	public Map<String, Object> GetCreateTerm(HttpServletRequest request, @RequestParam Map<String, String> params){
		String status = params.get("status");
		int page = Integer.valueOf(params.get("page"));
		int rows = Integer.valueOf(params.get("rows"));
		String username = (String) request.getSession().getAttribute("username");
		
		Term term = new Term();
		term.setCreator(username);
		term.setStatus(status);
		
		Map<String, Object> resultmap = new HashMap<>();
		List<Term> terms = new ArrayList<>();
		int total = 0;
		try {
			terms = termService.GetCreateTerm(term, page, rows);
			total = termService.GetCreateTermCount(term);
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
		Log log = new Log();
		Map<String, Object> resultmap = new HashMap<>();
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//设置日期格式
		
		term.setCreator(request.getSession().getAttribute("username")+"");
		term.setCreate_time(df.format(new Date()));// new Date()为获取当前系统时间
		term.setStatus("0");
		
		int ifexist = 0;
		try {
			ifexist = termService.FindTerm(term);
			if(ifexist == 0){
				termService.SaveTerm(term);
				resultmap.put("status", "1");
				logService.WriteLog(request.getSession().getAttribute("username")+"", "创建", term.getTerm());
			}
			else{
				resultmap.put("status", "0");
				resultmap.put("msg", "单词已经存在");
			}
		} catch (Exception e) {
			resultmap.put("status", "0");
			resultmap.put("msg", e.getMessage());
		} finally {
			return resultmap;
		}
	}
}
