from config import MONGO_URI, MONGO_DATABASE
from pymongo import MongoClient
import gridfs



client = MongoClient(MONGO_URI)
db = client["images"]
fs = gridfs.GridFS(db)
mdb = db[MONGO_DATABASE]
   


