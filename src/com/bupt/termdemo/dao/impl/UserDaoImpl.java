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
	public User login(User user) {
		SqlSession session = sessionFactory.openSession();
		User loginuser = new User();
		try {
			loginuser = session.selectOne("userModule.login", user);
		} catch (Exception e) {
			System.out.println(e.getMessage());
		} finally {
			session.close();
		}
		return loginuser;
	}
	
}
