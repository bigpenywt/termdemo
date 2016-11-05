package com.bupt.termdemo.dao.impl;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.bupt.termdemo.dao.IUserDao;
import com.bupt.termdemo.model.User;

@Repository("userDao")
public class UserDaoImpl implements IUserDao {

	@Autowired
	private SqlSessionFactory sessionFactory;

	@Override
	public User login(User user) throws Exception {
		SqlSession session = sessionFactory.openSession();
		User loginuser = new User();
		try {
			loginuser = session.selectOne("userModule.login", user);
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
		return loginuser;
	}

	@Override
	public User GetUserInfo(String username) throws Exception {
		SqlSession session = sessionFactory.openSession();
		User user = new User();
		try {
			user = session.selectOne("userModule.GetUserInfo", username);
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
		return user;
	}

	@Override
	public void ModifyUserInfo(User user) throws Exception {
		SqlSession session = sessionFactory.openSession();
		try {
			session.update("userModule.ModifyUserInfo", user);
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
	}
	
	
	@Override
	public void AddUser(User user) throws Exception {
		SqlSession session = sessionFactory.openSession();
		try {
			session.insert("userModule.AddUser", user);
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
	}
}
