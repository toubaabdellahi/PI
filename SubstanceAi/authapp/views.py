
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import User, UserManager
from .serializers import RegisterSerializer, UserSerializer
from django.shortcuts import redirect
from social_django.utils import psa
import requests
from django.http import JsonResponse
from django.contrib.auth import login

from pymongo import MongoClient

# Connexion à MongoDB
MONGO_URI = "mongodb://localhost:27017/SubstanceAi"
client = MongoClient(MONGO_URI)
db = client.get_database()
user_manager = UserManager()
# Accéder à la collection "users"
users_collection = db.users
@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        # Utilisation du UserManager pour créer un utilisateur dans MongoDB
        user = user_manager.create_user(
            email=data['email'],
            fullname=data['fullname'],
            username=data['username'],
            password=data['password'],
            
            
        )
        # return Response({"message": "Inscription réussie"}, status=status.HTTP_201_CREATED)
        # return redirect(f"http://localhost:8501?user={user.fullname}")
        redirect_url = f"http://localhost:8501/?user={user['username']}"
        return Response({"message": "Inscription réussie", "redirect_url": redirect_url}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def login(request):
    identifier = request.data.get('identifier')  # Peut être soit email soit username
    password = request.data.get('password')

    # Vérifie si l'identifiant est un email ou un username
    if '@' in identifier:  # On suppose que s'il y a un '@', c'est un email
        user_data = User.find_by_email(identifier)
    else:
        user_data = User.find_by_username(identifier)

    if user_data and User.verify_password(user_data['password'], password):
        # Convertir ObjectId en string
        user_data['_id'] = str(user_data['_id'])
        # return Response({"message": "Connexion réussie", "user": user_data}, status=status.HTTP_200_OK)
        return redirect(f"http://localhost:8501/?user={user_data['username']}")

    return Response({"error": "Email/Username ou mot de passe incorrect"}, status=status.HTTP_401_UNAUTHORIZED)



GOOGLE_CLIENT_ID = "76497721292-2fmahu68t6r2vaiupdmq6rbbtqsm3jq5.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET = "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"
REDIRECT_URI = "http://localhost:8000/api/auth/login/google/callback/"




def google_callback(request):
    # Récupérer le code d'autorisation
    code = request.GET.get("code")
    if not code:
        return JsonResponse({"error": "Code not provided"}, status=400)

    # Logique pour récupérer le token et les infos de l'utilisateur
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code",
    }
    response = requests.post(token_url, data=data)
    token_info = response.json()

    if "access_token" not in token_info:
        return JsonResponse({"error": "Failed to obtain access token"}, status=400)

    access_token = token_info["access_token"]

    # Récupérer les informations de l'utilisateur via l'API Google
    user_info_url = "https://www.googleapis.com/oauth2/v1/userinfo"
    headers = {"Authorization": f"Bearer {access_token}"}
    user_response = requests.get(user_info_url, headers=headers)

    if user_response.status_code != 200:
        return JsonResponse({"error": "Failed to fetch user info"}, status=400)

    user_data = user_response.json()

    # Vérifier si l'utilisateur existe déjà dans la base de données
    user = users_collection.find_one({"email": user_data['email']})
    
    if not user:
        # Si l'utilisateur n'existe pas, le créer dans MongoDB sans mot de passe
        users_collection.insert_one({
            "email": user_data['email'],
            "name": user_data.get("name"),
            "profile_picture": user_data.get("picture"),
            "google_id": user_data.get("id"),
            "verified_email": user_data.get("verified_email"),
        })

    # Retourner un message de succès
    return redirect(f"http://localhost:8501/?user={user_data['name']}")






