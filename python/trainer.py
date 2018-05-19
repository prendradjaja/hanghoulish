import random
import sys

ALLOWED = ' '.join([
    'aoeuidhtns',
    'rl',
    'cm',
    'fj',
    'gp',
    'wy',
    'bv',
    'kx',
    'qz',
])

def main(start, allowed_letters = ALLOWED):
    words = get_words()
    writables = (
        [w for w in words
        if only_contains(allowed_letters, w)
        # and (False
        #     # or 'r' in w
        #     # or 'l' in w
        #     # or 'c' in w
        #     # or 'm' in w
        #     # or 'j' in w
        #     # or 'f' in w
        #     # or 'g' in w
        #     # or 'p' in w
        #     # or 'w' in w
        #     # or 'y' in w
        #     # or 'b' in w
        #     # or 'v' in w
        #     # or 'k' in w
        #     # or 'x' in w
        #     or 'q' in w
        #     or 'z' in w
        #     )
        and 7>= len(w) >= 3]
    )
    writables.extend(writables[:150])  # higher probability of seeing common words
    for i in range(100):
        line = []
        for j in range(5):
            line.append(random.choice(writables))
        print(str(i+start) + ':', ' '.join(line))
        try:
            input()
        except (EOFError, KeyboardInterrupt) as e:
            exit()

def get_words():
    with open('google-10000-english-usa.txt') as f:
        return [line.strip() for line in f]

def only_contains(letters, word):
    return all(c in letters for c in word)

if __name__ == '__main__':
    start = 1
    try:
        start = int(sys.argv[-1])
    except:
        pass
    main(start)
