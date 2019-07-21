import smtplib
import json
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def sendEmail(content, dest):
	config_json = json.loads(open("conf/config.json", "r").read())
	server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
	server.login(config_json['email']['username'], config_json['email']['password'])
	server.sendmail(
	  config_json['email']['username'], 
	  dest, 
	  content)
	server.quit()

def registerSubject():
	return 'New user request for BCO Editor'

def registerBody(email):
	return '''
		<p>A new user has requested acces to the BCO Editor. </p>
		<p>Please review this request in /software/bco_editor/cgi-bin as soon as you are able to and activate via </p>
		<p><strong>python admin_util -a upsert_user -e {} -s 1 </strong></p>
		<p>, or forward to keeneyjg@gwu.edu.</p>

	'''.format(email)

def confirmSubject():
	return 'Automated message: Account Approval'

def approvalBody():
	return '''
		<p>Congratulaltions,</p>
		<p>This message is to inform you that your request for account access to https://www.biocomputeobject.org has been reviewed by an administrator and approved. 
			You may now begin building and editing BCOs via this link.
		</p>
	'''

def denialBody():
	return '''
		<p>We are sorry,</p>
		<p>This message is to inform you that your request for account access to https://www.biocomputeobject.org has been denied. 
			Please contact the system administrator at object.biocompute@gmail.com for more details.
		</p>
	'''

def makeContent(subject, content):
	message = MIMEMultipart("alternative")
	message["Subject"] = subject
	part = MIMEText(content, "html")

	message.attach(part)
	return message.as_string()

	# message["From"] = sender_email
	# message["To"] = receiver_email
	# return """\
	# 	Subject: {}

	# 	{}
	# """.format(subject, content)