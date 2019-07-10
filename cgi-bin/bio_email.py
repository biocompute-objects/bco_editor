import smtplib
import json
import pdb

def sendEmail(content):
	# pdb.set_trace()
	config_json = json.loads(open("conf/config.json", "r").read())
	server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
	server.login(config_json['email']['username'], config_json['email']['password'])
	server.sendmail(
	  config_json['email']['username'], 
	  config_json['email']['dest'], 
	  content)
	server.quit()