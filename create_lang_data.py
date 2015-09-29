#!/usr/bin/env python2.7
# -*- coding: utf-8 -*-

import sys
import csv
import json

def write_json(file_name, content):
    with open(file_name, 'w') as output_file:
        json.dump(content, output_file, indent=2, ensure_ascii=False)

def read_json(file_name):
    with open(file_name, 'r') as input_file:
        return json.load(input_file)

data = read_json(sys.argv[1])
data = data['features']
output = read_json('./data/lang.json')
tmp = read_json('./data/espData.json')
for country in data:
    en = country['properties']['name']
    output[en]['esp'] = output[en]['un_es']
    del output[en]['un_es']
    
    '''un_es = country['properties']['un_es']
    output[en]['un_es'] = un_es'''
write_json('./data/lang.json', output)
