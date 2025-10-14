# 🚀 CI/CD Setup Commands (Run on EC2)

You're already SSH'd into EC2! Just run these commands:

## Step 1: Generate SSH Key for GitHub

```bash
# Generate SSH key
ssh-keygen -t rsa -b 4096 -C "github-deploy"
# Press Enter for all prompts (use defaults, no passphrase)

# Display the public key - COPY THIS
cat ~/.ssh/id_rsa.pub
```

**Copy the entire output** (starts with `ssh-rsa`)

## Step 2: Add to GitHub

1. Go to: `https://github.com/YOUR_USERNAME/AksharJobs/settings/keys`
2. Click **Add deploy key**
3. Title: `EC2 Deploy Key`
4. Paste the public key
5. ✅ **Check "Allow write access"**
6. Click **Add key**

## Step 3: Get Private Key for GitHub Secrets

```bash
# Display private key - COPY THIS
cat ~/.ssh/id_rsa
```

**Copy the ENTIRE output** including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`

## Step 4: Add GitHub Secrets

Go to: `https://github.com/YOUR_USERNAME/AksharJobs/settings/secrets/actions`

Add these 3 secrets:

| Name | Value |
|------|-------|
| `EC2_HOST` | `13.61.35.12` |
| `EC2_USER` | `ubuntu` |
| `EC2_KEY` | (paste the private key from Step 3) |

## Step 5: Configure Git on EC2

```bash
# Navigate to project
cd /var/www/AksharJobs

# Set Git remote to SSH (replace YOUR_USERNAME with your GitHub username)
git remote set-url origin git@github.com:YOUR_USERNAME/AksharJobs.git

# Test GitHub connection
ssh -T git@github.com
# Type "yes" if asked, should see: "Hi YOUR_USERNAME! You've successfully authenticated..."

# Setup passwordless sudo for deployments
echo "ubuntu ALL=(ALL) NOPASSWD: /bin/cp, /bin/rm, /bin/chown, /bin/chmod, /usr/bin/systemctl reload nginx" | sudo tee /etc/sudoers.d/github-deploy
sudo chmod 440 /etc/sudoers.d/github-deploy
```

## Step 6: Done! ✅

Now from your **local machine** (Windows):

```bash
git add .
git commit -m "Test CI/CD deployment"
git push origin main
```

Watch it deploy automatically on GitHub → Actions tab! 🎉

