package com.bupt.termdemo.dao.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.session.RowBounds;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.bupt.termdemo.dao.IMagazineDao;
import com.bupt.termdemo.model.Magazine;

@Repository("magazineDao")
public class MagazineDaoImpl implements IMagazineDao {

	@Autowired
	private SqlSessionFactory sessionFactory;

	@Override
	public List<Magazine> ListAll(int page, int rows) throws Exception {
		RowBounds rowBounds = new RowBounds((page-1)*rows, rows);
		SqlSession session = sessionFactory.openSession();
		List<Magazine> magazines = new ArrayList<>();
		try {
			magazines = session.selectList("magazineModule.ListAll", 0, rowBounds);
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
		return magazines;
	}

	@Override
	public void AddMagazine(Magazine magazine) throws Exception {
		SqlSession session = sessionFactory.openSession();
		try {
			session.insert("magazineModule.AddMagazine",magazine);
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
	}

	@Override
	public int FindMagazine(String name) throws Exception {
		SqlSession session = sessionFactory.openSession();
		int result = 0;
		try {
			result = session.selectOne("magazineModule.FindMagazine",name);
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
		return result;
	}

	@Override
	public void DeleteMagazine(String name) throws Exception {
		SqlSession session = sessionFactory.openSession();
		try {
			session.delete("magazineModule.DeleteMagazine",name);
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
	}
	
	@Override
	public int CountAll() throws Exception {
		SqlSession session = sessionFactory.openSession();
		int result = 0;
		try {
			result = session.selectOne("magazineModule.CountAll");
		} catch (Exception e) {
			throw e;
		} finally {
			session.close();
		}
		return result;
	}
	
}
