import fileinput
import alphabet

all_letters = 'aoeuidhtnspyfgcrlqjkxbmwvz'

def encode(s):
    for l in all_letters:
        s = s.replace(l, alphabet.abc[l])
    return s

for line in fileinput.input():
    line = line.strip()
    line = encode(line)
    print(line, end='<br>\n')
