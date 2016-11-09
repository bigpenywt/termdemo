package com.bupt.termdemo.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bupt.termdemo.model.User;
import com.bupt.termdemo.service.IUserService;

@Controller
@RequestMapping("/User")
public class UserController {
	
	@Autowired
	private IUserService userService;
	
	@RequestMapping("/GetUserInfo")
	@ResponseBody
	public Map<String, Object> GetUserInfo(HttpServletRequest request){
		String username = (String) request.getSession().getAttribute("username");
		
		Map<String, Object> resultmap = new HashMap<>();
		User user = new User();
		try {
			user = userService.GetUserInfo(username);
			resultmap.put("status", "1");
			resultmap.put("userinfo", user);
		} catch (Exception e) {
			resultmap.put("status", "0");
			resultmap.put("msg","获取用户信息失败" + e.getMessage());
		} finally {
			return resultmap;
		}
	}
	
	@RequestMapping("/ModifyUserInfo")
	@ResponseBody
	public Map<String, Object> ModifyUserInfo(HttpServletRequest request, User user){
		Map<String, Object> resultmap = new HashMap<>();
		try {
			userService.ModifyUserInfo(user);
			resultmap.put("status", "1");
		} catch (Exception e) {
			resultmap.put("status", "0");
			resultmap.put("msg", "修改失败" + e.getMessage());
		} finally {
			return resultmap;
		}
	}
	
	@RequestMapping("/AddUser")
	@ResponseBody
	public Map<String, Object> AddUser(User user){
		Map<String, Object> resultmap = new HashMap<>();
		int ifexist = 0;
		try {
			ifexist = userService.FindUser(user.getUsername());
			if(ifexist == 0){
				userService.AddUser(user);
				resultmap.put("status", "1");
			}
			else{
				resultmap.put("status", "0");
				resultmap.put("msg", "创建失败" + "用户名已存在");
			}
		} catch (Exception e) {
			resultmap.put("status", "0");
			resultmap.put("msg", "创建失败" + e.getMessage());
		} finally {
			return resultmap;
		}
	}
	
	@RequestMapping("/ListAll")
	@ResponseBody
	public Map<String, Object> ListAll(@RequestParam Map<String, String> params){
		int page = Integer.valueOf(params.get("page"));
		int rows = Integer.valueOf(params.get("rows"));
		int total = 0;
		Map<String, Object> resultmap = new HashMap<>();
		List<User> users = new ArrayList<>();
		try {
			users = userService.ListAll(page, rows);
			total = userService.CountAll();
			resultmap.put("status", "1");
			resultmap.put("total", total);
			resultmap.put("records", users);
		} catch (Exception e) {
			resultmap.put("status", "0");
			resultmap.put("msg","获取用户失败" + e.getMessage());
		} finally {
			return resultmap;
		}
	}
	
	@RequestMapping("/Delete")
	@ResponseBody
	public Map<String, Object> Delete(@RequestParam String username){
		Map<String, Object> resultmap = new HashMap<>();
		try {
			userService.DeleteUser(username);
			resultmap.put("status", "1");
		} catch (Exception e) {
			resultmap.put("status", "0");
			resultmap.put("msg","删除失败：" + e.getMessage());
		} finally {
			return resultmap;
		}
	}
	
	@RequestMapping("/GetInfo")
	@ResponseBody
	public Map<String, Object> GetInfo(@RequestParam String username){
		Map<String, Object> resultmap = new HashMap<>();
		User user = new User();
		try {
			user = userService.GetUserInfo(username);
			resultmap.put("status", "1");
			resultmap.put("userinfo", user);
		} catch (Exception e) {
			resultmap.put("status", "0");
			resultmap.put("msg","获取用户信息失败" + e.getMessage());
		} finally {
			return resultmap;
		}
	}
}
