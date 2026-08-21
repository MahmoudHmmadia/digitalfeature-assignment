# Deployment

The deployment artifacts use the same three runtime boundaries as local
development: an Nginx-served Angular client, the Express API, and MongoDB as a
single-node replica set. The API is not exposed directly in Kubernetes; Nginx
proxies `/api`, `/api-docs`, and uploaded assets to it.

## Docker Compose

From the repository root:

```bash
cp .env.example .env
docker compose up --build
```

Open `http://localhost:8080`. Swagger is available through the same origin at
`http://localhost:8080/api-docs/`. To seed the administrator after the services
are healthy:

```bash
docker compose exec server bun --cwd /app/server run db:seed
```

Stop the stack with `docker compose down`. Add `--volumes` only when you also
intend to delete the database and uploaded-file volumes.

## Kubernetes

The manifests under `deploy/k8s` are suitable for a local cluster such as kind,
k3d, or minikube. Build the two images and load them into the local cluster:

```bash
docker build -f server/Dockerfile -t feedbackhub-server:local .
docker build -f client/Dockerfile -t feedbackhub-client:local .
```

Create the namespace and runtime Secret before applying the remaining
resources. `secret.example.yaml` shows the required keys; use a real random JWT
secret and do not commit the resulting Secret.

```bash
kubectl apply -f deploy/k8s/namespace.yaml
kubectl create secret generic feedbackhub-secrets \
  --namespace feedbackhub \
  --from-literal=DATABASE_URL='mongodb://mongodb-0.mongodb:27017/feedbackhub?replicaSet=rs0' \
  --from-literal=SECRET='replace-with-a-long-random-value' \
  --from-literal=EMAIL='' \
  --from-literal=PASSWORD='' \
  --from-literal=EMAIL_FORM=''
kubectl apply -k deploy/k8s
kubectl port-forward --namespace feedbackhub service/feedbackhub-client 8080:80
```

For a remote registry, replace both `:local` image values in the Deployments
with immutable registry tags. Replace the example public URL in
`configmap.yaml`, configure TLS/Ingress for the target cluster, use a managed or
properly secured MongoDB deployment, and store secrets in the platform's secret
manager.
