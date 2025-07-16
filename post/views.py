from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions    import IsAuthenticated

from rest_framework.generics import CreateAPIView,ListAPIView,RetrieveAPIView,UpdateAPIView,DestroyAPIView
from .serializers import PostSerializer
from .models import PostModels
# Create your views here.

class PostCreate(CreateAPIView):
    serializer_class = PostSerializer
    queryset = PostModels.objects.all()


    def perform_create(self, serializer):
        # automáticamente asigna el admin autenticado
        serializer.save(admin=self.request.user)

class PostDetail(RetrieveAPIView):
   
    serializer_class = PostSerializer
    queryset = PostModels.objects.all()


class PostList(ListAPIView):
    serializer_class = PostSerializer
    queryset = PostModels.objects.all()

class PostUpdate(UpdateAPIView):
   
    serializer_class = PostSerializer
    queryset = PostModels.objects.all()

class PostDestroy(DestroyAPIView):
    lookup_field = 'pk'
    serializer_class =PostSerializer
    queryset = PostModels.objects.all()

