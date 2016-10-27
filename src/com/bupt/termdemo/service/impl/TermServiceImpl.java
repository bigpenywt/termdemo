package com.bupt.termdemo.service.impl;

import java.text.SimpleDateFormat;
import java.util.Date;
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
	public void SaveTerm(Term term, String username) throws Exception {
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//设置日期格式	
		
		term.setCreator(username);
		term.setCreate_time(df.format(new Date()));// new Date()为获取当前系统时间
		term.setStatus("0");
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

	@Override
	public void ModifyTerm(Term term) throws Exception {
		termDao.ModifyTerm(term);
	}

	@Override
	public List<Term> GettbRortbPTerm(String status, int page, int rows) throws Exception {
		return termDao.GettbRortbPTerm(status, page, rows);
	}

	@Override
	public int GettbRortbPTermCount(String status) throws Exception {
		return termDao.GettbRortbPTermCount(status);
	}
}
