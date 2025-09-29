# Formspree Integration Setup Guide

This guide will help you set up Formspree API integration for all contact forms on the Awra Finishing website.

## 📋 Prerequisites

1. Create a free account at [Formspree.io](https://formspree.io)
2. Verify your email address
3. Create forms for each type of submission

## 🚀 Setup Steps

### 1. Create Formspree Forms

Create the following forms in your Formspree dashboard:

#### **Contact Form**
- **Form Name**: `Contact Form`
- **Form ID**: `YOUR_CONTACT_FORM_ID`
- **Fields**: name, email, projectType, message

#### **Booking Form**
- **Form Name**: `Booking Consultation`
- **Form ID**: `YOUR_BOOKING_FORM_ID`
- **Fields**: name, phone, email, service, date, time, description

#### **Newsletter Form**
- **Form Name**: `Newsletter Subscription`
- **Form ID**: `YOUR_NEWSLETTER_FORM_ID`
- **Fields**: email

#### **Get Started Form**
- **Form Name**: `Get Started Request`
- **Form ID**: `YOUR_GET_STARTED_FORM_ID`
- **Fields**: name, email, phone, message, plan

#### **Secure Form**
- **Form Name**: `Secure Contact Form`
- **Form ID**: `YOUR_SECURE_FORM_ID`
- **Fields**: name, email, phone, message, projectType, budget, timeline

#### **Quote Calculator Form**
- **Form Name**: `Quote Calculator`
- **Form ID**: `YOUR_QUOTE_FORM_ID`
- **Fields**: service, area, budget, timeline, message

### 2. Update Configuration

Replace the placeholder form IDs in `src/config/formspree.js`:

```javascript
export const FORMSPREE_ENDPOINTS = {
  CONTACT: 'https://formspree.io/f/your-actual-contact-form-id',
  BOOKING: 'https://formspree.io/f/your-actual-booking-form-id',
  NEWSLETTER: 'https://formspree.io/f/your-actual-newsletter-form-id',
  GET_STARTED: 'https://formspree.io/f/your-actual-get-started-form-id',
  SECURE: 'https://formspree.io/f/your-actual-secure-form-id',
  QUOTE: 'https://formspree.io/f/your-actual-quote-form-id'
};
```

### 3. Update Form Handlers

Replace the placeholder URLs in the following files:

#### **App.jsx**
- Line 417: `https://formspree.io/f/YOUR_FORM_ID`
- Line 476: `https://formspree.io/f/YOUR_BOOKING_FORM_ID`
- Line 542: `https://formspree.io/f/YOUR_NEWSLETTER_FORM_ID`
- Line 592: `https://formspree.io/f/YOUR_GET_STARTED_FORM_ID`

#### **SecureForm.jsx**
- Line 100: `https://formspree.io/f/YOUR_SECURE_FORM_ID`

#### **offlineManager.js**
- Lines 344-354: Update all endpoint URLs

## 🔧 Formspree Features Used

### **Email Notifications**
- Automatic email notifications for each form submission
- Custom subject lines for easy identification
- Auto-reply to users confirming submission

### **Spam Protection**
- Built-in spam filtering
- Honeypot field (`_gotcha`) for additional protection
- Rate limiting to prevent abuse

### **Data Management**
- Form submissions stored in Formspree dashboard
- Export data as CSV/JSON
- Integration with Google Sheets, Zapier, etc.

### **Customization**
- Custom success/error pages
- Email templates
- Auto-responder messages

## 📧 Email Configuration

### **Auto-Reply Settings**
Each form is configured to:
- Send confirmation email to user
- CC the user on the notification email
- Use custom subject lines for easy identification

### **Notification Emails**
You'll receive emails with:
- Form submission details
- User contact information
- Timestamp and source URL
- Custom fields specific to each form type

## 🛡️ Security Features

### **CSRF Protection**
- CSRF tokens generated for each form
- Tokens validated on submission

### **Input Sanitization**
- All user inputs are sanitized
- XSS prevention measures
- Data encryption for sensitive information

### **Offline Support**
- Forms work offline
- Data queued for submission when online
- Background sync with retry logic

## 📊 Analytics & Monitoring

### **Formspree Dashboard**
- View all form submissions
- Monitor submission rates
- Track success/error rates
- Export data for analysis

### **Error Handling**
- Comprehensive error logging
- User-friendly error messages
- Fallback mechanisms for failed submissions

## 🚀 Testing

### **Test Each Form**
1. Fill out each form completely
2. Submit and verify email notifications
3. Check Formspree dashboard for submissions
4. Test offline functionality
5. Verify error handling

### **Test Scenarios**
- Valid submissions
- Invalid/missing data
- Network failures
- Offline submissions
- Spam attempts

## 📝 Customization

### **Email Templates**
Customize email templates in Formspree dashboard:
- Add your branding
- Customize message content
- Set up auto-responders

### **Form Fields**
Add or modify form fields as needed:
- Update form configurations
- Modify validation rules
- Add new field types

### **Integration Options**
- Connect to CRM systems
- Set up webhooks
- Integrate with marketing tools
- Connect to project management tools

## 🔍 Troubleshooting

### **Common Issues**

#### **Forms Not Submitting**
- Check form IDs are correct
- Verify Formspree account is active
- Check browser console for errors
- Ensure network connectivity

#### **Emails Not Received**
- Check spam/junk folders
- Verify email addresses are correct
- Check Formspree notification settings
- Test with different email providers

#### **Offline Issues**
- Clear browser cache
- Check service worker registration
- Verify offline storage permissions
- Test on different devices

### **Debug Mode**
Enable debug logging by adding to console:
```javascript
localStorage.setItem('debug', 'true');
```

## 📞 Support

- **Formspree Documentation**: [https://formspree.io/help](https://formspree.io/help)
- **Formspree Support**: [https://formspree.io/contact](https://formspree.io/contact)
- **GitHub Issues**: Create an issue in the project repository

## ✅ Checklist

- [ ] Created Formspree account
- [ ] Created all required forms
- [ ] Updated configuration file
- [ ] Updated all form handlers
- [ ] Tested all forms
- [ ] Verified email notifications
- [ ] Tested offline functionality
- [ ] Configured spam protection
- [ ] Set up email templates
- [ ] Tested error handling

## 🎉 You're All Set!

Your contact forms are now integrated with Formspree and ready to handle real submissions. All forms will automatically send notifications to your email and store submissions in your Formspree dashboard.
