# SVMS Deployment Guide

## Quick Deployment to FastPanel VPS

### Step 1: Upload Files to Server

1. **Connect to your VPS:**

   ```bash
   ssh root@31.97.239.153
   ```

2. **Create application directory:**

   ```bash
   mkdir -p /var/www/svms
   cd /var/www/svms
   ```

3. **Upload backend files:**

   ```bash
   # On your local machine, compress and upload backend
   cd "/Volumes/Rishi External SSD T7/developement/school-visiting-system"
   tar -czf svms-backend.tar.gz backend/
   scp svms-backend.tar.gz root@31.97.239.153:/var/www/svms/

   # On server, extract
   cd /var/www/svms
   tar -xzf svms-backend.tar.gz
   mv backend/* .
   rmdir backend
   rm svms-backend.tar.gz
   ```

### Step 2: Install Dependencies on Server

```bash
# Install Node.js and npm (if not installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2 globally
npm install -g pm2

# Install backend dependencies
cd /var/www/svms
npm install --production
```

### Step 3: Configure Environment

```bash
# Copy production environment
cp .env.production .env

# Edit environment variables
nano .env
```

Update these critical variables:

- `MONGODB_URI=mongodb://localhost:27017/svms_production`
- `JWT_SECRET=your_super_secure_secret_key_here`
- `FRONTEND_URL=https://svms.webgiants.com.au`

### Step 4: Setup MongoDB

```bash
# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt-get update
apt-get install -y mongodb-org

# Start MongoDB
systemctl start mongod
systemctl enable mongod
```

### Step 5: Deploy Backend

```bash
# Make deployment script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh

# Check status
pm2 status
pm2 logs svms-backend
```

### Step 6: Setup Nginx (Web Server)

```bash
# Install Nginx
apt-get update
apt-get install -y nginx

# Create Nginx configuration
cat > /etc/nginx/sites-available/svms << 'EOF'
server {
    listen 80;
    server_name svms.webgiants.com.au;

    # Frontend static files
    location / {
        root /var/www/svms/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/svms /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Test and restart Nginx
nginx -t
systemctl restart nginx
systemctl enable nginx
```

### Step 7: Deploy Frontend (Static Build)

We'll use a pre-built version to avoid TypeScript issues:

1. **Build frontend locally (skip TypeScript checks):**

   ```bash
   # On your local machine
   cd "/Volumes/Rishi External SSD T7/developement/school-visiting-system/frontend"
   npm run build -- --no-check
   ```

2. **Upload frontend build:**

   ```bash
   # Compress dist folder
   tar -czf frontend-dist.tar.gz dist/
   scp frontend-dist.tar.gz root@31.97.239.153:/var/www/svms/

   # On server
   cd /var/www/svms
   mkdir -p frontend
   cd frontend
   tar -xzf ../frontend-dist.tar.gz
   rm ../frontend-dist.tar.gz
   ```

### Step 8: Setup SSL (Optional but Recommended)

```bash
# Install Certbot
apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d svms.webgiants.com.au
```

### Step 9: Final Setup

```bash
# Create logs directory
mkdir -p /var/www/svms/logs

# Set proper permissions
chown -R www-data:www-data /var/www/svms/frontend
chmod -R 755 /var/www/svms/frontend

# Restart all services
systemctl restart nginx
pm2 restart svms-backend
```

### Verification

1. **Check services:**

   ```bash
   pm2 status
   systemctl status nginx
   systemctl status mongod
   ```

2. **Check logs:**

   ```bash
   pm2 logs svms-backend
   tail -f /var/log/nginx/error.log
   ```

3. **Test the application:**
   - Visit: `http://svms.webgiants.com.au`
   - Backend API: `http://svms.webgiants.com.au/api/health`

### Maintenance Commands

```bash
# Update application
cd /var/www/svms
git pull  # if using git
pm2 restart svms-backend

# View logs
pm2 logs svms-backend
pm2 monit

# Backup database
mongodump --db svms_production --out /backup/$(date +%Y%m%d)
```

## Troubleshooting

- **Backend not starting:** Check `pm2 logs svms-backend`
- **Frontend not loading:** Check nginx logs and configuration
- **Database connection issues:** Verify MongoDB is running and connection string is correct
- **Permission issues:** Ensure proper file permissions and ownership
