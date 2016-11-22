package com.bupt.termdemo.model;

public class Conf {

	private String id;
	private String configuration;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getConfiguration() {
		return configuration;
	}
	public void setConfiguration(String configuration) {
		this.configuration = configuration;
	}
	
	@Override
	public String toString() {
		return "Conf [id=" + id + ", configuration=" + configuration + "]";
	}
	
	
}
