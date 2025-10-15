# 🆓 100% Open Source & Free Infrastructure Plan

**Last Updated**: October 15, 2025  
**Goal**: Production-ready MFE with ZERO paid services

---

## 📋 Current Status: Mixed (Some Paid Dependencies)

| Service | Current | Free Tier Limits | Recommended Free Alternative |
|---------|---------|------------------|------------------------------|
| Hosting | Vercel | Limited bandwidth | **Cloudflare Pages** (Unlimited) |
| Error Tracking | Sentry | 5K errors/month | **GlitchTip** (Self-hosted) or **Sentry Self-hosted** |
| Database | Supabase | 500MB, 2GB bandwidth | **PostgreSQL** (Self-hosted) |
| Auth | Supabase Auth | 50K MAU | **Keycloak** (Self-hosted) |
| Monitoring | Planned: DataDog | N/A | **Grafana + Prometheus** (Open source) |
| Code Quality | SonarQube | ✅ Already open source | Keep it! |
| CI/CD | GitHub Actions | ✅ 2000 min/month free | Keep it! |

---

## 🎯 Recommended 100% Free Stack

### **Tier 1: Free Hosting (No Credit Card)**

#### Option A: **Cloudflare Pages** (Recommended)
```yaml
Pros:
  - ✅ Unlimited bandwidth
  - ✅ Unlimited builds
  - ✅ 500 builds/month
  - ✅ Built-in CDN (200+ locations)
  - ✅ Automatic SSL
  - ✅ Edge functions (Workers) - 100K requests/day

Limits:
  - 20K files per deployment
  - 25MB per file
  - 500 deployments/month

Setup:
  1. Connect GitHub repo
  2. Configure build: npm run build
  3. Output directory: dist
  4. Deploy!
```

**Migration Script**:
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy each MFE
cd packages/shell-app
npm run build
wrangler pages publish dist --project-name=mfe-shell

cd ../react-mfe
npm run build
wrangler pages publish dist --project-name=mfe-react

cd ../vue-mfe
npm run build
wrangler pages publish dist --project-name=mfe-vue

cd ../angular-mfe
npm run build
wrangler pages publish dist --project-name=mfe-angular
```

#### Option B: **Netlify**
```yaml
Pros:
  - ✅ 100GB bandwidth/month
  - ✅ 300 build minutes/month
  - ✅ Edge functions
  - ✅ Form handling

Limits:
  - Bandwidth cap (100GB)
```

#### Option C: **GitHub Pages + Cloudflare CDN**
```yaml
Pros:
  - ✅ Completely free
  - ✅ Unlimited bandwidth
  - ✅ Pair with Cloudflare for CDN

Limits:
  - Static sites only
  - No serverless functions
```

---

### **Tier 2: Self-Hosted on Free Cloud (Oracle, Fly.io)**

#### **Oracle Cloud (Always Free Tier)**
```yaml
What You Get:
  - ✅ 2 AMD Compute VMs (1GB RAM each)
  - ✅ 4 ARM Ampere A1 cores + 24GB RAM
  - ✅ 200GB block storage
  - ✅ 10TB bandwidth/month
  - ✅ Load balancer
  - ✅ FOREVER FREE (no credit card expiry)

Perfect for:
  - Self-hosted PostgreSQL
  - Self-hosted Keycloak
  - Self-hosted GlitchTip
  - Self-hosted Grafana/Prometheus
```

**Setup Guide**:
```bash
# 1. Sign up at https://cloud.oracle.com
# 2. Create VM.Standard.E2.1.Micro instance
# 3. SSH into instance
# 4. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 5. Deploy stack
docker-compose -f docker-compose.free-stack.yml up -d
```

#### **Fly.io** (Alternative)
```yaml
Free Tier:
  - ✅ 3 shared VMs (256MB RAM each)
  - ✅ 160GB bandwidth/month
  - ✅ Automatic SSL
  - ✅ Global deployment

Perfect for:
  - Serverless functions
  - API backends
```

---

## 🔧 Component-by-Component Free Setup

### 1. **Hosting & CDN** → Cloudflare Pages

**Per MFE Configuration** (`cloudflare-pages.yaml`):
```yaml
# packages/shell-app/cloudflare-pages.yaml
build:
  command: npm run build
  output: dist
  environment:
    NODE_VERSION: 18

routes:
  - route: /*
    cache: true
    ttl: 3600

functions:
  - name: health
    path: /api/health
```

**Deployment Command**:
```json
// Add to package.json
{
  "scripts": {
    "deploy:cloudflare": "wrangler pages publish dist --project-name=mfe-shell",
    "deploy:all:cloudflare": "node scripts/deploy-cloudflare.js"
  }
}
```

---

### 2. **Error Tracking** → GlitchTip (Self-hosted Sentry Alternative)

**Docker Compose**:
```yaml
# docker-compose.glitchtip.yml
version: '3.8'

services:
  glitchtip-postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: glitchtip
      POSTGRES_USER: glitchtip
      POSTGRES_PASSWORD: change-me
    volumes:
      - glitchtip-postgres:/var/lib/postgresql/data
    restart: unless-stopped

  glitchtip-redis:
    image: redis:7-alpine
    restart: unless-stopped

  glitchtip-web:
    image: glitchtip/glitchtip:latest
    depends_on:
      - glitchtip-postgres
      - glitchtip-redis
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgres://glitchtip:change-me@glitchtip-postgres:5432/glitchtip
      REDIS_URL: redis://glitchtip-redis:6379
      SECRET_KEY: your-secret-key-here
      EMAIL_URL: smtp://localhost:25
      GLITCHTIP_DOMAIN: https://glitchtip.yourdomain.com
    restart: unless-stopped

  glitchtip-worker:
    image: glitchtip/glitchtip:latest
    depends_on:
      - glitchtip-postgres
      - glitchtip-redis
    environment:
      DATABASE_URL: postgres://glitchtip:change-me@glitchtip-postgres:5432/glitchtip
      REDIS_URL: redis://glitchtip-redis:6379
      SECRET_KEY: your-secret-key-here
    command: ./bin/run-celery-with-beat.sh
    restart: unless-stopped

volumes:
  glitchtip-postgres:
```

**Integration Code**:
```typescript
// packages/shared-library/src/monitoring/GlitchTipIntegration.ts
import * as Sentry from '@sentry/browser'; // GlitchTip is Sentry-compatible!

export class GlitchTipIntegration {
  init(dsn: string) {
    Sentry.init({
      dsn: dsn, // Your self-hosted GlitchTip URL
      environment: process.env.NODE_ENV,
      tracesSampleRate: 1.0,
    });
  }

  captureError(error: Error, context?: any) {
    Sentry.captureException(error, { extra: context });
  }
}
```

**Environment Variables**:
```bash
# .env
GLITCHTIP_DSN=https://your-key@glitchtip.yourdomain.com/1
```

---

### 3. **Authentication** → Keycloak (Open Source IAM)

**Docker Compose**:
```yaml
# docker-compose.keycloak.yml
version: '3.8'

services:
  keycloak-postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: keycloak
      POSTGRES_USER: keycloak
      POSTGRES_PASSWORD: change-me
    volumes:
      - keycloak-postgres:/var/lib/postgresql/data
    restart: unless-stopped

  keycloak:
    image: quay.io/keycloak/keycloak:23.0
    command: start-dev
    environment:
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://keycloak-postgres:5432/keycloak
      KC_DB_USERNAME: keycloak
      KC_DB_PASSWORD: change-me
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: change-me
      KC_HOSTNAME: localhost
      KC_HTTP_ENABLED: true
    ports:
      - "8080:8080"
    depends_on:
      - keycloak-postgres
    restart: unless-stopped

volumes:
  keycloak-postgres:
```

**Integration**:
```typescript
// packages/shared-library/src/auth/KeycloakAuth.ts
import Keycloak from 'keycloak-js';

export class KeycloakAuthManager {
  private keycloak: Keycloak;

  constructor(config: { url: string; realm: string; clientId: string }) {
    this.keycloak = new Keycloak({
      url: config.url,
      realm: config.realm,
      clientId: config.clientId,
    });
  }

  async init(): Promise<boolean> {
    return await this.keycloak.init({
      onLoad: 'check-sso',
      checkLoginIframe: false,
    });
  }

  login(): void {
    this.keycloak.login();
  }

  logout(): void {
    this.keycloak.logout();
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }

  isAuthenticated(): boolean {
    return this.keycloak.authenticated ?? false;
  }
}
```

**Package Installation**:
```bash
npm install keycloak-js
```

---

### 4. **Monitoring** → Grafana + Prometheus + Loki

**Docker Compose**:
```yaml
# docker-compose.monitoring.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    ports:
      - "9090:9090"
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
    restart: unless-stopped

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false
    volumes:
      - grafana-data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./monitoring/grafana/datasources:/etc/grafana/provisioning/datasources
    depends_on:
      - prometheus
    restart: unless-stopped

  loki:
    image: grafana/loki:latest
    ports:
      - "3100:3100"
    volumes:
      - ./monitoring/loki-config.yml:/etc/loki/local-config.yaml
      - loki-data:/loki
    command: -config.file=/etc/loki/local-config.yaml
    restart: unless-stopped

  promtail:
    image: grafana/promtail:latest
    volumes:
      - /var/log:/var/log
      - ./monitoring/promtail-config.yml:/etc/promtail/config.yml
    command: -config.file=/etc/promtail/config.yml
    restart: unless-stopped

  node-exporter:
    image: prom/node-exporter:latest
    ports:
      - "9100:9100"
    restart: unless-stopped

volumes:
  prometheus-data:
  grafana-data:
  loki-data:
```

**Prometheus Config** (`monitoring/prometheus.yml`):
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'mfe-apps'
    static_configs:
      - targets: ['mfe-shell:9000', 'mfe-react:3001', 'mfe-vue:3002']
```

**Web Vitals Integration**:
```typescript
// packages/shared-library/src/monitoring/PrometheusMetrics.ts
export class PrometheusMetrics {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async sendMetric(name: string, value: number, labels: Record<string, string> = {}) {
    const metric = `${name}{${this.formatLabels(labels)}} ${value}`;
    
    try {
      await fetch(`${this.endpoint}/metrics`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: metric,
      });
    } catch (error) {
      console.error('Failed to send metric:', error);
    }
  }

  private formatLabels(labels: Record<string, string>): string {
    return Object.entries(labels)
      .map(([key, value]) => `${key}="${value}"`)
      .join(',');
  }
}
```

---

### 5. **Database** → PostgreSQL (Self-hosted)

**Docker Compose**:
```yaml
# docker-compose.postgres.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: mfe_app
      POSTGRES_USER: mfe_user
      POSTGRES_PASSWORD: change-me
      POSTGRES_INITDB_ARGS: "-E UTF8"
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init-db.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped

  pgadmin:
    image: dpage/pgadmin4:latest
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    depends_on:
      - postgres
    restart: unless-stopped

volumes:
  postgres-data:
```

**Database Schema** (`init-db.sql`):
```sql
-- Error logs table
CREATE TABLE IF NOT EXISTS error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  stack TEXT,
  source TEXT NOT NULL,
  severity VARCHAR(20) NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_id VARCHAR(255),
  metadata JSONB,
  resolved BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_error_logs_timestamp ON error_logs(timestamp DESC);
CREATE INDEX idx_error_logs_severity ON error_logs(severity);
CREATE INDEX idx_error_logs_source ON error_logs(source);

-- Performance metrics table
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name VARCHAR(100) NOT NULL,
  value NUMERIC NOT NULL,
  source VARCHAR(100) NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  labels JSONB
);

CREATE INDEX idx_performance_timestamp ON performance_metrics(timestamp DESC);
CREATE INDEX idx_performance_metric_name ON performance_metrics(metric_name);

-- User sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  token TEXT NOT NULL,
  refresh_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  last_activity TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON user_sessions(expires_at);
```

---

### 6. **Feature Flags** → Unleash (Open Source)

**Docker Compose**:
```yaml
# docker-compose.unleash.yml
version: '3.8'

services:
  unleash-postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: unleash
      POSTGRES_USER: unleash
      POSTGRES_PASSWORD: change-me
    volumes:
      - unleash-postgres:/var/lib/postgresql/data
    restart: unless-stopped

  unleash:
    image: unleashorg/unleash-server:latest
    ports:
      - "4242:4242"
    environment:
      DATABASE_URL: postgres://unleash:change-me@unleash-postgres:5432/unleash
      DATABASE_SSL: "false"
      LOG_LEVEL: info
      INIT_ADMIN_API_TOKENS: "*:*.unleash-insecure-admin-api-token"
      INIT_CLIENT_API_TOKENS: "*:development.unleash-insecure-client-api-token"
    depends_on:
      - unleash-postgres
    restart: unless-stopped

volumes:
  unleash-postgres:
```

**Integration**:
```typescript
// packages/shared-library/src/features/UnleashFeatureFlags.ts
import { UnleashClient } from 'unleash-proxy-client';

export class FeatureFlagManager {
  private client: UnleashClient;

  constructor(url: string, clientKey: string, appName: string) {
    this.client = new UnleashClient({
      url,
      clientKey,
      appName,
      refreshInterval: 30,
    });
  }

  async start(): Promise<void> {
    await this.client.start();
  }

  isEnabled(featureName: string): boolean {
    return this.client.isEnabled(featureName);
  }

  getVariant(featureName: string): any {
    return this.client.getVariant(featureName);
  }
}
```

---

## 🐳 Master Docker Compose (All Free Services)

**File**: `docker-compose.free-stack.yml`

```yaml
version: '3.8'

services:
  # PostgreSQL (Main Database)
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: mfe_app
      POSTGRES_USER: mfe_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-changeme}
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init-db.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped
    networks:
      - mfe-network

  # Keycloak (Authentication)
  keycloak:
    image: quay.io/keycloak/keycloak:23.0
    command: start-dev
    environment:
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres:5432/keycloak
      KC_DB_USERNAME: mfe_user
      KC_DB_PASSWORD: ${POSTGRES_PASSWORD:-changeme}
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: ${KEYCLOAK_ADMIN_PASSWORD:-admin}
      KC_HTTP_ENABLED: true
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    restart: unless-stopped
    networks:
      - mfe-network

  # GlitchTip (Error Tracking)
  glitchtip-redis:
    image: redis:7-alpine
    restart: unless-stopped
    networks:
      - mfe-network

  glitchtip-web:
    image: glitchtip/glitchtip:latest
    depends_on:
      - postgres
      - glitchtip-redis
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgres://mfe_user:${POSTGRES_PASSWORD:-changeme}@postgres:5432/glitchtip
      REDIS_URL: redis://glitchtip-redis:6379
      SECRET_KEY: ${GLITCHTIP_SECRET_KEY:-your-secret-key}
      GLITCHTIP_DOMAIN: ${GLITCHTIP_DOMAIN:-http://localhost:8000}
    restart: unless-stopped
    networks:
      - mfe-network

  # Prometheus (Metrics)
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    ports:
      - "9090:9090"
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
    restart: unless-stopped
    networks:
      - mfe-network

  # Grafana (Dashboards)
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=${GRAFANA_ADMIN_USER:-admin}
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_ADMIN_PASSWORD:-admin}
      - GF_USERS_ALLOW_SIGN_UP=false
    volumes:
      - grafana-data:/var/lib/grafana
      - ./monitoring/grafana:/etc/grafana/provisioning
    depends_on:
      - prometheus
    restart: unless-stopped
    networks:
      - mfe-network

  # Loki (Logs)
  loki:
    image: grafana/loki:latest
    ports:
      - "3100:3100"
    volumes:
      - ./monitoring/loki-config.yml:/etc/loki/local-config.yaml
      - loki-data:/loki
    command: -config.file=/etc/loki/local-config.yaml
    restart: unless-stopped
    networks:
      - mfe-network

  # Unleash (Feature Flags)
  unleash:
    image: unleashorg/unleash-server:latest
    ports:
      - "4242:4242"
    environment:
      DATABASE_URL: postgres://mfe_user:${POSTGRES_PASSWORD:-changeme}@postgres:5432/unleash
      DATABASE_SSL: "false"
      LOG_LEVEL: info
    depends_on:
      - postgres
    restart: unless-stopped
    networks:
      - mfe-network

  # SonarQube (Code Quality - Already in your stack!)
  sonarqube:
    image: sonarqube:community
    ports:
      - "9099:9000"
    environment:
      SONAR_JDBC_URL: jdbc:postgresql://postgres:5432/sonarqube
      SONAR_JDBC_USERNAME: mfe_user
      SONAR_JDBC_PASSWORD: ${POSTGRES_PASSWORD:-changeme}
    volumes:
      - sonarqube-data:/opt/sonarqube/data
      - sonarqube-extensions:/opt/sonarqube/extensions
      - sonarqube-logs:/opt/sonarqube/logs
    depends_on:
      - postgres
    restart: unless-stopped
    networks:
      - mfe-network

volumes:
  postgres-data:
  prometheus-data:
  grafana-data:
  loki-data:
  sonarqube-data:
  sonarqube-extensions:
  sonarqube-logs:

networks:
  mfe-network:
    driver: bridge
```

---

## 🚀 Quick Start Commands

### **Start All Free Services**:
```bash
# 1. Create environment file
cat > .env << EOF
POSTGRES_PASSWORD=your-secure-password
KEYCLOAK_ADMIN_PASSWORD=your-keycloak-password
GLITCHTIP_SECRET_KEY=your-glitchtip-secret
GLITCHTIP_DOMAIN=http://localhost:8000
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=your-grafana-password
EOF

# 2. Start the stack
docker-compose -f docker-compose.free-stack.yml up -d

# 3. Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# 4. Access services:
# - Keycloak: http://localhost:8080
# - GlitchTip: http://localhost:8000
# - Grafana: http://localhost:3000
# - Prometheus: http://localhost:9090
# - Unleash: http://localhost:4242
# - SonarQube: http://localhost:9099
```

### **Deploy to Oracle Cloud Free Tier**:
```bash
# 1. SSH into Oracle Cloud VM
ssh -i ~/.ssh/oracle_key ubuntu@your-vm-ip

# 2. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 3. Clone repo
git clone https://github.com/sandeepmshetty/single-spa-mfe-demo.git
cd single-spa-mfe-demo

# 4. Configure environment
cp .env.example .env
nano .env  # Edit with your values

# 5. Start services
docker-compose -f docker-compose.free-stack.yml up -d

# 6. Configure firewall (Oracle Cloud)
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 8080 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 8000 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3000 -j ACCEPT
sudo netfilter-persistent save
```

---

## 📊 Cost Comparison

| Service | Paid Option | Cost | Free Option | Cost |
|---------|------------|------|-------------|------|
| Hosting | Vercel Pro | $20/mo | Cloudflare Pages | $0 |
| Error Tracking | Sentry Team | $26/mo | GlitchTip (self-hosted) | $0 |
| Auth | Auth0 | $23/mo | Keycloak (self-hosted) | $0 |
| Monitoring | DataDog | $15/host/mo | Grafana + Prometheus | $0 |
| Database | Supabase Pro | $25/mo | PostgreSQL (self-hosted) | $0 |
| Feature Flags | LaunchDarkly | $10/mo | Unleash (self-hosted) | $0 |
| **TOTAL** | | **$119/mo** | **Oracle Free Tier** | **$0/mo** |

**Annual Savings**: $1,428 💰

---

## 🎯 Migration Checklist

### Phase 1: Infrastructure Setup (Week 1)
- [ ] Sign up for Oracle Cloud Free Tier
- [ ] Sign up for Cloudflare account
- [ ] Create VM on Oracle Cloud
- [ ] Install Docker on VM
- [ ] Deploy `docker-compose.free-stack.yml`
- [ ] Configure domain with Cloudflare
- [ ] Setup SSL certificates (Let's Encrypt)

### Phase 2: Service Configuration (Week 2)
- [ ] Configure Keycloak realm and clients
- [ ] Setup GlitchTip project
- [ ] Configure Grafana dashboards
- [ ] Setup Prometheus targets
- [ ] Initialize PostgreSQL schemas
- [ ] Configure Unleash feature flags

### Phase 3: Application Integration (Week 3)
- [ ] Replace Sentry with GlitchTip in code
- [ ] Replace Supabase Auth with Keycloak
- [ ] Add Prometheus metrics to MFEs
- [ ] Integrate Unleash feature flags
- [ ] Update environment variables
- [ ] Test all integrations locally

### Phase 4: Deployment (Week 4)
- [ ] Deploy to Cloudflare Pages
- [ ] Configure Cloudflare Workers for APIs
- [ ] Setup monitoring alerts
- [ ] Configure backup strategy
- [ ] Load testing
- [ ] Go live!

---

## 🔒 Security Considerations

### **Free SSL/TLS**:
```bash
# Install Certbot (Let's Encrypt)
sudo apt-get install certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (cron job)
0 0 * * * certbot renew --quiet
```

### **Nginx Reverse Proxy** (for Oracle Cloud):
```nginx
# /etc/nginx/sites-available/mfe-app
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Keycloak
    location /auth {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # GlitchTip
    location /errors {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Grafana
    location /monitoring {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Unleash
    location /flags {
        proxy_pass http://localhost:4242;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 📝 Summary

**You can run a production-ready MFE with:**
- ✅ Oracle Cloud Free Tier (VM, networking, storage)
- ✅ Cloudflare Pages (hosting, CDN, SSL)
- ✅ 100% open-source software (Keycloak, GlitchTip, Grafana, PostgreSQL)
- ✅ GitHub Actions (CI/CD - 2000 free minutes/month)

**Total Monthly Cost: $0** 🎉

**Total Setup Time: ~4 weeks (following checklist)**

---

## 📚 Additional Resources

- [Oracle Cloud Free Tier Guide](https://www.oracle.com/cloud/free/)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [GlitchTip Setup Guide](https://glitchtip.com/documentation)
- [Grafana Tutorials](https://grafana.com/tutorials/)
- [Unleash Documentation](https://docs.getunleash.io/)

---

**Next Steps**: See [FREE_STACK_DEPLOYMENT.md](./FREE_STACK_DEPLOYMENT.md) for detailed deployment guide.
