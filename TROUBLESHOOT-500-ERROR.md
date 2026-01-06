# Troubleshooting Internal Server Error (500) on simoneyoga.de

## Common Causes for Laravel 500 Errors on IONOS

### 1. Missing or Incorrect .env File
**Symptom:** Application can't find configuration
**Check:**
- `.env` file exists in root directory
- Contains `APP_KEY` (Laravel application key)
- Database credentials are correct
- `APP_ENV=production`
- `APP_DEBUG=false` (for production)

### 2. Document Root Configuration
**Symptom:** Requests not reaching Laravel
**IONOS Setup:**
- IONOS typically uses `/htdocs/` as document root
- Laravel needs `public/` as document root OR root `.htaccess` redirecting to `public/`
- Check if root `.htaccess` exists and redirects correctly

### 3. Storage/Bootstrap Permissions
**Symptom:** Laravel can't write cache/logs
**Required:**
- `storage/` directory: 775 permissions
- `bootstrap/cache/` directory: 775 permissions
- Owner should be web server user (usually `www-data` or `apache`)

### 4. Missing Application Key
**Symptom:** Encryption errors
**Fix:**
```bash
php artisan key:generate
```

### 5. Database Connection Issues
**Symptom:** Database errors in logs
**Check:**
- Database credentials in `.env`
- Database server is accessible
- Database exists and migrations have run

## Quick Diagnostic Steps

### Step 1: Check Error Logs
Access IONOS file manager or SSH and check:
```bash
# Laravel error log
tail -n 50 storage/logs/laravel.log

# Apache error log (if accessible)
tail -n 50 /var/log/apache2/error.log
```

### Step 2: Verify File Structure
Ensure these exist on server:
```
/htdocs/
  ├── .env
  ├── .htaccess (redirects to public/)
  ├── public/
  │   ├── index.php
  │   └── .htaccess
  ├── storage/
  │   ├── logs/
  │   ├── framework/
  │   └── app/
  └── bootstrap/
      └── cache/
```

### Step 3: Check .env File
Verify `.env` contains:
```env
APP_NAME=SimoneYoga
APP_ENV=production
APP_KEY=base64:... (must be set!)
APP_DEBUG=false
APP_URL=https://simoneyoga.de

DB_CONNECTION=mysql
DB_HOST=db5019339232.hosting-data.io
DB_PORT=3306
DB_DATABASE=simoneyoga26
DB_USERNAME=dbu529946
DB_PASSWORD=TivedenYoga-Retreat:2026
```

### Step 4: Verify Permissions
Run on server (via SSH or IONOS file manager):
```bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

## IONOS-Specific Issues

### Document Root
IONOS Deploy Now might deploy to root, but Laravel needs `public/` as entry point.

**Solution A:** Root `.htaccess` redirects to `public/`
```apache
RewriteEngine On
RewriteCond %{REQUEST_URI} !^/public/
RewriteRule ^(.*)$ public/$1 [L]
```

**Solution B:** Configure IONOS to use `public/` as document root (if possible)

### PHP Version
Check PHP version matches Laravel requirements:
- Laravel 10 requires PHP 8.1+
- IONOS might default to older PHP version

## Immediate Fixes to Try

1. **Check if .env exists and has APP_KEY:**
   ```bash
   # On server
   cat .env | grep APP_KEY
   ```

2. **Generate application key if missing:**
   ```bash
   php artisan key:generate --force
   ```

3. **Clear all caches:**
   ```bash
   php artisan config:clear
   php artisan cache:clear
   php artisan view:clear
   php artisan route:clear
   ```

4. **Check storage permissions:**
   ```bash
   ls -la storage/
   ls -la bootstrap/cache/
   ```

5. **Verify public/index.php is accessible:**
   Try: `https://simoneyoga.de/public/` (should show Laravel welcome or error)

## Next Steps

1. Access IONOS file manager or SSH
2. Check `storage/logs/laravel.log` for specific error
3. Verify `.env` file exists and is configured
4. Check file permissions
5. Verify document root configuration


