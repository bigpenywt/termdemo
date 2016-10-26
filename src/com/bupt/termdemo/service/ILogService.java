package com.bupt.termdemo.service;

public interface ILogService {

	public void WriteLog(String oper_user, String operation, String oper_term) throws Exception;
	
}
