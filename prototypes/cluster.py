from annoy import AnnoyIndex
import logging
logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)


file = "/uploads/en_1000_no_stem/en.model"

#content = []
#with open(file) as f:
#  content = f.readlines()

#content = [x.split(" ") for x in content]
#from gensim.models.keyedvectors import KeyedVectors
import gensim

model = gensim.models.Word2Vec.load(file)
#model = gensim.models.KeyedVectors.load_word2vec_format(file, binary=True)

model.vector_size = 1000
from gensim.similarities.index import AnnoyIndexer
# 100 trees are being used in this example
annoy_index = AnnoyIndexer(model,100)


fname = 'index.ann'

# Persist index to disk
annoy_index.save(fname)

# Load index back
#if os.path.exists(fname):
#   annoy_index2 = AnnoyIndexer()
#   annoy_index2.load(fname)
#   annoy_index2.model = model
#

# Derive the vector for the word "army" in our model
#vector = model["science"]
# The instance of AnnoyIndexer we just created is passed 
#approximate_neighbors = model.most_similar([vector], topn=5, indexer=annoy_index)
# Neatly print the approximate_neighbors and their corresponding cosine similarity values
#for neighbor in approximate_neighbors:
#  print(neighbor)


