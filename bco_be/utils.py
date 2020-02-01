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

def check_bco_id(bco_id):
	bcos = BcoObject.objects.filter(bco_id=bco_id)
	return len(bcos) > 0

def new_bco_id():
	bcos = BcoObject.objects.all()
	length = get_valid_number(len(bcos))
	bco_id = 'http://biocomputeobject.org/BCO_{}'.format(length)
	return bco_id

def get_valid_number(length):
	num_str = '00000{}'.format(str(uuid.uuid4().fields[-1])[:5])
	return num_str[-8:]

def json_parse( filename ):
    """removes top level fields from BCO and returns a string"""
    
    with open(filename, 'rb') as f:
        data = json.load(f)
        bco_id, bco_spec = data['bco_id'], data['bco_spec_version']
        del data['bco_id'], data['checksum'], data['bco_spec_version']
    return data, bco_id, bco_spec

def sha256_checksum( string ):
    """input to hash"""    
    sha256 = hashlib.sha256()
    sha256.update(bencode.encode(string))
    return sha256.hexdigest()

def hashed_object(data):
#    pdb.set_trace()
    data = yaml.load(json.dumps(data, ensure_ascii=False))

    bco_id, bco_spec = data['bco_id'], data['bco_spec_version']
    del data['bco_id'], data['checksum'], data['bco_spec_version']
    data['checksum'] = sha256_checksum(data)
    data['bco_id'] = bco_id
    data['bco_spec_version'] = bco_spec
    return data