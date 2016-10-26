package com.bupt.termdemo.dao;

import com.bupt.termdemo.model.Log;

public interface ILogDao {

	public void WriteLog(Log log) throws Exception;
	
}
