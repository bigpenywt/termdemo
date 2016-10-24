package com.bupt.termdemo.dao.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.RowBounds;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.bupt.termdemo.dao.ITermDao;
import com.bupt.termdemo.model.Term;
import com.bupt.termdemo.model.User;

@Repository("termDao")
public class TermDaoImpl implements ITermDao {

	@Autowired
	private SqlSessionFactory sessionFactory;

	@Override
	public List<Term> QueryTermByUserAndStatus (User user, String status, int page, int rows) throws Exception{
		return null;
	}

	@Override
	public List<Term> QueryTermByStatus(String status, int page, int rows) throws Exception{
		SqlSession session = sessionFactory.openSession();
		RowBounds rowBounds = new RowBounds((page-1)*rows, rows);
		List<Term> terms = new ArrayList<>();
		try {
			terms = session.selectList("termModule.QueryTermByStatus", status,rowBounds);
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
		return terms;
	}

	@Override
	public int GetTermCountByUserAndStatus(User user, String status) throws Exception{
		return 0;
	}

	@Override
	public int GetTermCountByStatus(String status) throws Exception {
		SqlSession session = sessionFactory.openSession();
		int result = 0;
		try {
			result = session.selectOne("termModule.GetTermCountByStatus", status);
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
		return result;
	}
	
}
