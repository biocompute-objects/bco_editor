from django.apps import AppConfig
import sys


class BcoBeConfig(AppConfig):
	name = 'bco_be'

	def ready(self):
		print('Updating checksum to all objects')
		if 'runserver' not in sys.argv:
			return True
		from bco_be.models import BcoObject
<<<<<<< HEAD
		from bco_be.utils import hashed_object, revise_bco_id
=======
		from bco_be.utils import hashed_object
>>>>>>> dashboard_spelling
		from django.forms.models import model_to_dict
		import json

		def reviveObject():
			all_bcos = BcoObject.objects.all()
			for bco in all_bcos:
				try:
					_bco = json.loads(bco.to_json())
					del _bco['_id']
					new_bco = hashed_object(_bco)
					bco.checksum = new_bco['checksum']
<<<<<<< HEAD
					bco.bco_id = revise_bco_id(bco.bco_id)
=======
>>>>>>> dashboard_spelling
					bco.save()
				except Exception as e:
					print(e)

		reviveObject()
