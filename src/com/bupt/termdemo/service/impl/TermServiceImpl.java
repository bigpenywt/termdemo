package com.bupt.termdemo.service.impl;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;

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
		String uuid = UUID.randomUUID().toString();
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//设置日期格式	
		
		term.setTermid(uuid);
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
	public List<Term> GetTermByStatus(String status, int page, int rows) throws Exception {
		return termDao.GetTermByStatus(status, page, rows);
	}

	@Override
	public int GetTermByStatusCount(String status) throws Exception {
		return termDao.GetTermByStatusCount(status);
	}

	@Override
	public List<Term> GetRejectedTerm(String username, int page, int rows) throws Exception {
		// TODO Auto-generated method stub
		return termDao.GetRejectedTerm(username, page, rows);
	}

	@Override
	public int GetRejectedTermCount(String username) throws Exception {
		// TODO Auto-generated method stub
		return termDao.GetRejectedTermCount(username);
	}

	@Override
	public void RejectTerm(Term term) throws Exception {
		// TODO Auto-generated method stub
		termDao.RejectTerm(term);
	}

	@Override
	public void ReviewTerm(Term term) throws Exception {
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//设置日期格式	
		term.setReview_time(df.format(new Date()));// new Date()为获取当前系统时间
		termDao.ReviewTerm(term);
	}

	@Override
	public void PublishTerm(Term term) throws Exception {
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//设置日期格式	
		term.setPublish_time(df.format(new Date()));// new Date()为获取当前系统时间
		termDao.PublishTerm(term);
	}

	@Override
	public List<Term> GettbReviewTerm(String username, int page, int rows) throws Exception {
		// TODO Auto-generated method stub
		return termDao.GettbReviewTerm(username, page, rows);
	}

	@Override
	public int GettbReviewTermCount(String username) throws Exception {
		// TODO Auto-generated method stub
		return termDao.GettbReviewTermCount(username);
	}

	@Override
	public void DeleteDoneTerm(Term term) throws Exception{
		// TODO Auto-generated method stub
		termDao.DeleteDoneTerm(term);
	}
}
