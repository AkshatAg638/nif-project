# Production Deployment & Security Checklist
**Namokriti International Foundation (NIF)**

This guide provides a step-by-step walk-through to deploy the NIF NGO application in a production-hardened environment using our Docker Compose stack, secured Nginx configurations, and automated backup pipelines.

---

## 1. Domain & DNS Configuration

Ensure the following DNS records are set up with your registrar/DNS provider (e.g., Cloudflare, Route 53, GoDaddy) to point traffic to your server's public IP address (referred to here as `123.45.67.89`):

### Basic Records
*   **A Record**: `namokriti.org` $\rightarrow$ `123.45.67.89` (TTL: Auto/3600)
*   **CNAME Record**: `www` $\rightarrow$ `namokriti.org` (TTL: Auto/3600)

### Email Security Records (Prevents Spoofing & Spam)
To secure emails dispatched by the SMTP server (`no-reply@namokriti.org`), you **MUST** configure these records:
*   **SPF (Sender Policy Framework)**: Prevent unauthorized servers from sending mail as `namokriti.org`.
    *   **Type**: `TXT`
    *   **Host**: `@`
    *   **Value**: `v=spf1 ip4:123.45.67.89 include:_spf.google.com ~all` (Adjust based on your SMTP host provider)
*   **DKIM (DomainKeys Identified Mail)**: Cryptographically sign outgoing emails.
    *   **Type**: `TXT`
    *   **Host**: `google._domainkey` (or provider-specific selector)
    *   **Value**: `v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...` (Obtain this key from your email suite provider)
*   **DMARC (Domain-based Message Authentication)**: Define action policy for SPF/DKIM verification failures.
    *   **Type**: `TXT`
    *   **Host**: `_dmarc`
    *   **Value**: `v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc-reports@namokriti.org`

---

## 2. Cloudflare Security Recommendations (Highly Recommended)

If proxying traffic through Cloudflare:
1.  **SSL/TLS Mode**: Set encryption mode to **Full (Strict)**. This ensures traffic between Cloudflare and your Nginx origin server is fully encrypted and validates the SSL certificate.
2.  **DNS Proxying**: Toggle the cloud icon to **Proxied (Orange)** for both `A` and `CNAME` records to shield your origin server's public IP address.
3.  **Always Use HTTPS**: Enable under SSL/TLS $\rightarrow$ Edge Certificates.
4.  **Minimum TLS Version**: Set to **TLS 1.2** or higher.
5.  **Web Application Firewall (WAF)**: Enable default OWASP rulesets to protect against SQLi, XSS, and common vulnerabilities.

---

## 3. Server Provisioning & SSL Setup (Ubuntu/Debian)

Connect to your target VM and execute the following commands to provision tools and Let's Encrypt certificates.

### Step 3.1: Install Docker & Docker Compose
```bash
# Update package index
sudo apt update && sudo apt upgrade -y

# Install prerequisites
sudo apt install -y curl gnupg lsb-release ca-certificates apt-transport-https

# Add Docker official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Add Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker suite
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

### Step 3.2: Generate Diffie-Hellman Parameters (PFS Security)
Mozilla's modern TLS profile requires a unique DH parameter file. Run this to generate a secure 2048-bit key:
```bash
sudo mkdir -p /etc/ssl/certs
sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
```

### Step 3.3: Obtain Let's Encrypt Certificates
Use Certbot to provision certificates. If Nginx is running on the host, stop it temporarily.
```bash
sudo apt install -y certbot

# Run certbot in standalone mode to provision certs
sudo certbot certonly --standalone -d namokriti.org -d www.namokriti.org \
  --agree-tos --email contact@namokriti.org --non-interactive
```
*Note: This creates certificates at `/etc/letsencrypt/live/namokriti.org/...` which our `docker-compose.yml` mounts as read-only.*

---

## 4. Deploying the Application Stack

### Step 4.1: Clone the Hardened Codebase
```bash
git clone https://github.com/AkshatAg638/nif-project.git /app/nif-project
cd /app/nif-project
```

### Step 4.2: Prepare the Production `.env` File
Create a new `.env` file inside `/app/nif-project` (this supplies keys to `docker-compose.yml` and the node containers). Do not store production keys in git.

```bash
# Generate random 64-character hex secrets on your server
openssl rand -hex 32 # Copy result for JWT_SECRET
openssl rand -hex 32 # Copy result for COOKIE_SECRET
openssl rand -hex 32 # Copy result for SESSION_SECRET
```

Create `/app/nif-project/.env`:
```ini
# Docker Injectors
JWT_SECRET=your_generated_jwt_secret
COOKIE_SECRET=your_generated_cookie_secret
SESSION_SECRET=your_generated_session_secret

# Optional parameters
ADMIN_ALLOWED_IPS=127.0.0.1,::1
SENTRY_DSN=
```

Create `/app/nif-project/backend/.env` containing all database connections, cloud providers, and SMTP details as outlined in `.env.example`. Make sure `NODE_ENV` is set to `production` and `PORT` is `5000`.

### Step 4.3: Build Vite Frontend Assets
Before spinning up Docker, compile the production distribution package of your SPA so Nginx can serve it directly:
```bash
cd /app/nif-project/frontend
npm install
npm run build
cd /app/nif-project
```
This builds static assets into `/app/nif-project/frontend/dist` which is mounted by Nginx.

### Step 4.4: Spin Up the Stack
Launch the hardened services:
```bash
sudo docker compose up -d --build
```

### Step 4.5: Verify Container Health
Verify that all services are marked as `healthy`:
```bash
sudo docker compose ps
```
Ensure `nif-nginx`, `nif-backend`, `nif-mongodb`, and `nif-redis` are all listed in active, healthy states.

---

## 5. Configuring Automated Backups

Secure your database by scheduling the `backup.sh` script to run daily at 2:00 AM using Linux `cron`.

### Step 5.1: Copy Backup Script & Set Permissions
```bash
# Copy to script repository
sudo mkdir -p /var/scripts
sudo cp /app/nif-project/backend/scripts/backup.sh /var/scripts/backup.sh
sudo chmod +x /var/scripts/backup.sh
```

### Step 5.2: Create Log File
```bash
sudo touch /var/log/mongodb-backup.log
sudo chmod 640 /var/log/mongodb-backup.log
```

### Step 5.3: Add to Cron
Open the root user's crontab:
```bash
sudo crontab -e
```
Add the following line to schedule daily execution at 2:00 AM:
```text
0 2 * * * /var/scripts/backup.sh > /dev/null 2>&1
```

---

## 6. Post-Deployment Security Validation

Validate that all security layers are operating flawlessly:

1.  **Check SSL Quality**: Visit [SSL Labs - SSL Test](https://www.ssllabs.com/ssltest/) and input `namokriti.org`. Confirm that you score an **A+** grade.
2.  **Verify Security Headers**: Inspect your domain at [Security Headers Scan](https://securityheaders.com/). Verify that:
    *   `Strict-Transport-Security` is active
    *   `X-Frame-Options` is set to `DENY`
    *   `X-Content-Type-Options` is set to `nosniff`
    *   `Referrer-Policy` is set to `strict-origin-when-cross-origin`
    *   `Permissions-Policy` is restrictive
3.  **Inspect Secure Cookies**:
    *   Open Chrome Developer Tools $\rightarrow$ Application $\rightarrow$ Cookies.
    *   Verify that JWT/session cookies have the **HttpOnly** and **Secure** checkboxes enabled and **SameSite** is set to `Strict` or `Lax`.
4.  **Confirm Port Lockdown**:
    *   Attempt to connect to MongoDB port from outside the host: `nc -zv namokriti.org 27017`
    *   Attempt to connect to Redis port from outside the host: `nc -zv namokriti.org 6379`
    *   Both checks **MUST** timeout or fail with Connection Refused, indicating successful network isolation.
