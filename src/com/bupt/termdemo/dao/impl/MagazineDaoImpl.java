package com.bupt.termdemo.dao.impl;

import java.util.ArrayList;
import java.util.List;

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
	public List<Magazine> ListAll() throws Exception {
		SqlSession session = sessionFactory.openSession();
		List<Magazine> magazines = new ArrayList<>();
		try {
			magazines = session.selectList("magazineModule.ListAll");
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
	
}
