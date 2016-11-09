package com.bupt.termdemo.service;

import java.util.List;

import com.bupt.termdemo.model.Magazine;

public interface IMagazineService {
	
	public List<Magazine> ListAll(int page, int rows) throws Exception;
	
	public void AddMagazine(Magazine magazine) throws Exception;

	public int FindMagazine(String name) throws Exception;

	public void DeleteMagazine(String name) throws Exception;
	
	public int CountAll() throws Exception;
}
