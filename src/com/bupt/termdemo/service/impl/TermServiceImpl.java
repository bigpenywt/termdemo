package com.bupt.termdemo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bupt.termdemo.dao.ITermDao;
import com.bupt.termdemo.model.Term;
import com.bupt.termdemo.service.ITermService;

@Service("termService")
public class TermServiceImpl implements ITermService {

	@Autowired
	private ITermDao termDao;

	@Override
	public List<Term> GetCreateTerm(String username, String status, int page, int rows) throws Exception {
		// TODO Auto-generated method stub
		return termDao.GetCreateTerm(username, status, page, rows);
	}

	@Override
	public int GetCreateTermCount(String username, String status) throws Exception {
		// TODO Auto-generated method stub
		return termDao.GetCreateTermCount(username, status);
	}

	@Override
	public void SaveTerm(Term term) throws Exception {
		termDao.SaveTerm(term);
	}
}
