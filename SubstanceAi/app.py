import streamlit as st
from datetime import datetime
import requests
import json
import streamlit as st
from urllib.parse import urlparse, parse_qs
import warnings
from streamlit.runtime.state.session_state_proxy import SessionStateProxy

# Désactiver le warning spécifique
warnings.filterwarnings("ignore", category=UserWarning, message=".*st.session_state.file_description cannot be modified.*")
import contextlib
import io

@contextlib.contextmanager
def suppress_st_warnings():
    with io.StringIO() as buffer:
        import sys
        old_stderr = sys.stderr
        sys.stderr = buffer
        try:
            yield
        finally:
            sys.stderr = old_stderr
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
    identifier = st.text_input("Email or Username")
    password = st.text_input("Password", type="password")

    if st.button("Login"):
        if identifier and password:
            data = {
                "identifier": identifier,
                "password": password
            }
            
            try:
                # Désactiver le suivi automatique des redirections
                response = requests.post(
                    f"{BASE_URL}login/", 
                    data=json.dumps(data), 
                    headers={'Content-Type': 'application/json'},
                    allow_redirects=False
                )
                
                # Vérifier si la réponse est une redirection
                if response.status_code in [301, 302, 303, 307, 308]:
                    redirect_url = response.headers.get('Location', '')
                    st.write(f"Debug - URL de redirection: {redirect_url}")
                    
                    # Extraire le paramètre utilisateur de l'URL
                    from urllib.parse import urlparse, parse_qs
                    parsed_url = urlparse(redirect_url)
                    query_params = parse_qs(parsed_url.query)
                    
                    if 'user' in query_params:
                        username = query_params['user'][0]
                        st.success(f"Connexion réussie! Bienvenue {username}")
                        
                        # Enregistrer les informations dans la session
                        st.session_state["user_authenticated"] = True
                        st.session_state["user_name"] = username
                        
                        # Définir les paramètres d'URL pour les autres pages
                        st.experimental_set_query_params(user=username)
                        
                        # Recharger la page
                        st.rerun()
                    else:
                        st.error("Paramètre utilisateur manquant dans la redirection")
                
                # Si c'est une réponse JSON standard (en cas de modification du backend)
                elif response.status_code == 200:
                    try:
                        response_data = response.json()
                        st.success("Connexion réussie!")
                        st.session_state["user_authenticated"] = True
                        st.session_state["user_name"] = identifier
                        # Stocker l'ID utilisateur s'il est disponible
                        if "user" in response_data and "_id" in response_data["user"]:
                            st.session_state["user_id"] = response_data["user"]["_id"]
                        st.rerun()
                    except json.JSONDecodeError:
                        st.error("Format de réponse invalide")
                        st.write("Contenu de la réponse:", response.text)
                
                # En cas d'erreur d'authentification
                else:
                    try:
                        error_data = response.json()
                        error_message = error_data.get("error", "Erreur inconnue")
                    except:
                        error_message = response.text
                    st.error(f"Échec de la connexion: {error_message}")
            
            except Exception as e:
                st.error(f"Erreur lors de la requête: {str(e)}")
        else:
            st.error("Veuillez remplir tous les champs.")

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
    # Récupérer les paramètres de l'URL
    query_params = st.query_params
    user_name = query_params.get('user', [None])[0]
    
    if "user_authenticated" in st.session_state and st.session_state["user_authenticated"]:
        st.title(f"Bienvenue, {st.session_state['user_name']}!")
    elif user_name:
        st.title(f"Bienvenue, {user_name}!")
    else:
        st.write("Vous devez vous connecter pour voir cette page.")
        return
    
    st.write("Ceci est votre page d'accueil.")
    
    # Ajouter des options pour gérer les PDF directement sur la page d'accueil
    st.subheader("Gestion de vos documents PDF")
    
    option = st.radio(
        "Que souhaitez-vous faire ?",
        ["Uploader un PDF", "Consulter mes PDFs"]
    )
    
    if option == "Uploader un PDF":
        upload_pdf_ui()
    elif option == "Consulter mes PDFs":
        list_pdfs_ui()



def upload_pdf_ui():
    st.subheader("Upload de PDF")

    # Obtenir l'ID utilisateur
    user_id = None
    query_params = st.query_params
    user_from_url = query_params.get('user', None)
    if user_from_url:
        user_id = user_from_url    
    elif "user_id" in st.session_state:
        user_id = st.session_state["user_id"]
    elif "user_name" in st.session_state:
        user_id = st.session_state["user_name"]
    
    if not user_id:
        st.error("Impossible d'identifier l'utilisateur")
        return
    
    # Initialisation des états
    if 'file_description_value' not in st.session_state:
        st.session_state.file_description_value = ''
    if 'upload_success' not in st.session_state:
        st.session_state.upload_success = False
    if 'success_message' not in st.session_state:
        st.session_state.success_message = ''
    
    # Afficher le message de succès s'il existe
    if st.session_state.upload_success:
        st.success(st.session_state.success_message)
        # Réinitialiser après affichage
        st.session_state.upload_success = False
        st.session_state.success_message = ''
    
    uploaded_file = st.file_uploader("Choisir un fichier PDF", type="pdf")

    if uploaded_file is not None:
        # CSS personnalisé
        st.markdown("""
        <style>
            /* Conteneur flex */
            .stHorizontalBlock {
                display: flex;
                align-items: flex-end;
                gap: 10px;
            }
            
            /* Style de l'input */
            .stTextInput>div>div>input {
                border: 8px 10px solid #4CAF50;
                border-radius: 5px;
                padding: 8px;
                height: 38px;
                flex-grow: 1;
            }
            
            /* Style du bouton avec bordure épaisse */
            div.stButton > button {
                height: 38px;
                white-space: nowrap;
                margin-bottom: 1px;
                border: 10px solid #4CAF50 !important;
                border-radius: 5px !important;
                font-weight: bold;
                width: 200px;
                padding: 0 25px;
                background-color: #4CAF50;
                color: white;
            }
            
            /* Effet au survol */
            div.stButton > button:hover {
                border: 3px solid #3e8e41 !important;
                background-color: #3e8e41;
            }
        </style>
        """, unsafe_allow_html=True)

        col1, col2 = st.columns([4, 1])
        
        with col1:
            user_input = st.text_input(
                "Description du fichier",
                placeholder="Entrez une description...",
                key="file_description_widget"
            )
        
        with col2:
            if st.button("Uploader", key="upload_btn"):
                if not user_input.strip():
                    st.warning("Veuillez entrer une description avant d'uploader")
                else:
                    files = {'file': (uploaded_file.name, uploaded_file.getvalue(), 'application/pdf')}
                    data = {
                        'user_id': user_id,
                        'description': user_input,
                        'filename': uploaded_file.name,
                        'upload_date': datetime.now().isoformat()
                    }

                    try:
                        response = requests.post(
                            f"{BASE_URL}upload-pdf/",
                            files=files,
                            data=data
                        )
                        
                        if response.status_code == 200:
                            # Stocker le message de succès dans session_state
                            st.session_state.upload_success = True
                            st.session_state.success_message = f"Fichier uploadé avec la description: '{user_input}'"
                            st.session_state.file_description_value = ""
                            st.rerun()
                        else:
                            st.error(f"Erreur {response.status_code}: {response.text}")
                    except Exception as e:
                        st.error(f"Erreur de connexion: {str(e)}")

def list_pdfs_ui(): 
    st.subheader("Mes documents PDF")
    
    # # Déboguer les valeurs de session
    # st.write("Contenu de session_state (debug):", st.session_state)
    
    # Récupérer l'ID utilisateur avec plus d'options
    user_id = None
    
    # Option 1: Extraire directement de l'URL (ajout de cette partie)
    query_params = st.query_params
    user_from_url = query_params.get('user', None)
    if user_from_url:
        user_id = user_from_url
    # Vérifier les différentes possibilités de stockage de l'ID
    elif "user_id" in st.session_state:
        user_id = st.session_state["user_id"]
    elif "user_name" in st.session_state:
        user_id = st.session_state["user_name"]
    elif "username" in st.session_state:
        user_id = st.session_state["username"]
    elif "email" in st.session_state:
        user_id = st.session_state["email"]
    
    # # Ajouter la possibilité de saisir manuellement l'ID utilisateur si nécessaire
    # if not user_id:
    #     user_id = st.text_input("Veuillez entrer votre identifiant utilisateur:")
    
    # if not user_id:
    #     st.error("Impossible d'identifier l'utilisateur. Veuillez vous connecter à nouveau.")
    #     return
    
    # Le reste du code reste identique
    try:
        response = requests.get(f"{BASE_URL}list-pdfs/{user_id}/")
        
        if response.status_code == 200:
            files = response.json().get('files', [])
            if not files:
                st.info("Vous n'avez pas encore de fichiers PDF")
            else:
                for file in files:
                    col1, col2 = st.columns([3, 1])
                    with col1:
                        st.write(f"📄 {file.get('filename', 'Sans nom')}")
                    with col2:
                        file_id = file.get('_id')
                        if file_id:
                            download_url = f"{BASE_URL}download-pdf/{file_id}/"
                            st.markdown(f'<a href="{download_url}" target="_blank">📥 Télécharger</a>', unsafe_allow_html=True)
        else:
            st.error(f"Erreur lors de la récupération des fichiers: {response.status_code}")
            st.error(response.text)
    except Exception as e:
        st.error(f"Erreur lors de la requête: {str(e)}")

# Fonction principale de Streamlit
# Modifiez votre fonction main() pour inclure ces nouvelles pages
def main():
    query_params = st.query_params
    user_name = query_params.get('user', [None])[0]
    user_id = query_params.get('user_id', None)  # Ajoutez l'ID utilisateur comme paramètre dans l'URL de redirection
    
    if user_id:
        st.session_state["user_id"] = user_id
        st.session_state["user_authenticated"] = True
        st.session_state["user_name"] = user_name

    if "user_authenticated" in st.session_state and st.session_state["user_authenticated"]:
        # Menu principal pour utilisateur authentifié
        menu = ["Accueil", "Upload PDF", "Mes PDFs"]
        choice = st.sidebar.selectbox("Navigation", menu)
        
        if choice == "Accueil":
            show_home()
        elif choice == "Upload PDF":
            upload_pdf_ui()
        elif choice == "Mes PDFs":
            list_pdfs_ui()
    elif user_name:
        show_home()
    else:
        st.title("User Authentication")
        
        # Menu de connexion (classique ou Google)
        menu = ["Login", "Register"]
        choice = st.sidebar.selectbox("Select an option", menu)

        if choice == "Register":
            register_user()
        elif choice == "Login":
            google_login()
            login_user()

if __name__ == "__main__":
    main()
    

