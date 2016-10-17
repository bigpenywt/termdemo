package com.bupt.termdemo.model;

public class User {
	
	private String username;
	private String password;
	private String userrole;
	
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getUserrole() {
		return userrole;
	}
	public void setUserrole(String userrole) {
		this.userrole = userrole;
	}
	@Override
	public String toString() {
		return "User [username=" + username + ", password=" + password + ", userrole=" + userrole + "]";
	}
}
