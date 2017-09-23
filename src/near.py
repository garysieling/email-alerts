from gensim.models import Word2Vec
from gensim.utils.SaveLoad
model = Word2Vec.load("data/en.model")
#word_vectors = model.wv
#

Word2Vec.save(model, replace_word_vectors_with_normalized = true)



