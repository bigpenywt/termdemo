package com.bupt.termdemo.service;

import java.util.List;

import com.bupt.termdemo.model.User;

public interface IUserService {
	
	public User GetUserInfo(String username) throws Exception;
	
	public void ModifyUserInfo(User user) throws Exception;
	
	public void AddUser(User user) throws Exception;
	
	public int FindUser(String username) throws Exception;

	public List<User> ListAll(int page, int rows) throws Exception;

	public void DeleteUser(String username) throws Exception;

	public int CountAll() throws Exception;
	
}
