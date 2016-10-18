package com.bupt.termdemo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bupt.termdemo.dao.ILogDao;
import com.bupt.termdemo.service.ILogService;

@Service("logService")
public class LogServiceImpl implements ILogService {

	@Autowired
	private ILogDao logDao;
	
}
