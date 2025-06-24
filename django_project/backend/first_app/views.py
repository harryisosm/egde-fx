from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import check_password
from .models import Registration, TradingConfiguration, Contact, Franchise
from .serializers import RegistrationSerializer, TradingConfigurationSerializer, ContactSerializer, FranchiseSerializer
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.

@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            serializer = RegistrationSerializer(data=data)
            if serializer.is_valid():
                user = serializer.save()
                return JsonResponse({
                    'message': 'Registration successful',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'name': user.name
                    }
                })
            return JsonResponse(serializer.errors, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            try:
                user = Registration.objects.get(username=username)
                if user.check_password(password):
                    return JsonResponse({
                        'message': 'Login successful',
                        'user': {
                            'id': user.id,
                            'username': user.username,
                            'email': user.email,
                            'name': user.name
                        }
                    })
                return JsonResponse({'error': 'Invalid credentials'}, status=401)
            except Registration.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def trading_config(request):
    if request.method == 'GET':
        try:
            user_id = request.GET.get('user_id')
            if not user_id:
                return JsonResponse({'error': 'User ID is required'}, status=400)

            # Get all configurations for the user
            configs = TradingConfiguration.objects.filter(user_id=user_id)
            
            # Group configurations by category
            categories = {}
            for config in configs:
                if config.category not in categories:
                    categories[config.category] = []
                categories[config.category].append({
                    'symbol': config.symbol,
                    'value': str(config.value),
                    'enabled': config.enabled
                })
            
            return JsonResponse(categories)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id')
            if not user_id:
                return JsonResponse({'error': 'User ID is required'}, status=400)

            # Delete existing configurations for the user
            TradingConfiguration.objects.filter(user_id=user_id).delete()

            # Create new configurations
            for category, instruments in data.items():
                if category != 'user_id':  # Skip the user_id field
                    for instrument in instruments:
                        TradingConfiguration.objects.create(
                            user_id=user_id,
                            category=category,
                            symbol=instrument['symbol'],
                            value=instrument['value'],
                            enabled=instrument['enabled']
                        )

            return JsonResponse({'message': 'Configuration updated successfully'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def contact_submit(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            serializer = ContactSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse({
                    'message': 'Thank you for your message. We will get back to you soon!'
                })
            return JsonResponse(serializer.errors, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def franchise_submit(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            serializer = FranchiseSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse({
                    'message': 'Thank you for your interest in becoming an egde-fx franchise! We will contact you soon.'
                })
            return JsonResponse(serializer.errors, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def get_users(request):
    if request.method == 'GET':
        users = Registration.objects.all()
        data = [{
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'name': user.name,
            'phone': user.phone,
            'created_at': user.created_at
        } for user in users]
        return JsonResponse(data, safe=False)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def get_contacts(request):
    if request.method == 'GET':
        contacts = Contact.objects.all()
        data = [{
            'id': contact.id,
            'name': contact.name,
            'email': contact.email,
            'message': contact.message,
            'created_at': contact.created_at,
            'is_read': contact.is_read
        } for contact in contacts]
        return JsonResponse(data, safe=False)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def get_franchises(request):
    if request.method == 'GET':
        franchises = Franchise.objects.all()
        data = [{
            'id': franchise.id,
            'name': franchise.name,
            'email': franchise.email,
            'phone': franchise.phone,
            'message': franchise.message,
            'status': franchise.status,
            'created_at': franchise.created_at,
            'is_read': franchise.is_read
        } for franchise in franchises]
        return JsonResponse(data, safe=False)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def update_franchise_status(request, franchise_id):
    if request.method == 'PATCH':
        try:
            data = json.loads(request.body)
            franchise = Franchise.objects.get(id=franchise_id)
            franchise.status = data.get('status', franchise.status)
            franchise.save()
            return JsonResponse({'message': 'Status updated successfully'})
        except Franchise.DoesNotExist:
            return JsonResponse({'error': 'Franchise not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def update_read_status(request, model_type, item_id):
    if request.method == 'PATCH':
        try:
            if model_type == 'contact':
                item = Contact.objects.get(id=item_id)
            elif model_type == 'franchise':
                item = Franchise.objects.get(id=item_id)
            else:
                return JsonResponse({'error': 'Invalid model type'}, status=400)
            
            item.is_read = True
            item.save()
            return JsonResponse({'message': 'Read status updated successfully'})
        except (Contact.DoesNotExist, Franchise.DoesNotExist):
            return JsonResponse({'error': 'Item not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@api_view(['GET'])
def check_admin(request, user_id):
    try:
        user = Registration.objects.get(id=user_id)
        return Response({
            'is_admin': user.is_admin
        })
    except Registration.DoesNotExist:
        return Response({
            'is_admin': False
        }, status=404)
