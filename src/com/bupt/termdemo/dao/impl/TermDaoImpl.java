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
			session.delete("termModule.DeleteTerm", term);
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
			session.update("termModule.ModifyTerm", term);
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
	}

	@Override
	public List<Term> GetTermByStatus(String status, int page, int rows) throws Exception {
		SqlSession session = sessionFactory.openSession();
		RowBounds rowBounds = new RowBounds((page-1)*rows, rows);

		List<Term> terms = new ArrayList<>();
		try {
			terms = session.selectList("termModule.GetTermByStatus", status, rowBounds);
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
		return terms;
	}

	@Override
	public int GetTermByStatusCount(String status) throws Exception {
		SqlSession session = sessionFactory.openSession();
		int result = 0;
		try {
			result = session.selectOne("termModule.GetTermByStatusCount", status);
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
		return result;
	}

	@Override
	public List<Term> GetRejectedTerm(String username, int page, int rows) throws Exception {
		SqlSession session = sessionFactory.openSession();
		RowBounds rowBounds = new RowBounds((page-1)*rows, rows);

		List<Term> terms = new ArrayList<>();
		try {
			terms = session.selectList("termModule.GetRejectedTerm", username, rowBounds);
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
		return terms;
	}

	@Override
	public int GetRejectedTermCount(String username) throws Exception {
		SqlSession session = sessionFactory.openSession();
		int result = 0;
		try {
			result = session.selectOne("termModule.GetRejectedTermCount", username);
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
		return result;
	}

	@Override
	public void RejectTerm(Term term) throws Exception {
		SqlSession session = sessionFactory.openSession();
		try {
			session.update("termModule.RejectTerm", term);
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
	}

	@Override
	public void ReviewTerm(Term term) throws Exception {
		SqlSession session = sessionFactory.openSession();
		try {
			session.update("termModule.ReviewTerm", term);
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
	}

	@Override
	public void PublishTerm(Term term) throws Exception {
		SqlSession session = sessionFactory.openSession();
		try {
			session.update("termModule.PublishTerm", term);
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
	}

	@Override
	public List<Term> GettbReviewTerm(String username, int page, int rows) throws Exception {
		SqlSession session = sessionFactory.openSession();
		RowBounds rowBounds = new RowBounds((page-1)*rows, rows);

		List<Term> terms = new ArrayList<>();
		try {
			terms = session.selectList("termModule.GettbReviewTerm", username,rowBounds);
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
		return terms;
	}

	@Override
	public int GettbReviewTermCount(String username) throws Exception {
		SqlSession session = sessionFactory.openSession();
		int result = 0;
		try {
			result = session.selectOne("termModule.GettbReviewTermCount", username);
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
		return result;
	}

	@Override
	public void DeleteDoneTerm(Term term) throws Exception {
		SqlSession session = sessionFactory.openSession();
		try {
			session.update("termModule.DeleteDoneTerm", term);
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
	}

	@Override
	public Term QueryTerm(String term) throws Exception {
		SqlSession session = sessionFactory.openSession();
		Term res = new Term();
		try {
			res = session.selectOne("termModule.QueryTerm", term);
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
		return res;
	}

	@Override
	public int FindDoneTerm(String term) {
		SqlSession session = sessionFactory.openSession();
		int result = 0;
		try {
			result = session.selectOne("termModule.FindDoneTerm", term);
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
		return result;
	}
}
