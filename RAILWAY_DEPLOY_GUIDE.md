# 🚀 DEPLOY EN RAILWAY - GUÍA ULTRA RÁPIDA

## ⚡ PASOS (5 minutos máximo)

### 1. **Subir código a GitHub (2 min)**
```bash
git add .
git commit -m "Ready for Railway deploy"
git push origin main
```

### 2. **Deploy en Railway (3 min)**

1. **Ve a** → https://railway.app
2. **"Start a New Project"** → **"Deploy from GitHub repo"**
3. **Selecciona tu repo** → **`AutoSlot`**
4. **Selecciona carpeta** → **`backend-api`** (importante!)
5. **Click "Deploy"** ✅

### 3. **Configurar Variables (30 seg)**

En Railway dashboard:
- **Variables** tab → **Add Variable**:
  ```
  NODE_ENV=production
  JWT_SECRET=mi_super_secreto_123_cambia_esto
  ```

### 4. **¡LISTO! 🎉**

Railway te dará una URL como:
```
https://tu-app-random.up.railway.app
```

### 5. **Actualizar la app móvil (1 min)**

Cambia en `mobile app/lib/config/api_config.dart`:
```dart
static String get baseUrl {
  return 'https://tu-app-random.up.railway.app'; // 👈 Pega tu URL aquí
}
```

## 🔧 Si algo falla:

**Error de build?** → Revisa que seleccionaste la carpeta `backend-api`
**Error 500?** → Revisa que las variables estén configuradas
**CORS error?** → Ya está arreglado en el código

## 📱 GENERAR APK

```bash
cd "mobile app"
flutter clean
flutter build apk --release
```

APK final estará en: `build/app/outputs/flutter-apk/app-release.apk`

## ✅ CREDENCIALES PARA PROFESOR

```
Email: admin@autoslot.com
Password: password123

O también:
Email: juan@example.com  
Password: password123
```

**¡Ya tienes todo funcionando en producción!** 🚗🅿️