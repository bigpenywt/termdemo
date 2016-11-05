package com.bupt.termdemo.service;

import com.bupt.termdemo.model.User;

public interface IUserService {
	
	public User GetUserInfo(String username) throws Exception;
	
	public void ModifyUserInfo(User user) throws Exception;
	
	public void AddUser(User user) throws Exception;
	
}
