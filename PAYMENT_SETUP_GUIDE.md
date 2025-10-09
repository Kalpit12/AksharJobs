# Payment Integration Setup Guide

This guide will help you set up real payment processing for the premium subscription system using Pesapal and M-Pesa.

## Prerequisites

1. **Pesapal Account**: Sign up at [Pesapal](https://www.pesapal.com/)
2. **M-Pesa Developer Account**: Sign up at [Safaricom Developer Portal](https://developer.safaricom.co.ke/)

## Environment Variables

Add these environment variables to your `.env` file:

```env
# Frontend and Backend URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# Pesapal Configuration
PESAPAL_CONSUMER_KEY=your_pesapal_consumer_key
PESAPAL_CONSUMER_SECRET=your_pesapal_consumer_secret
PESAPAL_BASE_URL=https://cybqa.pesapal.com/pesapalv3/api

# M-Pesa Configuration
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_BASE_URL=https://sandbox.safaricom.co.ke
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_mpesa_passkey
```

## Pesapal Setup

### 1. Create Pesapal Account
1. Go to [Pesapal](https://www.pesapal.com/)
2. Sign up for a developer account
3. Complete the verification process

### 2. Get API Credentials
1. Log into your Pesapal dashboard
2. Navigate to "API Keys" section
3. Copy your Consumer Key and Consumer Secret
4. Add them to your `.env` file

### 3. Configure Callback URLs
1. In your Pesapal dashboard, set the callback URL to:
   - Success: `http://yourdomain.com/payment-callback`
   - Cancel: `http://yourdomain.com/payment-cancelled`

## M-Pesa Setup

### 1. Create Safaricom Developer Account
1. Go to [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
2. Sign up for a developer account
3. Complete the verification process

### 2. Create App
1. Create a new app in the developer portal
2. Select "M-Pesa API" as the service
3. Note down your Consumer Key and Consumer Secret

### 3. Get Test Credentials
1. Use the sandbox environment for testing
2. Get your Shortcode and Passkey from the test credentials
3. Add them to your `.env` file

## Database Setup

The payment system will automatically create the following collections:
- `payments` - Stores payment records
- `subscriptions` - Stores subscription records

## Testing

### Test Pesapal Integration
1. Use the sandbox environment
2. Test with sandbox phone numbers
3. Verify callback handling

### Test M-Pesa Integration
1. Use the sandbox environment
2. Test with sandbox phone numbers (e.g., 254708374149)
3. Use test PIN: 1234

## Production Deployment

### 1. Update Environment Variables
```env
# Production URLs
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com

# Production Pesapal
PESAPAL_BASE_URL=https://www.pesapal.com/pesapalv3/api

# Production M-Pesa
MPESA_BASE_URL=https://api.safaricom.co.ke
MPESA_SHORTCODE=your_live_shortcode
```

### 2. SSL Certificate
- Ensure your domain has a valid SSL certificate
- Pesapal and M-Pesa require HTTPS for production

### 3. Webhook Security
- Implement webhook signature verification
- Add IP whitelisting for webhook endpoints

## Payment Flow

### 1. Pesapal Flow
1. User selects Pesapal payment method
2. System creates Pesapal payment order
3. User is redirected to Pesapal payment page
4. User completes payment on Pesapal
5. Pesapal redirects to callback URL
6. System verifies payment and activates subscription

### 2. M-Pesa Flow
1. User selects M-Pesa payment method
2. User enters phone number
3. System sends STK Push to user's phone
4. User enters M-Pesa PIN on phone
5. System polls for payment status
6. Payment is verified and subscription activated

## Security Considerations

1. **Environment Variables**: Never commit API keys to version control
2. **Webhook Verification**: Verify webhook signatures
3. **HTTPS**: Always use HTTPS in production
4. **Rate Limiting**: Implement rate limiting for payment endpoints
5. **Logging**: Log all payment activities for audit

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure CORS is properly configured
2. **Callback Not Working**: Check callback URLs in payment gateway settings
3. **Authentication Errors**: Verify API credentials
4. **Phone Number Format**: Ensure phone numbers are in correct format (254XXXXXXXXX)

### Debug Mode

Enable debug logging by setting:
```env
DEBUG_PAYMENTS=true
```

## Support

For issues with:
- **Pesapal**: Contact Pesapal support
- **M-Pesa**: Contact Safaricom developer support
- **Integration**: Check the application logs

## API Endpoints

### Payment Endpoints
- `POST /api/payment/create-payment` - Create payment order
- `POST /api/payment/verify-payment` - Verify payment status
- `GET /api/payment/payment-methods` - Get available payment methods
- `GET /api/payment/payment-status/:id` - Get payment status

### Webhook Endpoints
- `POST /api/payment/pesapal-callback` - Pesapal payment callback
- `POST /api/payment/mpesa-callback` - M-Pesa payment callback

## Monitoring

Monitor payment success rates and failures:
1. Check payment logs regularly
2. Monitor webhook delivery
3. Track subscription activations
4. Monitor failed payments and retry logic
