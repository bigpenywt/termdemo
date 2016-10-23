package com.bupt.termdemo.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bupt.termdemo.model.Term;
import com.bupt.termdemo.model.User;
import com.bupt.termdemo.service.ITermService;

@Controller
@RequestMapping("/Term")
public class TermController {

	@Autowired
	private ITermService termService;
	
	@RequestMapping("/QueryTermByUserAndStatus")
	@ResponseBody
	public Map<String, Object> QueryTermByUserAndStatus(HttpServletRequest request){
		Map<String, Object> resultmap = new HashMap<>();
		List<Term> terms = new ArrayList<>();
		int total = 0;
		User user = new User();
		user.setUsername(request.getSession().getAttribute("username").toString());
		user.setUserrole(request.getSession().getAttribute("userrole").toString());
		try {
			terms = termService.QueryTermByUserAndStatus(user, "1", 0, 10);
			total = termService.GetTermCountByUserAndStatus(user, "1");
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
	
	
	@RequestMapping("/GetCreatorTermCount")
	@ResponseBody
	public Map<String, Object> GetTermCountByUserAndStatus(HttpServletRequest request){
		Map<String, Object> resultmap = new HashMap<>();
		User user = new User();
		user.setUsername(request.getSession().getAttribute("username").toString());
		user.setUserrole(request.getSession().getAttribute("userrole").toString());		
		int tbReview = 0;
		int tbModify = 0;
		int tbPublish = 0;
		int done = 0;
		try {
			tbReview = termService.GetTermCountByUserAndStatus(user, "0");
			tbPublish = termService.GetTermCountByUserAndStatus(user, "1");
			tbModify = termService.GetTermCountByUserAndStatus(user, "2");
			done = termService.GetTermCountByUserAndStatus(user, "3");
			resultmap.put("status", "1");
			resultmap.put("tbReview", tbReview);
			resultmap.put("tbPublish", tbPublish);
			resultmap.put("tbModify", tbModify);
			resultmap.put("done", done);
		} catch (Exception e) {
			resultmap.put("status", "0");
			resultmap.put("msg", e.getMessage());
		} finally {
			return resultmap;
		}
	}
}
