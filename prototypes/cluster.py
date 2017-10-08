from annoy import AnnoyIndex

file = "/uploads/pathToSaveModel1.txt"

#content = []
#with open(file) as f:
#  content = f.readlines()

#content = [x.split(" ") for x in content]
from gensim.models.keyedvectors import KeyedVectors
import gensim

model = gensim.models.Word2Vec.load(file)

t = AnnoyIndex(50) 
terms = [i[0] for i in content]
termMapping = []
for i in content:
  vec = [float(a) for a in i[1:]]
  print(len(vec))
  t.add_item(len(termMapping), vec)

  termMapping.append(i[0])

t.build(10) # 10 trees
t.save('test.ann')

u = AnnoyIndex(50)
u.load('test.ann')

for index, word in termMapping:
  print(index)
  print(word)
  near = u.get_nns_by_item(index, 10) # nearest 10 terms
  nearWords = [terms[i] for i in near]
  print(word + ": " + nearWords)
