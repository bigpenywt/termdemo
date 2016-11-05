package com.bupt.termdemo.dao;

import java.util.List;

import com.bupt.termdemo.model.Magazine;

public interface IMagazineDao {

	public List<Magazine> ListAll() throws Exception;
	
	public void AddMagazine(Magazine magazine) throws Exception;
	
}
