package com.bupt.termdemo.service;

import java.util.List;

import com.bupt.termdemo.model.Term;

public interface ITermService {

	public List<Term> GetCreateTerm(Term term, int page, int rows) throws Exception;
	
	public int GetCreateTermCount(Term term) throws Exception;
	
	public void SaveTerm(Term term, String username) throws Exception;
	
	public int FindTerm(Term term) throws Exception;
	
	public void DeleteTerm(String term) throws Exception;
	
	public void ModifyTerm(Term term) throws Exception;
}
