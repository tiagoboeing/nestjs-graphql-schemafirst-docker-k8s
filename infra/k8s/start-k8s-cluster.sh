kubectl apply -f ./k8s/docker-desktop

kubectl create ns redis
kubectl apply -f ./k8s/redis -n redis

kubectl create ns integration
kubectl apply -f ./k8s -n integration

