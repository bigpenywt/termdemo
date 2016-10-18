package com.bupt.termdemo.dao.impl;

import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.bupt.termdemo.dao.ITermDao;

@Repository("termDao")
public class TermDaoImpl implements ITermDao {

	@Autowired
	private SqlSessionFactory sessionFactory;
	
}
