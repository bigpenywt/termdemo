package com.bupt.termdemo.dao;

import java.util.List;

import com.bupt.termdemo.model.Term;

public interface ITermDao {

	public List<Term> GetCreateTerm(String username , String status, int page, int rows) throws Exception;
	
	public int GetCreateTermCount(String username, String status) throws Exception;
	
	public void SaveTerm(Term term) throws Exception;
}
