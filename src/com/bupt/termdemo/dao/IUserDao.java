package com.bupt.termdemo.dao;

import java.util.List;

import com.bupt.termdemo.model.User;

public interface IUserDao {
	
	public User login(User user) throws Exception;
	
	public User GetUserInfo(String username) throws Exception;
	
	public void ModifyUserInfo(User user) throws Exception;

	public void AddUser(User user) throws Exception;
	
	public int FindUser(String username) throws Exception;

	public List<User> ListAll() throws Exception;

	public void DeleteUser(String username) throws Exception;
	
}
