import streamlit as st
import requests
import json
import streamlit as st
from urllib.parse import urlparse, parse_qs
BASE_URL = "http://127.0.0.1:8000/api/auth/"
# Fonction pour l'inscription
def register_user():
    fullname = st.text_input("Full Name")
    username = st.text_input("Username")
    email = st.text_input("Email")
    password = st.text_input("Password", type="password")

    if st.button("Register"):
        # Vérification si tous les champs sont remplis
        if fullname and username and email and password:
            # Envoi des données à l'API
            data = {
                "fullname": fullname,
                "username": username,
                "email": email,
                "password": password
            }
            response = requests.post(f"{BASE_URL}register/", data=json.dumps(data), headers={'Content-Type': 'application/json'})
            
            if response.status_code == 201:
                st.success("Registration successful!")
                st.session_state["user_authenticated"] = True
                st.session_state["user_name"] = username
                st.rerun() 
            else:
                st.error(f"Registration failed: {response.text}")
        else:
            st.error("Please fill in all fields.")

# Fonction pour la connexion

def login_user():
    identifier = st.text_input("Email or Username")  # Champ pour email ou username
    password = st.text_input("Password", type="password")

    if st.button("Login"):
        # Vérification si les champs sont remplis
        if identifier and password:
            # Envoi des données de connexion à l'API
            data = {
                "identifier": identifier,  # Envoie l'identifiant qui peut être un email ou un username
                "password": password
            }
            response = requests.post(f"{BASE_URL}login/", data=json.dumps(data), headers={'Content-Type': 'application/json'})
            
            if response.status_code == 200:
                st.success("Login successful!")
                st.session_state["user_authenticated"] = True
                st.session_state["user_name"] = identifier
                st.rerun() 
                
                # Tu peux ici stocker le token JWT dans une session ou un cookie
            else:
                st.error(f"Login failed: {response.text}")
        else:
            st.error("Please fill in all fields.")

GOOGLE_OAUTH2_LOGIN_URL = "https://accounts.google.com/o/oauth2/auth"
GOOGLE_CLIENT_ID = "76497721292-2fmahu68t6r2vaiupdmq6rbbtqsm3jq5.apps.googleusercontent.com"
REDIRECT_URI = "http://localhost:8000/api/auth/login/google/callback/"

def google_login():
    auth_url = (
        f"{GOOGLE_OAUTH2_LOGIN_URL}?"
        f"client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        f"&response_type=code"
        f"&scope=email%20profile"
    )
    # st.write(f"Redirecting to: {auth_url}")
    st.markdown(f'<a href="{auth_url}" target="_self">Login with Google</a>', unsafe_allow_html=True)

def show_home():
    # Récupérer les paramètres de l'URL en utilisant la méthode nouvelle
    query_params = st.query_params
    user_name = query_params.get('user', [None])[0]
    if "user_authenticated" in st.session_state and st.session_state["user_authenticated"]:
        st.title(f"Welcome, {st.session_state['user_name']}!")
        st.write("This is your home page.")
    elif user_name:
        st.title(f"Bienvenue, {user_name}!")
        st.write("Ceci est votre page d'accueil.")
    else:
        st.write("Vous devez vous connecter pour voir cette page.")



# Fonction principale de Streamlit
def main():
    
    
    query_params = st.query_params
    user_name = query_params.get('user', [None])[0]

    if "user_authenticated" in st.session_state and st.session_state["user_authenticated"]:
        show_home()  # Afficher la page d'accueil si l'utilisateur est authentifié
    elif user_name :
        show_home() 
    else:
        st.title("User Authentication")
        
        # Menu de connexion (classique ou Google)
        menu = ["Login", "Register"]
        choice = st.sidebar.selectbox("Select an option", menu)

        if choice == "Register":
            register_user()  # Si l'utilisateur veut s'inscrire
        elif choice == "Login":
            # Affichage de la possibilité de se connecter via Google ou avec des identifiants classiques
            google_login()  # Bouton de connexion Google
            login_user()  # Connexion classique avec email/username + mot de passe

if __name__ == "__main__":
    main()
    

