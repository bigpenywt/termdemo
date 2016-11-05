package com.bupt.termdemo.service;

import com.bupt.termdemo.model.User;

public interface ILoginService {

	public User login(User user) throws Exception;
	
}
