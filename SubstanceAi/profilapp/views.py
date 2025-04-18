from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from pymongo import MongoClient

# Connexion à MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["SubstanceAi"]
collection = db["profile"]

@csrf_exempt
def enregistrer_reponses(request):
    """API pour enregistrer les réponses du test de profilage via Streamlit."""
    if request.method == "POST":
        try:
            data = json.loads(request.body)  # Récupération des données JSON
            collection.insert_one(data)  # Stockage dans MongoDB
            return JsonResponse({"message": "Réponses enregistrées avec succès"}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Méthode non autorisée"}, status=405)

@csrf_exempt
def recuperer_reponses(request, user_id):
    """API pour récupérer les réponses d’un utilisateur donné."""
    try:
        reponses = list(collection.find({"user_id": user_id}, {"_id": 0}))
        return JsonResponse({"reponses": reponses}, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
