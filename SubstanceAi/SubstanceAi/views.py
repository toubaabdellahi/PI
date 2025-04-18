from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from bson import ObjectId
from .utils import *

@csrf_exempt
def upload_pdf(request):
    if request.method == 'POST' and request.FILES.get('file'):
        user_id = request.POST.get('user_id')
        pdf_file = request.FILES['file']
        file_id = save_pdf_to_mongodb(pdf_file, user_id)

        return JsonResponse({'message': 'Fichier enregistré avec succès', 'file_id': str(file_id)})
    
    return JsonResponse({'error': 'Aucun fichier reçu'}, status=400)


def list_pdfs(request, user_id):
    """Retourne la liste des fichiers PDF uploadés par un utilisateur spécifique"""
    files = list_user_pdfs(user_id)
    return JsonResponse({"files": files})

from django.http import FileResponse

def download_pdf(request, file_id):
    """Télécharge un fichier PDF depuis MongoDB"""
    try:
        file = get_pdf_from_mongodb(ObjectId(file_id))
        response = FileResponse(file, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{file.filename}"'
        return response
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

