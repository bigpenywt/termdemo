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
		Map<String, Object> resultmap = new HashMap<>();
		String username = request.getSession().getAttribute("username") + "";
		
		int ifexist = 0;
		try {
			ifexist = termService.FindTerm(term);
			if(ifexist == 0){
				termService.SaveTerm(term, username);
				resultmap.put("status", "1");
				logService.WriteLog(username, "创建", term.getTerm());
			}
			else{
				resultmap.put("status", "0");
				resultmap.put("msg", "单词已经存在");
			}
		} catch (Exception e) {
			resultmap.put("status", "0");
			resultmap.put("msg", "系统异常，请重新创建！"+ e.getMessage());
		} finally {
			return resultmap;
		}
	}
	
	@RequestMapping("/DeleteTerm")
	@ResponseBody
	public Map<String, Object> DeleteTerm(HttpServletRequest request, @RequestParam String term){
		Map<String, Object> resultmap = new HashMap<>();
		
		try {
			termService.DeleteTerm(term);
			logService.WriteLog(request.getSession().getAttribute("username")+"", "删除", term);
			resultmap.put("status", "1");
		} catch (Exception e) {
			resultmap.put("status", "0");
			resultmap.put("msg", "系统异常，删除失败！"+ e.getMessage());
		} finally {
			return resultmap;
		}
	}
	
	@RequestMapping("/ModifyTerm")
	@ResponseBody
	public Map<String, Object> ModifyTerm(HttpServletRequest request, Term term){
		Map<String, Object> resultmap = new HashMap<>();
		String username = request.getSession().getAttribute("username") + "";
	
		term.setStatus("0");//对于修改已驳回的单词，应该将以下几项设为空，并将状态改为待校验
		term.setReviewer("");
		term.setReview_time("");
		term.setReject_user("");
		term.setReject_time("");
		term.setReject_reason("");
		
		try {
			termService.ModifyTerm(term);
			logService.WriteLog(username, "重新编辑", term.getTerm());
			resultmap.put("status", "1");
		} catch (Exception e) {
			resultmap.put("status", "0");
			System.out.println(e.getMessage());
			resultmap.put("msg", "系统异常，修改失败！"+ e.getMessage());
		} finally {
			return resultmap;
		}
	}
	
	@RequestMapping("/GetTermByStatus")
	@ResponseBody
	public Map<String, Object> GetTermByStatus(@RequestParam Map<String, String> params){
		String status = params.get("status");
		int page = Integer.valueOf(params.get("page"));
		int rows = Integer.valueOf(params.get("rows"));
		
		Map<String, Object> resultmap = new HashMap<>();
		List<Term> terms = new ArrayList<>();
		int total = 0;
		try {
			terms = termService.GetTermByStatus(status, page, rows);
			total = termService.GetTermByStatusCount(status);
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
	
	@RequestMapping("/GetRejectedTerm")
	@ResponseBody
	public Map<String, Object> GetRejectedTerm(HttpServletRequest request, @RequestParam Map<String, String> params){
		int page = Integer.valueOf(params.get("page"));
		int rows = Integer.valueOf(params.get("rows"));
		String username = request.getSession().getAttribute("username") + "";
		
		Map<String, Object> resultmap = new HashMap<>();
		List<Term> terms = new ArrayList<>();
		int total = 0;
		try {
			terms = termService.GetRejectedTerm(username, page, rows);
			total = termService.GetRejectedTermCount(username);
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
	
	@RequestMapping("/RejectTerm")
	@ResponseBody
	public Map<String, Object> RejectTerm(HttpServletRequest request, @RequestParam Map<String, String> params){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Term term = new Term();
		term.setTerm(params.get("term"));
		term.setReject_reason(params.get("reason"));
		term.setReject_time(df.format(new Date()));
		String username = request.getSession().getAttribute("username") + "";
		term.setReject_user(username);
		
		Map<String, Object> resultmap = new HashMap<>();
		try {
			termService.RejectTerm(term);
			logService.WriteLog(username, "驳回", term.getTerm());
			resultmap.put("status", "1");
		} catch (Exception e) {
			resultmap.put("status", "0");
			resultmap.put("msg", e.getMessage());
		} finally {
			return resultmap;
		}
	}
	
	@RequestMapping("/ReviewTerm")
	@ResponseBody
	public Map<String, Object> ReviewTerm(HttpServletRequest request, @RequestParam String term){
		Term reviewterm = new Term();
		reviewterm.setTerm(term);
		String username = request.getSession().getAttribute("username") + "";
		reviewterm.setReviewer(username);
		
		Map<String, Object> resultmap = new HashMap<>();
		try {
			termService.ReviewTerm(reviewterm);
			logService.WriteLog(username, "审核通过", term);
			resultmap.put("status", "1");
		} catch (Exception e) {
			resultmap.put("status", "0");
			resultmap.put("msg", e.getMessage());
		} finally {
			return resultmap;
		}
	}
	
	@RequestMapping("/PublishTerm")
	@ResponseBody
	public Map<String, Object> PublishTerm(HttpServletRequest request, @RequestParam String term){
		Term publishterm = new Term();
		publishterm.setTerm(term);
		String username = request.getSession().getAttribute("username") + "";
		publishterm.setPublisher(username);
		
		Map<String, Object> resultmap = new HashMap<>();
		try {
			termService.PublishTerm(publishterm);
			logService.WriteLog(username, "发布", term);
			resultmap.put("status", "1");
		} catch (Exception e) {
			resultmap.put("status", "0");
			resultmap.put("msg", e.getMessage());
		} finally {
			return resultmap;
		}
	}
	
	@RequestMapping("/ModifyDoneTerm")
	@ResponseBody
	public Map<String, Object> ModifyDoneTerm(HttpServletRequest request, Term term){
		Map<String, Object> resultmap = new HashMap<>();
		String username = request.getSession().getAttribute("username") + "";
		
		try {
			termService.ModifyTerm(term);
			logService.WriteLog(username, "修改入库单词", term.getTerm());
			resultmap.put("status", "1");
		} catch (Exception e) {
			resultmap.put("status", "0");
			System.out.println(e.getMessage());
			resultmap.put("msg", "系统异常，修改失败！"+ e.getMessage());
		} finally {
			return resultmap;
		}
	}
	
	@RequestMapping("/DeleteDoneTerm")
	@ResponseBody
	public Map<String, Object> DeleteDoneTerm(HttpServletRequest request, Term term){
		Map<String, Object> resultmap = new HashMap<>();
		String username = request.getSession().getAttribute("username") + "";
		term.setDelete_user(username);
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		term.setDelete_time(df.format(new Date()));
		term.setStatus("4");
		
		try {
			termService.ModifyTerm(term);
			logService.WriteLog(username, "删除已入库单词", term.getTerm());
			resultmap.put("status", "1");
		} catch (Exception e) {
			resultmap.put("status", "0");
			System.out.println(e.getMessage());
			resultmap.put("msg", "系统异常，删除失败！"+ e.getMessage());
		} finally {
			return resultmap;
		}
	}
	
	@RequestMapping("/GetTotal")
	@ResponseBody
	public Map<String, Object> GetTotal(HttpServletRequest request, Term term){
		Map<String, Object> resultmap = new HashMap<>();
		
		try {
			int tbReview = termService.GetTermByStatusCount("0");
			int tbPublish = termService.GetTermByStatusCount("1");
			int tbModify = termService.GetTermByStatusCount("2");
			int done = termService.GetTermByStatusCount("3");
			int deleted = termService.GetTermByStatusCount("4");
			resultmap.put("tbReview", tbReview);
			resultmap.put("tbPublish", tbPublish);
			resultmap.put("tbModify", tbModify);
			resultmap.put("done", done);
			resultmap.put("deleted", deleted);
			
			resultmap.put("status", "1");
		} catch (Exception e) {
			resultmap.put("status", "0");
			System.out.println(e.getMessage());
			resultmap.put("msg", "系统异常，获取数据失败！"+ e.getMessage());
		} finally {
			return resultmap;
		}
	}
	
	@RequestMapping("/GettbReviewTerm")
	@ResponseBody
	public Map<String, Object> GettbReviewTerm(HttpServletRequest request, @RequestParam Map<String, String> params){
		int page = Integer.valueOf(params.get("page"));
		int rows = Integer.valueOf(params.get("rows"));
		String username = request.getSession().getAttribute("username") + "";
		
		Map<String, Object> resultmap = new HashMap<>();
		List<Term> terms = new ArrayList<>();
		int total = 0;
		try {
			terms = termService.GettbReviewTerm(username, page, rows);
			total = termService.GettbReviewTermCount(username);
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
}
