package com.bupt.termdemo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bupt.termdemo.dao.IUserDao;
import com.bupt.termdemo.model.User;
import com.bupt.termdemo.service.IUserService;

@Service("userService")
public class UserServiceImpl implements IUserService {

	@Autowired
	private IUserDao userDao;

	@Override
	public User GetUserInfo(String username) throws Exception {
		// TODO Auto-generated method stub
		return userDao.GetUserInfo(username);
	}

	@Override
	public void ModifyUserInfo(User user) throws Exception {
		// TODO Auto-generated method stub
		userDao.ModifyUserInfo(user);
	}

	@Override
	public void AddUser(User user) throws Exception {
		// TODO Auto-generated method stub
		userDao.AddUser(user);
	}

	@Override
	public int FindUser(String username) throws Exception {
		// TODO Auto-generated method stub
		return userDao.FindUser(username);
	}

	@Override
	public List<User> ListAll() throws Exception {
		// TODO Auto-generated method stub
		return userDao.ListAll();
	}

	@Override
	public void DeleteUser(String username) throws Exception {
		// TODO Auto-generated method stub
		userDao.DeleteUser(username);
	}
	
}
