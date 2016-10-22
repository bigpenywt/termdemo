package com.bupt.termdemo.service;

import java.util.List;

import com.bupt.termdemo.model.Term;
import com.bupt.termdemo.model.User;

public interface ITermService {

	public List<Term> QueryTermByUserAndStatus(User user, String status, int page, int rows) throws Exception;
	
	public int GetTermCountByUserAndStatus(User user, String status) throws Exception;
	
	public List<Term> QueryTermByStatus(String status, int page, int rows) throws Exception;
	
	public int GetTermCountByStatus(String status) throws Exception;
}
