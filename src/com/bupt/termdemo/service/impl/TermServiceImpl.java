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

	@Override
	public Term QueryTerm(String term, String conf) throws Exception {
		// TODO Auto-generated method stub
		Term res = new Term();
		Term tmp = new Term();
		tmp = termDao.QueryTerm(term);
		res.setTermid(tmp.getTermid());
		res.setTerm(tmp.getTerm());
		if(conf.charAt(0) == '1')
			res.setOrigin(tmp.getOrigin());
		if(conf.charAt(1) == '1')
			res.setDefinition(tmp.getDefinition());
		if(conf.charAt(2) == '1')
			res.setSource(tmp.getSource());
		if(conf.charAt(3) == '1')
			res.setExample(tmp.getExample());
		if(conf.charAt(4) == '1')
			res.setTerm_char(tmp.getTerm_char());
		if(conf.charAt(5) == '1')
			res.setPronunciation(tmp.getPronunciation());
		if(conf.charAt(6) == '1')
			res.setTranslation(tmp.getTranslation());
		if(conf.charAt(7) == '1')
			res.setBasis(tmp.getBasis());
		return res;
	}
}
