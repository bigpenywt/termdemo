package com.bupt.termdemo.dao.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.session.RowBounds;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.bupt.termdemo.dao.ITermDao;
import com.bupt.termdemo.model.Term;

@Repository("termDao")
public class TermDaoImpl implements ITermDao {

	@Autowired
	private SqlSessionFactory sessionFactory;
	
	@Override
	public List<Term> GetCreateTerm(Term term, int page, int rows) throws Exception {
		SqlSession session = sessionFactory.openSession();
		RowBounds rowBounds = new RowBounds((page-1)*rows, rows);

		List<Term> terms = new ArrayList<>();
		try {
			terms = session.selectList("termModule.GetCreateTerm", term,rowBounds);
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
		return terms;
	}

	@Override
	public int GetCreateTermCount(Term term) throws Exception {
		SqlSession session = sessionFactory.openSession();
		int result = 0;
		try {
			result = session.selectOne("termModule.GetCreateTermCount", term);
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
		return result;
	}

	@Override
	public void SaveTerm(Term term) throws Exception {
		SqlSession session = sessionFactory.openSession();
		try {
			session.insert("termModule.SaveTerm", term);
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
	}

	@Override
	public int FindTerm(Term term) throws Exception {
		SqlSession session = sessionFactory.openSession();
		int result = 0;
		try {
			result = session.selectOne("termModule.FindTerm", term);
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
		return result;
	}

	@Override
	public void DeleteTerm(String term) throws Exception {
		SqlSession session = sessionFactory.openSession();
		try {
			session.insert("termModule.DeleteTerm", term);
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
	}

	@Override
	public void ModifyTerm(Term term) throws Exception {
		SqlSession session = sessionFactory.openSession();
		try {
			session.insert("termModule.ModifyTerm", term);
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
	}
}
