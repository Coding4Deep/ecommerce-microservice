# ☸️ Kubernetes Deployment Guide

This directory contains Kubernetes manifests for deploying the E-Commerce Microservices Platform to a Kubernetes cluster.

## 📁 Directory Structure

```
k8s/
├── namespace/
│   └── namespace.yaml           # Namespace definition
├── configmaps/
│   ├── app-config.yaml         # Application configuration
│   └── nginx-config.yaml       # Nginx configuration
├── secrets/
│   ├── database-secrets.yaml   # Database credentials
│   ├── jwt-secrets.yaml        # JWT signing keys
│   └── external-secrets.yaml   # External service credentials
├── persistent-volumes/
│   ├── mongodb-pv.yaml         # MongoDB persistent volume
│   └── redis-pv.yaml           # Redis persistent volume
├── databases/
│   ├── mongodb-deployment.yaml # MongoDB StatefulSet
│   ├── mongodb-service.yaml    # MongoDB Service
│   ├── redis-deployment.yaml   # Redis Deployment
│   └── redis-service.yaml      # Redis Service
├── services/
│   ├── user-service/           # User service manifests
│   ├── product-service/        # Product service manifests
│   ├── cart-service/           # Cart service manifests
│   ├── notification-service/   # Notification service manifests
│   ├── review-service/         # Review service manifests
│   ├── inventory-service/      # Inventory service manifests
│   ├── admin-service/          # Admin service manifests
│   └── api-gateway/            # API Gateway manifests
├── frontend/
│   ├── web-app/                # Web application manifests
│   └── admin-app/              # Admin application manifests
├── ingress/
│   └── ingress.yaml            # Ingress configuration
├── monitoring/
│   ├── prometheus/             # Prometheus monitoring
│   └── grafana/                # Grafana dashboards
└── README.md                   # This file
```

## 🚀 Quick Deployment

### Prerequisites
- Kubernetes cluster (v1.20+)
- kubectl configured
- Helm (optional, for monitoring)
- Ingress controller (nginx-ingress recommended)

### 1. Create Namespace
```bash
kubectl apply -f namespace/namespace.yaml
```

### 2. Deploy Secrets and ConfigMaps
```bash
# Create secrets (update with your values first)
kubectl apply -f secrets/
kubectl apply -f configmaps/
```

### 3. Deploy Persistent Storage
```bash
kubectl apply -f persistent-volumes/
```

### 4. Deploy Databases
```bash
kubectl apply -f databases/
```

### 5. Deploy Microservices
```bash
kubectl apply -f services/
```

### 6. Deploy Frontend Applications
```bash
kubectl apply -f frontend/
```

### 7. Configure Ingress
```bash
kubectl apply -f ingress/
```

### 8. Verify Deployment
```bash
kubectl get pods -n ecommerce
kubectl get services -n ecommerce
kubectl get ingress -n ecommerce
```

## 📋 Service Deployment Templates

### Deployment Template
Each service should have a deployment manifest with the following structure:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: service-name
  namespace: ecommerce
  labels:
    app: service-name
    version: v1.0.0
spec:
  replicas: 3
  selector:
    matchLabels:
      app: service-name
  template:
    metadata:
      labels:
        app: service-name
    spec:
      containers:
      - name: service-name
        image: your-registry/service-name:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secrets
              key: mongodb-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: database-secrets
              key: redis-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Service Template
```yaml
apiVersion: v1
kind: Service
metadata:
  name: service-name
  namespace: ecommerce
  labels:
    app: service-name
spec:
  selector:
    app: service-name
  ports:
  - port: 80
    targetPort: 8000
    protocol: TCP
  type: ClusterIP
```

### ConfigMap Template
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: service-name-config
  namespace: ecommerce
data:
  NODE_ENV: "production"
  LOG_LEVEL: "info"
  PORT: "8000"
  # Add service-specific configuration
```

### Secret Template
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: service-name-secrets
  namespace: ecommerce
type: Opaque
data:
  # Base64 encoded values
  jwt-secret: <base64-encoded-jwt-secret>
  api-key: <base64-encoded-api-key>
```

## 🗄️ Database Deployments

### MongoDB StatefulSet
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mongodb
  namespace: ecommerce
spec:
  serviceName: mongodb
  replicas: 3
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      containers:
      - name: mongodb
        image: mongo:4.4
        ports:
        - containerPort: 27017
        env:
        - name: MONGO_INITDB_ROOT_USERNAME
          value: admin
        - name: MONGO_INITDB_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: database-secrets
              key: mongodb-password
        volumeMounts:
        - name: mongodb-storage
          mountPath: /data/db
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
  volumeClaimTemplates:
  - metadata:
      name: mongodb-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi
```

### Redis Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: ecommerce
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        ports:
        - containerPort: 6379
        command:
        - redis-server
        - --requirepass
        - $(REDIS_PASSWORD)
        env:
        - name: REDIS_PASSWORD
          valueFrom:
            secretKeyRef:
              name: database-secrets
              key: redis-password
        volumeMounts:
        - name: redis-storage
          mountPath: /data
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
      volumes:
      - name: redis-storage
        persistentVolumeClaim:
          claimName: redis-pvc
```

## 🌐 Ingress Configuration

### Nginx Ingress
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ecommerce-ingress
  namespace: ecommerce
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - api.yourdomain.com
    - app.yourdomain.com
    - admin.yourdomain.com
    secretName: ecommerce-tls
  rules:
  - host: api.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-gateway
            port:
              number: 80
  - host: app.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-app
            port:
              number: 80
  - host: admin.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: admin-app
            port:
              number: 80
```

## 📊 Monitoring Setup

### Prometheus Configuration
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: ecommerce
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
    scrape_configs:
    - job_name: 'kubernetes-pods'
      kubernetes_sd_configs:
      - role: pod
        namespaces:
          names:
          - ecommerce
      relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
```

### Grafana Dashboard
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-dashboards
  namespace: ecommerce
data:
  ecommerce-dashboard.json: |
    {
      "dashboard": {
        "title": "E-Commerce Platform",
        "panels": [
          {
            "title": "Request Rate",
            "type": "graph",
            "targets": [
              {
                "expr": "rate(http_requests_total[5m])"
              }
            ]
          }
        ]
      }
    }
```

## 🔒 Security Considerations

### Network Policies
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: ecommerce-network-policy
  namespace: ecommerce
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ecommerce
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: ecommerce
```

### Pod Security Policy
```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: ecommerce-psp
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'persistentVolumeClaim'
  runAsUser:
    rule: 'MustRunAsNonRoot'
  seLinux:
    rule: 'RunAsAny'
  fsGroup:
    rule: 'RunAsAny'
```

## 🔧 Scaling Configuration

### Horizontal Pod Autoscaler
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: service-name-hpa
  namespace: ecommerce
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: service-name
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Vertical Pod Autoscaler
```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: service-name-vpa
  namespace: ecommerce
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: service-name
  updatePolicy:
    updateMode: "Auto"
  resourcePolicy:
    containerPolicies:
    - containerName: service-name
      maxAllowed:
        cpu: 1
        memory: 2Gi
      minAllowed:
        cpu: 100m
        memory: 128Mi
```

## 🚀 Deployment Strategies

### Rolling Update
```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 25%
      maxSurge: 25%
```

### Blue-Green Deployment
```yaml
# Use labels and services to switch traffic
# Blue deployment: version=blue
# Green deployment: version=green
# Service selector switches between versions
```

### Canary Deployment
```yaml
# Use Istio or similar service mesh
# Route percentage of traffic to new version
# Monitor metrics and gradually increase traffic
```

## 🔍 Troubleshooting

### Common Commands
```bash
# Check pod status
kubectl get pods -n ecommerce

# View pod logs
kubectl logs -f deployment/service-name -n ecommerce

# Describe pod for events
kubectl describe pod pod-name -n ecommerce

# Execute into pod
kubectl exec -it pod-name -n ecommerce -- /bin/bash

# Port forward for debugging
kubectl port-forward service/service-name 8080:80 -n ecommerce

# Check resource usage
kubectl top pods -n ecommerce
kubectl top nodes
```

### Health Checks
```bash
# Check all services health
kubectl get endpoints -n ecommerce

# Test service connectivity
kubectl run test-pod --image=curlimages/curl -it --rm -- /bin/sh
```

## 📝 Best Practices

1. **Resource Limits**: Always set resource requests and limits
2. **Health Checks**: Implement liveness and readiness probes
3. **Security**: Use non-root containers and security contexts
4. **Secrets**: Never store secrets in plain text
5. **Monitoring**: Add Prometheus metrics to all services
6. **Logging**: Use structured logging with correlation IDs
7. **Backup**: Regular database backups
8. **Updates**: Use rolling updates for zero-downtime deployments

## 📄 License

This Kubernetes configuration is part of the E-Commerce Microservices Platform and is licensed under the MIT License.
