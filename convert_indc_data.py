#!/usr/bin/env python2.7
# -*- coding: utf-8 -*-

'''
csv to json
'''
import sys
import csv
import json

def read_csv(file_name):
    data = [] 
    with open(file_name, 'r') as input_file:
        reader = csv.reader(input_file)
        for row in reader:
            data.append(row)
    return data[0] if len(data) == 1 else data


def write_json(file_name, content):
    with open(file_name, 'w') as output_file:
        json.dump(content, output_file, indent=4)

data = read_csv(sys.argv[1])
output = {}
header = data[0]
for i in range(len(header)):
    words = header[i].split(' ')
    if len(words) > 1:
        header[i] = words[0] + words[1]
    else:
        header[i] = words[0]

for i in range(1, len(data)):
    country = data[i][0]
    output[country] = {}
    for j in range(1, len(data[i])):
        output[country][header[j]] = data[i][j]

write_json('./data/data.json', output)
