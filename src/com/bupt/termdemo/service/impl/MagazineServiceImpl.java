package com.bupt.termdemo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bupt.termdemo.dao.IMagazineDao;
import com.bupt.termdemo.model.Magazine;
import com.bupt.termdemo.service.IMagazineService;

@Service("magazineService")
public class MagazineServiceImpl implements IMagazineService {

	@Autowired
	private IMagazineDao magazineDao;
	
	@Override
	public List<Magazine> ListAll() throws Exception {
		// TODO Auto-generated method stub
		return magazineDao.ListAll();
	}

	@Override
	public void AddMagazine(Magazine magazine) throws Exception {
		// TODO Auto-generated method stub
		magazineDao.AddMagazine(magazine);
	}

}
