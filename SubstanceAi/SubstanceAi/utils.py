import gridfs
from pymongo import MongoClient

# Connexion à MongoDB
MONGO_URI = "mongodb://localhost:27017/SubstanceAi"
client = MongoClient(MONGO_URI)
db = client.get_database()
users_collection = db["pdfs"]  # Collection MongoDB pour stocker les utilisateurs
fs = gridfs.GridFS(db)

import gridfs
from pymongo import MongoClient

# Connexion à MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["SubstanceAi"]
fs = gridfs.GridFS(db)

def save_pdf_to_mongodb(file, user_id):
    """Sauvegarde un fichier PDF dans MongoDB GridFS avec l'ID utilisateur"""
    file_id = fs.put(file.read(), filename=file.name, user_id=user_id)
    return file_id

def list_user_pdfs(user_id):
    """Liste les fichiers PDF stockés par un utilisateur spécifique"""
    files = [{"_id": str(file._id), "filename": file.filename} for file in fs.find({"user_id": user_id})]
    return files

def get_pdf_from_mongodb(file_id):
    """Récupère un fichier PDF stocké dans MongoDB GridFS"""
    return fs.get(file_id)
