# NestJS Schema First

## Kubernetes cluster

### Using K3D

```bash
# Create cluster
k3d cluster create integration --api-port 6550 -p "3000:3000@loadbalancer" --agents 2 --registry-create integration

# Load images to registry
k3d image import integration:0.0.1 --cluster=integration
```
