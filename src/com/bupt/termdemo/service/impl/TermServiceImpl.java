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
	public List<Term> GetCreateTerm(Term term, int page, int rows) throws Exception {
		// TODO Auto-generated method stub
		return termDao.GetCreateTerm(term, page, rows);
	}

	@Override
	public int GetCreateTermCount(Term term) throws Exception {
		// TODO Auto-generated method stub
		return termDao.GetCreateTermCount(term);
	}

	@Override
	public void SaveTerm(Term term) throws Exception {
		termDao.SaveTerm(term);
	}

	@Override
	public int FindTerm(Term term) throws Exception {
		// TODO Auto-generated method stub
		return termDao.FindTerm(term);
	}

	@Override
	public void DeleteTerm(String term) throws Exception {
		termDao.DeleteTerm(term);
	}
}
