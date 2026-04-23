# RecyGlo Clone - GCP Deployment Guide

This guide provides step-by-step instructions for deploying the RecyGlo clone website to Google Cloud Platform (GCP).

## Prerequisites

- Google Cloud Platform account with billing enabled
- `gcloud` CLI installed and configured
- Node.js and pnpm installed locally (for building)
- Git repository initialized (optional but recommended)

## Deployment Options

### Option 1: Cloud Run (Recommended for Simplicity)

Cloud Run is ideal for this static React application as it provides automatic scaling and minimal configuration.

#### Step 1: Build the Application

```bash
cd /home/ubuntu/recyglo-clone
pnpm install
pnpm build
```

#### Step 2: Create Dockerfile

Create a `Dockerfile` in the project root:

```dockerfile
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy application code
COPY . .

# Build the application
RUN pnpm build

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
```

#### Step 3: Build and Push Docker Image

```bash
# Set your GCP project ID
export PROJECT_ID=your-project-id
export IMAGE_NAME=recyglo-clone

# Build the image
gcloud builds submit --tag gcr.io/$PROJECT_ID/$IMAGE_NAME

# Or build locally and push
docker build -t gcr.io/$PROJECT_ID/$IMAGE_NAME .
docker push gcr.io/$PROJECT_ID/$IMAGE_NAME
```

#### Step 4: Deploy to Cloud Run

```bash
gcloud run deploy recyglo-clone \
  --image gcr.io/$PROJECT_ID/$IMAGE_NAME \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1
```

### Option 2: Firebase Hosting (For Static Content Only)

If you want to serve only the static build output:

#### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

#### Step 2: Initialize Firebase

```bash
cd /home/ubuntu/recyglo-clone
firebase init hosting
```

#### Step 3: Configure firebase.json

```json
{
  "hosting": {
    "public": "dist/public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

#### Step 4: Build and Deploy

```bash
pnpm build
firebase deploy
```

### Option 3: Compute Engine (For More Control)

For a more traditional VM-based deployment:

#### Step 1: Create a Compute Engine Instance

```bash
gcloud compute instances create recyglo-instance \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --machine-type=e2-medium \
  --zone=us-central1-a \
  --tags=http-server,https-server
```

#### Step 2: SSH into the Instance

```bash
gcloud compute ssh recyglo-instance --zone=us-central1-a
```

#### Step 3: Install Dependencies

```bash
sudo apt update
sudo apt install -y nodejs npm
npm install -g pnpm
```

#### Step 4: Clone and Deploy

```bash
git clone <your-repo-url> recyglo-clone
cd recyglo-clone
pnpm install
pnpm build
pnpm start
```

#### Step 5: Configure Firewall Rules

```bash
gcloud compute firewall-rules create allow-http \
  --allow=tcp:80,tcp:443 \
  --source-ranges=0.0.0.0/0 \
  --target-tags=http-server,https-server
```

## Environment Configuration

### Required Environment Variables

Create a `.env.production` file:

```env
NODE_ENV=production
PORT=3000
VITE_APP_TITLE=RecyGlo
VITE_APP_LOGO=https://your-domain.com/logo.png
```

### Cloud Run with Environment Variables

```bash
gcloud run deploy recyglo-clone \
  --image gcr.io/$PROJECT_ID/$IMAGE_NAME \
  --set-env-vars="NODE_ENV=production,PORT=3000"
```

## Custom Domain Setup

### For Cloud Run:

```bash
gcloud run domain-mappings create \
  --service=recyglo-clone \
  --domain=your-domain.com \
  --region=us-central1
```

### For Firebase Hosting:

1. Go to Firebase Console > Hosting > Connect domain
2. Follow the DNS configuration steps
3. Add your domain and verify ownership

## SSL/TLS Certificate

Both Cloud Run and Firebase Hosting automatically provide SSL certificates. For Compute Engine:

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot certonly --standalone -d your-domain.com

# Configure Nginx to use the certificate
```

## Monitoring and Logging

### Cloud Run Logs

```bash
gcloud run logs read recyglo-clone --limit 50
```

### Real-time Logs

```bash
gcloud alpha run logs read recyglo-clone --limit 50 --follow
```

### View Metrics

```bash
gcloud monitoring dashboards create --config-from-file=dashboard.yaml
```

## Performance Optimization

### Enable Caching

For Cloud Run, add cache headers in the server configuration:

```typescript
app.use((req, res, next) => {
  if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2)$/)) {
    res.set('Cache-Control', 'public, max-age=31536000');
  } else {
    res.set('Cache-Control', 'public, max-age=3600');
  }
  next();
});
```

### Use Cloud CDN

```bash
gcloud compute backend-services create recyglo-backend \
  --enable-cdn \
  --protocol=HTTP \
  --global
```

## Scaling Configuration

### Cloud Run Autoscaling

```bash
gcloud run services update recyglo-clone \
  --max-instances=100 \
  --min-instances=1 \
  --region=us-central1
```

## Database Connection (if needed in future)

For Cloud SQL connections:

```bash
gcloud run deploy recyglo-clone \
  --add-cloudsql-instances=$PROJECT_ID:us-central1:recyglo-db \
  --set-env-vars="DATABASE_URL=cloudsql://$PROJECT_ID:us-central1:recyglo-db"
```

## Backup and Disaster Recovery

### Backup Source Code

```bash
gsutil mb gs://recyglo-backups
gsutil -m cp -r . gs://recyglo-backups/
```

### Automated Backups

Use Cloud Build to trigger automated deployments:

```bash
gcloud builds submit --config=cloudbuild.yaml
```

## Cost Optimization

- **Cloud Run**: Pay only for requests and compute time
- **Firebase Hosting**: Free tier includes 10GB storage and 360MB/day transfer
- **Compute Engine**: Use preemptible instances for non-critical workloads
- **Cloud CDN**: Reduces origin bandwidth costs

## Troubleshooting

### Application won't start

```bash
# Check logs
gcloud run logs read recyglo-clone --limit 100

# Check environment variables
gcloud run services describe recyglo-clone
```

### High latency

- Enable Cloud CDN
- Increase instance memory
- Check database connection pooling
- Review application code for bottlenecks

### Build failures

```bash
# Check build logs
gcloud builds log <BUILD_ID>

# Rebuild with verbose output
gcloud builds submit --config=cloudbuild.yaml --verbosity=debug
```

## Next Steps

1. Set up monitoring and alerting
2. Configure automated deployments via Cloud Build
3. Implement CI/CD pipeline
4. Set up backup and disaster recovery
5. Monitor costs and optimize resources

## Support

For GCP-specific issues, refer to:
- [Google Cloud Documentation](https://cloud.google.com/docs)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
