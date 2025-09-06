# 🚀 Deployment Guide - Ghanaian Health App

## 🌐 Web App Deployment (Live URL)

### Option 1: GitHub Pages (Free)
```bash
cd web
./deploy.sh
# Follow the instructions to push to GitHub
```
**Result**: `https://yourusername.github.io/ghana-health-app`

### Option 2: Netlify (Free)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `web/` folder
3. Get instant URL like: `https://amazing-name-123.netlify.app`

### Option 3: Vercel (Free)
```bash
cd web
npx vercel --prod
```
**Result**: `https://ghana-health-app.vercel.app`

---

## 📱 Mobile App Deployment

### React Native Setup
```bash
cd mobile-app
npm install
# For iOS simulator
npm run ios
# For Android emulator  
npm run android
```

### Expo Deployment (Easiest)
```bash
cd mobile-app
npm install -g expo-cli
expo start
# Scan QR code with Expo Go app
```

### App Store Deployment
```bash
cd mobile-app
# iOS
expo build:ios
# Android
expo build:android
```

---

## 🔧 Quick Start - Get Live URL in 5 Minutes

### Fastest Method: Netlify Drop
1. Open [netlify.com](https://netlify.com)
2. Drag the `web/` folder to the deploy area
3. Get instant live URL
4. Share with users immediately

### Local Testing
```bash
cd web
python3 -m http.server 8000
# Visit: http://localhost:8000
```

---

## 📊 What You Get

### Web App Features
- ✅ Works on all devices (mobile, tablet, desktop)
- ✅ Offline capability (PWA)
- ✅ Installable on phones
- ✅ Ghanaian meal plans with recipes
- ✅ Workout tracking
- ✅ Shopping lists
- ✅ Progress tracking

### Mobile App Features  
- ✅ Native iOS/Android performance
- ✅ Push notifications (when implemented)
- ✅ App store distribution
- ✅ Device integration capabilities

---

## 🎯 Recommended Deployment Path

1. **Start with Web App** (5 minutes)
   - Deploy to Netlify for instant URL
   - Test with users immediately
   - Gather feedback

2. **Add Mobile App** (1 hour)
   - Use Expo for quick mobile testing
   - Share via QR code with test users

3. **Production Release** (1 week)
   - Custom domain for web app
   - App store submission for mobile
   - Analytics and user tracking

---

## 💡 Pro Tips

### For Web App
- Use custom domain: `health.yourname.com`
- Add Google Analytics for user tracking
- Enable PWA features for app-like experience

### For Mobile App
- Test on real devices, not just simulators
- Optimize images and assets for mobile
- Implement push notifications for meal/workout reminders

### For Both
- Add user authentication for progress saving
- Implement data sync between web and mobile
- Create admin panel for content updates

---

## 🔗 Useful Links

- **Netlify**: https://netlify.com (Web deployment)
- **Vercel**: https://vercel.com (Web deployment)
- **Expo**: https://expo.dev (Mobile development)
- **GitHub Pages**: https://pages.github.com (Free hosting)

---

## 🆘 Troubleshooting

### Web App Issues
- **Blank page**: Check browser console for errors
- **Images not loading**: Ensure correct file paths
- **Mobile layout broken**: Test responsive design

### Mobile App Issues
- **App won't start**: Check Node.js version compatibility
- **Build fails**: Clear cache with `expo r -c`
- **Slow performance**: Optimize images and reduce bundle size

---

**Ready to deploy? Start with the web app for instant results!** 🚀