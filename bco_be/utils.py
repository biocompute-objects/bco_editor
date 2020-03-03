from django.conf import settings
from .models import *
import hashlib
import sys, json, ast
import bencode
import pdb
import yaml
import uuid

def checksum_valid(checksum):
    bcos = BcoObject.objects.filter(checksum=checksum)
    return len(bcos) == 0

def check_object_id(object_id):
    bcos = BcoObject.objects.filter(object_id=object_id)
    return len(bcos) > 0

def new_object_id():
    bcos = BcoObject.objects.all()
    length = get_valid_number(len(bcos))
    object_id = 'http://biocomputeobject.org/BCO_{}'.format(length)
    object_id = revise_object_id(object_id)
    return object_id

def get_valid_number(length):
    num_str = '00000{}'.format(str(uuid.uuid4().fields[-1])[:5])
    return num_str[-8:]

def json_parse( filename ):
    """removes top level fields from BCO and returns a string"""
    
    with open(filename, 'rb') as f:
        data = json.load(f)
        object_id, bco_spec = data['object_id'], data['spec_version']
        del data['object_id'], data['checksum'], data['spec_version']
    return data, object_id, bco_spec

def sha256_checksum( string ):
    """input to hash"""    
    sha256 = hashlib.sha256()
    sha256.update(bencode.encode(string))
    return sha256.hexdigest()

def hashed_object(data):
#    pdb.set_trace()
    data = yaml.load(json.dumps(data, ensure_ascii=False))

    object_id, bco_spec = data['object_id'], data['spec_version']
    created = data['provenance_domain']['created']
    modified = data['provenance_domain']['modified']
    try:
        del data['object_id'], data['spec_version']
    except:
        pass
    try:
        del data['checksum']
    except:
        pass

    try:
        del data['provenance_domain']['created'], data['provenance_domain']['modified']
    except:
        pass

    data['checksum'] = sha256_checksum(data)
    data['object_id'] = object_id
    data['spec_version'] = bco_spec
    data['provenance_domain']['created'] = created
    data['provenance_domain']['modified'] = modified
    return data

def revise_object_id(object_id):
    host_url = settings.HOST_URL
    object_id = settings.HOST_URL + 'bco/' + object_id.split('/')[-1]
    return object_id