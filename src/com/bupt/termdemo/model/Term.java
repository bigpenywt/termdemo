package com.bupt.termdemo.model;

public class Term {
	
	private String termid;
	private String term;
	private String origin;
	private String definition;
	private String source;
	private String example;
	private String term_char;
	private String pronunciation;
	private String translation;
	private String basis;
	private String status;
	private String creator;
	private String create_time;
	private String reviewer;
	private String review_time;
	private String publisher;
	private String publish_time;
	private String reject_user;
	private String reject_time;
	private String reject_reason;
	private String delete_user;
	private String delete_time;
	
	public String getTermid() {
		return termid;
	}
	public String getDelete_user() {
		return delete_user;
	}
	public void setDelete_user(String delete_user) {
		this.delete_user = delete_user;
	}
	public String getDelete_time() {
		return delete_time;
	}
	public void setDelete_time(String delete_time) {
		this.delete_time = delete_time;
	}
	public void setTermid(String termid) {
		this.termid = termid;
	}
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
	public String getTerm_char() {
		return term_char;
	}
	public void setTerm_char(String term_char) {
		this.term_char = term_char;
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
	public String getCreator() {
		return creator;
	}
	public void setCreator(String creator) {
		this.creator = creator;
	}
	public String getCreate_time() {
		return create_time;
	}
	public void setCreate_time(String create_time) {
		this.create_time = create_time;
	}
	public String getReviewer() {
		return reviewer;
	}
	public void setReviewer(String reviewer) {
		this.reviewer = reviewer;
	}
	public String getReview_time() {
		return review_time;
	}
	public void setReview_time(String review_time) {
		this.review_time = review_time;
	}
	public String getPublisher() {
		return publisher;
	}
	public void setPublisher(String publisher) {
		this.publisher = publisher;
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
	public String getReject_time() {
		return reject_time;
	}
	public void setReject_time(String reject_time) {
		this.reject_time = reject_time;
	}
	public String getReject_reason() {
		return reject_reason;
	}
	public void setReject_reason(String reject_reason) {
		this.reject_reason = reject_reason;
	}
	@Override
	public String toString() {
		return "Term [termid=" + termid + ", term=" + term + ", origin=" + origin + ", definition=" + definition
				+ ", source=" + source + ", example=" + example + ", term_char=" + term_char + ", pronunciation="
				+ pronunciation + ", translation=" + translation + ", basis=" + basis + ", status=" + status
				+ ", creator=" + creator + ", create_time=" + create_time + ", reviewer=" + reviewer + ", review_time="
				+ review_time + ", publisher=" + publisher + ", publish_time=" + publish_time + ", reject_user="
				+ reject_user + ", reject_time=" + reject_time + ", reject_reason=" + reject_reason + ", delete_user="
				+ delete_user + ", delete_time=" + delete_time + "]";
	}
	
	
}
