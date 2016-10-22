package com.bupt.termdemo.model;

public class Log {

	private String log_time;
	private String oper_user;
	private String operation;
	private String oper_term;
	public String getLog_time() {
		return log_time;
	}
	public void setLog_time(String log_time) {
		this.log_time = log_time;
	}
	public String getOper_user() {
		return oper_user;
	}
	public void setOper_user(String oper_user) {
		this.oper_user = oper_user;
	}
	public String getOperation() {
		return operation;
	}
	public void setOperation(String operation) {
		this.operation = operation;
	}
	public String getOper_term() {
		return oper_term;
	}
	public void setOper_term(String oper_term) {
		this.oper_term = oper_term;
	}
	@Override
	public String toString() {
		return "Log [log_time=" + log_time + ", oper_user=" + oper_user + ", operation=" + operation + ", oper_term="
				+ oper_term + "]";
	}
}
