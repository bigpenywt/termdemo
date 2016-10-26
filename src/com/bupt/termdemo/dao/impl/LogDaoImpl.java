package com.bupt.termdemo.dao.impl;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.bupt.termdemo.dao.ILogDao;
import com.bupt.termdemo.model.Log;

@Repository("logDao")
public class LogDaoImpl implements ILogDao {

	@Autowired
	private SqlSessionFactory sessionFactory;
	
	@Override
	public void WriteLog(Log log) throws Exception {
		SqlSession session = sessionFactory.openSession();
		try {
			session.insert("logModule.WriteLog", log);
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
	}

}
