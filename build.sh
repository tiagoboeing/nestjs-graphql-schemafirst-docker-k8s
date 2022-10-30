docker build -t integration .

# Load image to Minikube registry
# minikube image load nestjs-schemafirst

# Load image to K3D registry
# k3d image import integration:latest