package com.bupt.termdemo.model;

public class Term {
	
	private String term;
	private String origin;
	private String definition;
	private String source;
	private String example;
	private String character;
	private String pronunciation;
	private String translation;
	private String basis;
	private String status;
	private String create_user;
	private String create_time;
	private String review_user;
	private String review_time;
	private String publish_user;
	private String publish_time;
	private String reject_user;
	private String reject_reason;
	
	public String getTerm() {
		return term;
	}
	public void setTerm(String term) {
		this.term = term;
	}
	public String getOrigin() {
		return origin;
	}
	public void setOrigin(String origin) {
		this.origin = origin;
	}
	public String getDefinition() {
		return definition;
	}
	public void setDefinition(String definition) {
		this.definition = definition;
	}
	public String getSource() {
		return source;
	}
	public void setSource(String source) {
		this.source = source;
	}
	public String getExample() {
		return example;
	}
	public void setExample(String example) {
		this.example = example;
	}
	public String getCharacter() {
		return character;
	}
	public void setCharacter(String character) {
		this.character = character;
	}
	public String getPronunciation() {
		return pronunciation;
	}
	public void setPronunciation(String pronunciation) {
		this.pronunciation = pronunciation;
	}
	public String getTranslation() {
		return translation;
	}
	public void setTranslation(String translation) {
		this.translation = translation;
	}
	public String getBasis() {
		return basis;
	}
	public void setBasis(String basis) {
		this.basis = basis;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getCreate_user() {
		return create_user;
	}
	public void setCreate_user(String create_user) {
		this.create_user = create_user;
	}
	public String getCreate_time() {
		return create_time;
	}
	public void setCreate_time(String create_time) {
		this.create_time = create_time;
	}
	public String getReview_user() {
		return review_user;
	}
	public void setReview_user(String review_user) {
		this.review_user = review_user;
	}
	public String getReview_time() {
		return review_time;
	}
	public void setReview_time(String review_time) {
		this.review_time = review_time;
	}
	public String getReject_reason() {
		return reject_reason;
	}
	public void setReject_reason(String reject_reason) {
		this.reject_reason = reject_reason;
	}
	public String getPublish_user() {
		return publish_user;
	}
	public void setPublish_user(String publish_user) {
		this.publish_user = publish_user;
	}
	public String getPublish_time() {
		return publish_time;
	}
	public void setPublish_time(String publish_time) {
		this.publish_time = publish_time;
	}
	public String getReject_user() {
		return reject_user;
	}
	public void setReject_user(String reject_user) {
		this.reject_user = reject_user;
	}
	@Override
	public String toString() {
		return "Term [term=" + term + ", origin=" + origin + ", definition=" + definition + ", source=" + source
				+ ", example=" + example + ", character=" + character + ", pronunciation=" + pronunciation
				+ ", translation=" + translation + ", basis=" + basis + ", status=" + status + ", create_user="
				+ create_user + ", create_time=" + create_time + ", review_user=" + review_user + ", review_time="
				+ review_time + ", publish_user=" + publish_user + ", publish_time=" + publish_time + ", reject_user="
				+ reject_user + ", reject_reason=" + reject_reason + "]";
	}
}
