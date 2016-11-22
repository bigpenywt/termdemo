package com.bupt.termdemo.dao.impl;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.bupt.termdemo.dao.IConfDao;

@Repository("confDao")
public class ConfDaoImpl implements IConfDao {

	@Autowired
	private SqlSessionFactory sessionFactory;
	
	@Override
	public String getConf() throws Exception {
		SqlSession session = sessionFactory.openSession();
		String res = "";
		try {
			res = session.selectOne("confModule.getConf");
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
		return res;
	}

	@Override
	public void setConf(String configuration) throws Exception {
		SqlSession session = sessionFactory.openSession();
		try {
			session.update("confModule.setConf", configuration);
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
	}

}
