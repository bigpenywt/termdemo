package com.bupt.termdemo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bupt.termdemo.dao.IConfDao;
import com.bupt.termdemo.service.IConfService;

@Service("confService")
public class ConfServiceImpl implements IConfService{

	@Autowired
	private IConfDao confDao;
	
	@Override
	public String getConf() throws Exception {
		// TODO Auto-generated method stub
		return confDao.getConf();
	}

	@Override
	public void setConf(String configuration) throws Exception {
		// TODO Auto-generated method stub
		confDao.setConf(configuration);
	}

}
