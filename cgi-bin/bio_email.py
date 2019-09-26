import smtplib
import json
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def sendEmail(subject, content, dest):
	config_json = json.loads(open("conf/config.json", "r").read())
	
	# message = Mail(
	# 	from_email='no-reply@biocomputeobject.com',
	# 	to_emails=dest,
	# 	subject=subject,
	# 	html_content=content)

	try:
		# sg = SendGridAPIClient(config_json['email']['api_key'])
		# response = sg.send(message)
		pass
	except Exception as e:
		# print(e.message)
		pass

def registerSubject():
	return 'New user request for BCO Editor'

def registerBody(email):
	return '''
		<p>A new user has requested acces to the BCO Editor. </p>
		<p>Please review this request in /var/www/cgi-bin/bco_editor_tst/ as soon as you are able to and activate via </p>
		<p><strong>python admin_util -a upsert_user -e {} -s 1 </strong></p>
		<p>, or forward to keeneyjg@gwu.edu.</p>

	'''.format(email)

def confirmSubject():
	return 'Automated message: Account Approval'

def approvalBody():
	return '''
		<p>Congratulations,</p>
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