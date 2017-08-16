import nltk
import sys
from textblob import Word

nltk.download('Wordnet')

requests = [term[1:-1].replace(" ", "_") for term in sys.argv[1:]]

for arg in requests:
    w1 = Word(arg.lower())
    start = w1.synsets
    words = w1.synsets
    seen = {}
    seenTitles = {}
    while (len(words) > 0):
        word = list.pop(words)

        if (not word in seen):
            words = words + word.hyponyms()
            #print([word.path_similarity(w) for w in start])
            for wordTitle in word.lemma_names():
              factoredTitle = wordTitle.replace("_", " ").lower()
              if (not factoredTitle in seenTitles):
                seenTitles[factoredTitle] = True
                print(factoredTitle)              

        seen[word] = True

