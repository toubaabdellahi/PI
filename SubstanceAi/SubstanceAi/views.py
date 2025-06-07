from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from bson import ObjectId
from .utils import *
from pymongo import MongoClient
from pymongo import MongoClient

@csrf_exempt
def upload_pdf(request):
    if request.method == 'POST' and request.FILES:
        user_id = request.POST.get('user_id')
        message = request.POST.get('message', '')
        uploaded_file_ids = []

        try:
            files = request.FILES.getlist('file')
            for f in files:
                file_id = save_pdf_to_mongodb(f, user_id, message)
                uploaded_file_ids.append(str(file_id))

            return JsonResponse({
                'message': 'Fichiers enregistrés avec succès',
                'file_ids': uploaded_file_ids
            })

        except Exception as e:
            traceback.print_exc()  # pour debug dans la console
            return JsonResponse({'error': 'Erreur lors de l\'enregistrement', 'details': str(e)}, status=500)

    return JsonResponse({'error': 'Aucun fichier reçu'}, status=400)


def list_pdfs(request, user_id):
    """Retourne la liste des fichiers PDF uploadés par un utilisateur spécifique"""
    try:
        files = list_user_pdfs(user_id)
        return JsonResponse({"files": files})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
    
def download_pdf(request, file_id):
    """Télécharge un fichier PDF depuis MongoDB"""
    try:
        file = get_pdf_from_mongodb(ObjectId(file_id))
        response = FileResponse(file, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{file.filename}"'
        return response
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

