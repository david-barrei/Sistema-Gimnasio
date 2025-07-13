from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions    import IsAuthenticated

from rest_framework.generics import CreateAPIView
from .serializers import PostSerializer
from .models import PostModels
# Create your views here.

class PostViews(CreateAPIView):
    serializer_class = PostSerializer
    queryset = PostModels.objects.all()

    authentication_classes = [TokenAuthentication]
    permission_classes     = [IsAuthenticated]

    def perform_create(self, serializer):
        # automáticamente asigna el admin autenticado
        serializer.save(admin=self.request.user)