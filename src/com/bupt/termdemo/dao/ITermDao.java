package com.bupt.termdemo.dao;

import java.util.List;

import com.bupt.termdemo.model.Term;

public interface ITermDao {

	public List<Term> GetCreateTerm(Term term, int page, int rows) throws Exception;
	
	public int GetCreateTermCount(Term term) throws Exception;
	
	public void SaveTerm(Term term) throws Exception;
	
	public int FindTerm(Term term) throws Exception;
	
	public void DeleteTerm(String term) throws Exception;
	
	public void ModifyTerm(Term term) throws Exception;
	
	public List<Term> GettbRortbPTerm(String status, int page, int rows) throws Exception;
	
	public int GettbRortbPTermCount(String status) throws Exception;
}
