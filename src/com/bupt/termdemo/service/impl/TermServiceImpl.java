package com.bupt.termdemo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bupt.termdemo.dao.ITermDao;
import com.bupt.termdemo.model.Term;
import com.bupt.termdemo.model.User;
import com.bupt.termdemo.service.ITermService;

@Service("termService")
public class TermServiceImpl implements ITermService {

	@Autowired
	private ITermDao termDao;

	@Override
	public List<Term> QueryTermByUserAndStatus(User user, String status, int page, int rows) throws Exception {
		// TODO Auto-generated method stub
		return termDao.QueryTermByUserAndStatus(user, status, page, rows);
	}

	@Override
	public int GetTermCountByUserAndStatus(User user, String status) throws Exception {
		// TODO Auto-generated method stub
		return termDao.GetTermCountByUserAndStatus(user, status);
	}
	
	public List<Term> QueryTermByStatus(String status, int page, int rows) throws Exception {
		// TODO Auto-generated method stub
		return termDao.QueryTermByStatus(status, page, rows);
	}

	@Override
	public int GetTermCountByStatus(String status) throws Exception {
		// TODO Auto-generated method stub
		return termDao.GetTermCountByStatus(status);
	}
}
