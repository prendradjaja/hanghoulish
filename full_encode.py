# ptodo
# . W and Y
# . F, Q, and V
# . triple-consonant clusters

# ptodo-bad results (these are the expected results)
# . over = o ver
# . takes = tak es OR ta kes? not sure
# . iterable = i te rab le?
# . together = to get her

# ptodo-style
# . basically all the identifiers are poorly chosen

import string
import hgtk
import alphabet

_test_words = [
    'han',
    'hanhan',
    'than',
    'theo',
] + 'the quick fox jumps the dog join is a method strings that method takes iterable and iterates it and joins the contents together'.split()

# uniq
test_words = []
for w in _test_words:
    if w not in test_words:
        test_words.append(w)

# what is the word for the type Vowel | Consonant?
def to_buckets(word):
    result = ''
    for letter in word:
        result += to_bucket(letter)
    return result

def to_bucket(letter):
    assert letter in string.ascii_lowercase
    if letter in 'aeiou':
        return 'v'
    else:
        return 'c'

def segments(word):
    if 'w' in word or 'y' in word:
        raise NotImplemented
    bucketed = to_buckets(word)

    i = 0
    while i < len(word):
        r_buckets = bucketed[i:]  # remaining buckets
        # Lookahead cases
        if r_buckets.startswith('cvcv'):
            use = 3
        elif r_buckets.startswith('vcv'):
            use = 2
        # Normal cases
        elif r_buckets.startswith('cvc'):
            use = 3
        elif r_buckets.startswith('vc'):
            use = 2
        elif r_buckets.startswith('cv'):
            use = 2
        elif r_buckets.startswith('c'):
            use = 1
        elif r_buckets.startswith('v'):
            use = 1
        else:
            raise 'ptodo bug?'
        to_join = word[i : i+use]
        yield to_join
        i += use

def encode(word):
    try:
        return ''.join(encode_segment(seg, word) for seg in segments(word))
    except:
        return '???'

def encode_segment(orig_seg, word):
    seg = add_placeholders(orig_seg)
    jamos = [alphabet.abc[letter] for letter in seg]
    try:
        res = hgtk.letter.compose(*jamos)
        return res
    except hgtk.exception.NotHangulException:
        print('Word              :', word)
        print('Segment           :', orig_seg)
        print('With placeholders :', seg)
        print('Jamos             :',jamos)
        raise


def add_placeholders(seg):
    bucketed = to_buckets(seg)
    if bucketed == 'cvc':
        return seg
    elif bucketed == 'vc':
        return 'C' + seg
    elif bucketed == 'cv':
        return seg
    elif bucketed == 'c':
        return seg + 'V'
    elif bucketed == 'v':
        return 'C' + seg
    else:
        raise 'ptodo bug?'

def main():
    maxlen = max(len(w) for w in test_words)
    for w in test_words:
        print(w.ljust(maxlen) + ' :', encode(w))

if __name__ == '__main__':
    main()
