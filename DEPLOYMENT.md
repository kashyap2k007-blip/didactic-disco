# 🚀 Medical Admissions Platform - Deployment Guide

This guide provides detailed instructions for deploying the Medical Admissions Platform to various hosting providers.

## 📋 Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **Git** for version control
- **Domain name** (recommended: medicaladmissions.in)
- **SSL certificate** (usually provided by hosting provider)

## 🛠 Local Development Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-org/medical-admissions-platform.git
cd medical-admissions-platform

# Install dependencies
npm install

# Install additional Tailwind plugins
npm install @tailwindcss/forms @tailwindcss/typography @tailwindcss/aspect-ratio
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
# .env
VITE_APP_NAME="Medical Admissions Platform"
VITE_APP_URL="https://medicaladmissions.in"
VITE_API_URL="https://api.medicaladmissions.in"
VITE_GOOGLE_ANALYTICS_ID=""
VITE_SENTRY_DSN=""
NODE_ENV="production"
```

### 3. Data Processing

```bash
# Process college data (requires CSV files)
npm run process-data

# Validate processed data
npm run validate
```

### 4. Development Server

```bash
# Start development server
npm run dev

# The app will be available at http://localhost:3000
```

### 5. Production Build

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides excellent performance, automatic deployments, and global CDN.

#### Setup Steps:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Configure Domain:**
   - Go to Vercel Dashboard
   - Add custom domain: `medicaladmissions.in`
   - Configure DNS records as instructed

#### Vercel Configuration (`vercel.json`):

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/manifest.json",
      "headers": {
        "Content-Type": "application/manifest+json"
      }
    },
    {
      "src": "/service-worker.js",
      "headers": {
        "Cache-Control": "public, max-age=0, must-revalidate"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
```

### Option 2: Netlify

Netlify offers great performance and easy deployment.

#### Setup Steps:

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

#### Netlify Configuration (`netlify.toml`):

```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"

[[headers]]
  for = "/manifest.json"
  [headers.values]
    Content-Type = "application/manifest+json"

[[headers]]
  for = "/service-worker.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: Cloudflare Pages

Cloudflare Pages provides excellent global performance.

#### Setup Steps:

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload to Cloudflare Pages:**
   - Go to Cloudflare Dashboard
   - Navigate to Pages
   - Create new project
   - Upload `dist` folder

#### Cloudflare Configuration:

```yaml
# _headers file in dist folder
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/manifest.json
  Content-Type: application/manifest+json

/service-worker.js
  Cache-Control: public, max-age=0, must-revalidate
```

### Option 4: Traditional Web Server (Apache/Nginx)

#### Apache Configuration:

```apache
# .htaccess file in dist folder
RewriteEngine On
RewriteBase /

# Handle PWA files
RewriteRule ^manifest\.json$ - [L]
RewriteRule ^service-worker\.js$ - [L]

# Handle static assets
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"

# Cache static assets
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
    Header set Cache-Control "public, immutable"
</FilesMatch>
```

#### Nginx Configuration:

```nginx
server {
    listen 80;
    server_name medicaladmissions.in www.medicaladmissions.in;
    root /var/www/medicaladmissions/dist;
    index index.html;

    # Security headers
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options DENY always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    # Handle PWA files
    location = /manifest.json {
        add_header Content-Type application/manifest+json;
    }

    location = /service-worker.js {
        add_header Cache-Control "public, max-age=0, must-revalidate";
    }

    # Cache static assets
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔧 Post-Deployment Configuration

### 1. SSL Certificate

Ensure your domain has a valid SSL certificate:

```bash
# Check SSL certificate
curl -I https://medicaladmissions.in
```

### 2. Performance Optimization

#### Enable Compression:

```bash
# For Nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

#### Enable HTTP/2:

```nginx
# Nginx configuration
listen 443 ssl http2;
```

### 3. Monitoring Setup

#### Google Analytics (Optional):

```javascript
// Add to index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

#### Error Monitoring (Optional):

```javascript
// Add Sentry for error tracking
import * as Sentry from "@sentry/react";
Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production"
});
```

### 4. Backup Strategy

#### Automated Backups:

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/medicaladmissions"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup source code
tar -czf $BACKUP_DIR/source_$DATE.tar.gz /var/www/medicaladmissions

# Backup data files
cp -r /var/www/medicaladmissions/src/data $BACKUP_DIR/data_$DATE

# Clean old backups (keep last 7 days)
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "data_*" -mtime +7 -exec rm -rf {} \;
```

#### Cron Job Setup:

```bash
# Add to crontab
0 2 * * * /path/to/backup.sh
```

## 🚀 Performance Optimization

### 1. Build Optimization

```bash
# Analyze bundle size
npm run build -- --analyze

# Optimize images
npm install -g imagemin-cli
imagemin src/assets/* --out-dir=dist/assets
```

### 2. CDN Configuration

Configure your CDN (Cloudflare, AWS CloudFront, etc.) with these settings:

- **Cache static assets** for 1 year
- **Cache HTML** for 1 hour
- **Enable compression**
- **Enable HTTP/2**
- **Set security headers**

### 3. Service Worker Optimization

```javascript
// Customize service worker caching strategy
const CACHE_STRATEGIES = {
  static: 'cache-first',
  api: 'network-first',
  html: 'stale-while-revalidate'
};
```

## 🔒 Security Checklist

- [ ] SSL certificate installed
- [ ] Security headers configured
- [ ] CSP (Content Security Policy) implemented
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] XSS protection enabled
- [ ] CSRF protection implemented
- [ ] Regular security updates
- [ ] Backup strategy in place
- [ ] Monitoring and alerting configured

## 📊 Monitoring and Analytics

### 1. Performance Monitoring

```bash
# Install monitoring tools
npm install -g lighthouse
npm install -g webpagetest

# Run performance audit
lighthouse https://medicaladmissions.in --output=json --output-path=./lighthouse-report.json
```

### 2. Uptime Monitoring

Set up uptime monitoring with services like:
- UptimeRobot
- Pingdom
- StatusCake

### 3. Error Tracking

Configure error tracking with:
- Sentry
- LogRocket
- Bugsnag

## 🔄 Continuous Deployment

### GitHub Actions Workflow:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Process data
        run: npm run process-data
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🆘 Troubleshooting

### Common Issues:

1. **Build fails:**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **PWA not working:**
   - Check service worker registration
   - Verify manifest.json
   - Test HTTPS requirement

3. **Performance issues:**
   - Run lighthouse audit
   - Check bundle size
   - Optimize images

4. **SEO issues:**
   - Verify meta tags
   - Check structured data
   - Test social media cards

## 📞 Support

For deployment support:
- Email: support@medicaladmissions.in
- Documentation: https://docs.medicaladmissions.in
- Issues: https://github.com/your-org/medical-admissions-platform/issues

---

**Remember:** Always test your deployment in a staging environment before going live!