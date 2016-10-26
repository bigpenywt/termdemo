package com.bupt.termdemo.service.impl;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bupt.termdemo.dao.ILogDao;
import com.bupt.termdemo.model.Log;
import com.bupt.termdemo.service.ILogService;

@Service("logService")
public class LogServiceImpl implements ILogService {

	@Autowired
	private ILogDao logDao;

	@Override
	public void WriteLog(String oper_user, String operation, String oper_term) throws Exception {
		// TODO Auto-generated method stub
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//设置日期格式
		Log log = new Log();
		log.setLog_time(df.format(new Date()));
		log.setOper_user(oper_user);
		log.setOper_term(oper_term);
		log.setOperation(operation);
		logDao.WriteLog(log);
	}
}
