import random

def main(allowed_letters = 'aoeuidhtns'):
    words = get_words()
    writables = (
        [w for w in words
        if only_contains(allowed_letters, w)
        and len(w) >= 3]
    )[:100]
    for i in range(100):
        line = []
        for j in range(5):
            line.append(random.choice(writables))
        print(str(i+1) + ':', ' '.join(line))
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
    main()
