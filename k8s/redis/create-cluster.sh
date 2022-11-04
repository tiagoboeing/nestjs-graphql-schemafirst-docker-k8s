kubectl get pods -l app=redis-cluster -o jsonpath='{range.items[*]}{.status.podIP}:6379'
# 10.1.0.112:637910.1.0.111:637910.1.0.113:6379:6379

kubectl exec -it redis-0 -n redis -- redis-cli --cluster create 10.1.0.112:6379 10.1.0.111:6379 10.1.0.113:6379 --cluster-replicas 1