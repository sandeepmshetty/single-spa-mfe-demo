# 🚀 Quick Start: Free Infrastructure Setup

**Goal**: Get your MFE running with 100% free, open-source infrastructure in under 30 minutes.

---

## 📋 Prerequisites

- ✅ Docker & Docker Compose installed
- ✅ Node.js 18+ installed
- ✅ Git installed
- ✅ 4GB+ RAM available

---

## ⚡ Quick Start (Local Development)

### **Step 1: Start All Free Services** (5 minutes)

```bash
# 1. Clone repository (if not already done)
git clone https://github.com/sandeepmshetty/single-spa-mfe-demo.git
cd single-spa-mfe-demo

# 2. Create environment file
cat > .env << 'EOF'
POSTGRES_PASSWORD=mfe_secure_password
KEYCLOAK_ADMIN_PASSWORD=admin123
GLITCHTIP_SECRET_KEY=change-this-to-random-string-min-50-chars-long
GLITCHTIP_DOMAIN=http://localhost:8000
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=admin123
UNLEASH_ADMIN_TOKEN=*:*.unleash-admin-token-change-me
UNLEASH_CLIENT_TOKEN=*:development.unleash-client-token-change-me
EOF

# 3. Start the free infrastructure stack
npm run free-stack:start

# 4. Wait for services to initialize (about 2 minutes)
echo "⏳ Waiting for services to be ready..."
sleep 120

# 5. Check service health
docker-compose -f docker-compose.free-stack.yml ps
```

**Services Now Running**:
- 🔐 **Keycloak** (Auth): http://localhost:8080
- 🐛 **GlitchTip** (Errors): http://localhost:8000
- 📊 **Grafana** (Dashboards): http://localhost:3000
- 📈 **Prometheus** (Metrics): http://localhost:9090
- 🚩 **Unleash** (Feature Flags): http://localhost:4242
- 🗄️ **PostgreSQL** (Database): localhost:5432
- 🔍 **SonarQube** (Code Quality): http://localhost:9099

---

### **Step 2: Install Dependencies** (3 minutes)

```bash
# Install root dependencies
npm install

# Install all MFE dependencies
npm run install:all
```

---

### **Step 3: Build Shared Library** (1 minute)

```bash
cd packages/shared-library
npm run build
cd ../..
```

---

### **Step 4: Start MFEs** (2 minutes)

```bash
# Start all MFEs in development mode
npm run dev
```

This starts:
- Shell App: http://localhost:9000
- React MFE: http://localhost:3001
- Vue MFE: http://localhost:3002
- Angular MFE: http://localhost:3003
- Shared Library: http://localhost:3004

---

### **Step 5: Access Your Application** ✅

Open browser: **http://localhost:9000**

---

## 🌐 Cloud Deployment (Oracle Free Tier)

### **Option A: Automatic Script** (Recommended)

```bash
# 1. Sign up for Oracle Cloud Free Tier
# Visit: https://www.oracle.com/cloud/free/

# 2. Create a VM (Ubuntu 22.04)
# VM.Standard.E2.1.Micro (1 core, 1GB RAM, Always Free)

# 3. SSH into your VM
ssh -i ~/.ssh/oracle_key ubuntu@<your-vm-ip>

# 4. Run deployment script
curl -fsSL https://raw.githubusercontent.com/sandeepmshetty/single-spa-mfe-demo/master/scripts/deploy-oracle-cloud.sh | bash
```

### **Option B: Manual Setup** (15 minutes)

```bash
# === On Oracle Cloud VM ===

# 1. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# 2. Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 3. Clone repository
git clone https://github.com/sandeepmshetty/single-spa-mfe-demo.git
cd single-spa-mfe-demo

# 4. Configure environment
cp .env.example .env
nano .env  # Update with secure passwords

# 5. Start services
docker-compose -f docker-compose.free-stack.yml up -d

# 6. Configure firewall
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 8080 -j ACCEPT
sudo netfilter-persistent save

# 7. Install Nginx for reverse proxy
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx -y

# 8. Configure domain (replace yourdomain.com)
sudo nano /etc/nginx/sites-available/mfe-app
# Copy config from monitoring/nginx.conf

sudo ln -s /etc/nginx/sites-available/mfe-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 9. Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🎯 Deploy MFEs to Cloudflare Pages

### **Setup** (One-time, 5 minutes)

```bash
# 1. Install Wrangler CLI
npm install -g wrangler

# 2. Login to Cloudflare
wrangler login

# 3. Create projects (do this once for each MFE)
wrangler pages project create mfe-shell
wrangler pages project create mfe-react
wrangler pages project create mfe-vue
wrangler pages project create mfe-angular
wrangler pages project create mfe-shared
```

### **Deploy** (2 minutes)

```bash
# Deploy all MFEs to production
npm run cloudflare:deploy

# Or deploy preview
npm run cloudflare:preview
```

**Your MFEs are now live at**:
- https://mfe-shell.pages.dev
- https://mfe-react.pages.dev
- https://mfe-vue.pages.dev
- https://mfe-angular.pages.dev
- https://mfe-shared.pages.dev

---

## 🔧 Configuration

### **1. Configure Keycloak (Auth)**

```bash
# Access Keycloak admin
open http://localhost:8080

# Login: admin / admin123 (from .env)

# Create realm:
1. Click "Create Realm"
2. Realm name: "mfe-app"
3. Enable: Yes
4. Save

# Create client:
1. Clients > Create client
2. Client ID: "mfe-frontend"
3. Client authentication: OFF (public client)
4. Valid redirect URIs: 
   - http://localhost:9000/*
   - https://mfe-shell.pages.dev/*
5. Web origins: +
6. Save

# Get realm endpoint:
# http://localhost:8080/realms/mfe-app
```

**Update MFE config**:
```typescript
// packages/shared-library/src/auth/config.ts
export const keycloakConfig = {
  url: 'http://localhost:8080',
  realm: 'mfe-app',
  clientId: 'mfe-frontend',
};
```

---

### **2. Configure GlitchTip (Error Tracking)**

```bash
# Access GlitchTip
open http://localhost:8000

# Create account (first user is admin)
# Email: your-email@example.com
# Password: choose-password

# Create project:
1. Create Organization
2. Create Project > JavaScript
3. Copy DSN from Settings
```

**Update MFE config**:
```typescript
// packages/shared-library/src/monitoring/config.ts
export const glitchTipConfig = {
  dsn: 'http://your-key@localhost:8000/1',
  environment: 'production',
};
```

---

### **3. Configure Grafana (Dashboards)**

```bash
# Access Grafana
open http://localhost:3000

# Login: admin / admin123 (from .env)

# Add data sources (already configured via provisioning):
# - Prometheus: http://prometheus:9090
# - Loki: http://loki:3100

# Import dashboards:
1. Dashboards > Import
2. Upload JSON from monitoring/grafana/dashboards/
3. Select Prometheus data source
4. Import
```

**Pre-built dashboards**:
- MFE Performance Overview
- Error Tracking Dashboard
- System Metrics
- API Metrics

---

### **4. Configure Unleash (Feature Flags)**

```bash
# Access Unleash
open http://localhost:4242

# Login:
# Username: admin
# Password: unleash4all (default)

# Create feature flags:
1. Create > Feature flag
2. Name: "new-dashboard"
3. Description: "New dashboard UI"
4. Enable: Yes
5. Add strategy: Standard
6. Save
```

**Update MFE code**:
```typescript
// packages/shared-library/src/features/config.ts
export const unleashConfig = {
  url: 'http://localhost:4242/api/frontend',
  clientKey: 'your-client-token',
  appName: 'mfe-app',
};
```

---

## 📊 Verify Everything Works

### **Health Check Script**

```bash
#!/bin/bash
# Check all services

echo "🔍 Checking service health..."

services=(
  "http://localhost:5432|PostgreSQL"
  "http://localhost:8080/health/ready|Keycloak"
  "http://localhost:8000/_health/|GlitchTip"
  "http://localhost:3000/api/health|Grafana"
  "http://localhost:9090/-/healthy|Prometheus"
  "http://localhost:4242/health|Unleash"
  "http://localhost:9099/api/system/status|SonarQube"
)

for service in "${services[@]}"; do
  IFS='|' read -r url name <<< "$service"
  if curl -sf "$url" > /dev/null 2>&1; then
    echo "✅ $name is healthy"
  else
    echo "❌ $name is not responding"
  fi
done
```

---

## 🛠️ Troubleshooting

### **Services not starting?**

```bash
# Check logs
npm run free-stack:logs

# Check specific service
docker logs mfe-postgres
docker logs mfe-keycloak
docker logs mfe-glitchtip

# Restart specific service
docker-compose -f docker-compose.free-stack.yml restart keycloak
```

### **Port conflicts?**

```bash
# Check what's using ports
netstat -ano | findstr :8080
netstat -ano | findstr :3000

# Stop conflicting services or change ports in docker-compose.free-stack.yml
```

### **Out of memory?**

```bash
# Check Docker memory
docker stats

# Increase Docker memory (Docker Desktop settings)
# Recommended: 4GB minimum for all services
```

### **Database connection failed?**

```bash
# Wait for PostgreSQL to fully initialize
docker logs mfe-postgres | grep "ready to accept connections"

# Manually test connection
docker exec -it mfe-postgres psql -U mfe_user -d mfe_app -c "SELECT 1;"
```

---

## 🎉 Success Checklist

- [ ] All Docker containers running (11 services)
- [ ] Keycloak admin accessible
- [ ] GlitchTip admin accessible
- [ ] Grafana dashboards visible
- [ ] Prometheus targets UP
- [ ] Unleash accessible
- [ ] PostgreSQL accepting connections
- [ ] All MFEs running locally
- [ ] Shell app loads at http://localhost:9000
- [ ] Can navigate between MFEs
- [ ] No console errors

---

## 📚 Next Steps

1. **Configure Authentication**: [AUTH_SETUP.md](./AUTH_SETUP.md)
2. **Setup Monitoring**: [MONITORING_SETUP.md](./MONITORING_SETUP.md)
3. **Deploy to Production**: [PRODUCTION_DEPLOY.md](./PRODUCTION_DEPLOY.md)
4. **Add Feature Flags**: [FEATURE_FLAGS.md](./FEATURE_FLAGS.md)

---

## 💰 Cost Breakdown

| Service | Monthly Cost |
|---------|-------------|
| Oracle Cloud VM | **$0** (Always Free) |
| Cloudflare Pages | **$0** (Unlimited bandwidth) |
| GitHub Actions | **$0** (2000 min/month free) |
| All Software | **$0** (100% open source) |
| **TOTAL** | **$0/month** 🎉 |

---

## 🆘 Support

- **Documentation**: [docs/](./docs/)
- **Issues**: https://github.com/sandeepmshetty/single-spa-mfe-demo/issues
- **Discussions**: https://github.com/sandeepmshetty/single-spa-mfe-demo/discussions

---

**Time to Production-Ready**: ~4 weeks following the roadmap
**Monthly Cost**: $0 💰
**Industry Standard**: Getting there! 🚀
