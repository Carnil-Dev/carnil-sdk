# Carnil Payments SDK - Deployment Guide

## 🚀 One-Click Deploy Options

### Vercel Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/carnil/carnil-sdk&env=STRIPE_SECRET_KEY,STRIPE_WEBHOOK_SECRET,RAZORPAY_KEY_ID,RAZORPAY_KEY_SECRET)

1. Click the deploy button above
2. Add your environment variables:
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
   - `RAZORPAY_KEY_ID`: Your Razorpay key ID
   - `RAZORPAY_KEY_SECRET`: Your Razorpay key secret
3. Deploy and start using Carnil!

### Railway Deployment

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/carnil-sdk)

1. Click the Railway button above
2. Connect your GitHub repository
3. Add environment variables in Railway dashboard
4. Deploy automatically

### Docker Deployment

```bash
# Clone the repository
git clone https://github.com/carnil/carnil-sdk.git
cd carnil-sdk

# Build the Docker image
docker build -t carnil-sdk .

# Run with environment variables
docker run -p 3000:3000 \
  -e STRIPE_SECRET_KEY=your_stripe_key \
  -e STRIPE_WEBHOOK_SECRET=your_webhook_secret \
  -e RAZORPAY_KEY_ID=your_razorpay_key_id \
  -e RAZORPAY_KEY_SECRET=your_razorpay_secret \
  carnil-sdk
```

### Docker Compose

```yaml
version: '3.8'
services:
  carnil-sdk:
    build: .
    ports:
      - "3000:3000"
    environment:
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
      - RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID}
      - RAZORPAY_KEY_SECRET=${RAZORPAY_KEY_SECRET}
      - NODE_ENV=production
    volumes:
      - ./data:/app/data
    restart: unless-stopped
```

## 🏠 Self-Hosted Options

### Prerequisites

- Node.js 18+ 
- pnpm 8+
- PostgreSQL (optional, for advanced features)
- Redis (optional, for caching)

### Manual Installation

```bash
# Clone the repository
git clone https://github.com/carnil/carnil-sdk.git
cd carnil-sdk

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the development server
pnpm dev
```

### Production Setup

```bash
# Install PM2 for process management
npm install -g pm2

# Build for production
pnpm build

# Start with PM2
pm2 start ecosystem.config.js
```

### Environment Variables

Create a `.env` file with the following variables:

```env
# Payment Providers
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Database (optional)
DATABASE_URL=postgresql://user:password@localhost:5432/carnil

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key

# Monitoring
SENTRY_DSN=your_sentry_dsn
```

## 🔧 Configuration

### Provider Configuration

```typescript
// config/providers.ts
export const providerConfig = {
  stripe: {
    apiKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
    environment: process.env.NODE_ENV === 'production' ? 'live' : 'test',
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID!,
    keySecret: process.env.RAZORPAY_KEY_SECRET!,
    environment: process.env.NODE_ENV === 'production' ? 'live' : 'test',
  },
};
```

### Database Configuration

```typescript
// config/database.ts
export const databaseConfig = {
  url: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production',
  pool: {
    min: 2,
    max: 10,
  },
};
```

## 📊 Monitoring & Observability

### Health Checks

```typescript
// health.ts
export async function healthCheck() {
  const checks = await Promise.allSettled([
    checkDatabase(),
    checkRedis(),
    checkPaymentProviders(),
  ]);
  
  return {
    status: checks.every(c => c.status === 'fulfilled') ? 'healthy' : 'unhealthy',
    checks: checks.map(c => c.status),
    timestamp: new Date().toISOString(),
  };
}
```

### Metrics Collection

```typescript
// metrics.ts
import { createPrometheusMetrics } from '@carnil/analytics';

export const metrics = createPrometheusMetrics({
  paymentRequests: 'counter',
  paymentErrors: 'counter',
  responseTime: 'histogram',
  activeConnections: 'gauge',
});
```

## 🔒 Security Considerations

### API Security

```typescript
// middleware/security.ts
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

export const securityMiddleware = [
  helmet(),
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }),
];
```

### Webhook Security

```typescript
// middleware/webhook-security.ts
export function webhookSecurity(secret: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const signature = req.headers['stripe-signature'] as string;
    
    if (!verifyWebhookSignature(req.body, signature, secret)) {
      return res.status(400).json({ error: 'Invalid signature' });
    }
    
    next();
  };
}
```

## 🚀 Performance Optimization

### Caching Strategy

```typescript
// cache/redis.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const cache = {
  async get(key: string) {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  },
  
  async set(key: string, value: any, ttl = 3600) {
    await redis.setex(key, ttl, JSON.stringify(value));
  },
};
```

### Database Optimization

```sql
-- Create indexes for better performance
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_payments_customer_id ON payments(customer_id);
CREATE INDEX idx_subscriptions_customer_id ON subscriptions(customer_id);
CREATE INDEX idx_webhooks_created_at ON webhooks(created_at);
```

## 📈 Scaling Considerations

### Horizontal Scaling

```yaml
# docker-compose.scale.yml
version: '3.8'
services:
  carnil-api:
    build: .
    deploy:
      replicas: 3
    environment:
      - NODE_ENV=production
      - REDIS_URL=redis://redis:6379
      - DATABASE_URL=postgresql://user:password@postgres:5432/carnil
  
  redis:
    image: redis:alpine
    deploy:
      replicas: 1
  
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=carnil
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Load Balancing

```nginx
# nginx.conf
upstream carnil_backend {
    server carnil-api-1:3000;
    server carnil-api-2:3000;
    server carnil-api-3:3000;
}

server {
    listen 80;
    server_name api.carnil.com;
    
    location / {
        proxy_pass http://carnil_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔄 Backup & Recovery

### Database Backup

```bash
# Create backup script
#!/bin/bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
psql $DATABASE_URL < backup_20240101_120000.sql
```

### Automated Backups

```yaml
# backup.yml
version: '3.8'
services:
  backup:
    image: postgres:15
    volumes:
      - ./backups:/backups
    command: |
      sh -c "
        while true; do
          pg_dump $DATABASE_URL > /backups/backup_$(date +%Y%m%d_%H%M%S).sql
          sleep 86400
        done
      "
```

## 🆘 Troubleshooting

### Common Issues

1. **Webhook Verification Failed**
   ```bash
   # Check webhook secret
   echo $STRIPE_WEBHOOK_SECRET
   ```

2. **Database Connection Issues**
   ```bash
   # Test database connection
   psql $DATABASE_URL -c "SELECT 1;"
   ```

3. **Redis Connection Issues**
   ```bash
   # Test Redis connection
   redis-cli -u $REDIS_URL ping
   ```

### Logs & Debugging

```typescript
// logging.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});
```

## 📞 Support

- **Documentation**: [https://docs.carnil.com](https://docs.carnil.com)
- **GitHub Issues**: [https://github.com/carnil/carnil-sdk/issues](https://github.com/carnil/carnil-sdk/issues)
- **Discord Community**: [https://discord.gg/carnil](https://discord.gg/carnil)
- **Email Support**: support@carnil.com
