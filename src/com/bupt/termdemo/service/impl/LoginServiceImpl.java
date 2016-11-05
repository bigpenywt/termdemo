package com.bupt.termdemo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bupt.termdemo.dao.IUserDao;
import com.bupt.termdemo.model.User;
import com.bupt.termdemo.service.ILoginService;

@Service("loginService")
public class LoginServiceImpl implements ILoginService {

	@Autowired
	private IUserDao userDao;
	
	@Override
	public User login(User user) throws Exception {
		// TODO Auto-generated method stub
		return userDao.login(user);
	}

}
