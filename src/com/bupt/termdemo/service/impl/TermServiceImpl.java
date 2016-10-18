package com.bupt.termdemo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bupt.termdemo.service.ITermService;

@Service("termService")
public class TermServiceImpl implements ITermService {

	@Autowired
	private ITermService termService;
	
}
