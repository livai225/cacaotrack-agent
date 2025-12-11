# Script de build APK avec corrections automatiques
Write-Host "🚀 BUILD APK CACAOTRACK - SCRIPT AUTOMATIQUE" -ForegroundColor Green
Write-Host ""

# Étape 1 : Nettoyer le projet
Write-Host "📦 Étape 1/5 : Nettoyage du projet..." -ForegroundColor Cyan
Set-Location android

# Supprimer les builds précédents
if (Test-Path "build") {
    Remove-Item -Recurse -Force build
    Write-Host "✅ Dossier build/ supprimé" -ForegroundColor Green
}

if (Test-Path "app/build") {
    Remove-Item -Recurse -Force app/build
    Write-Host "✅ Dossier app/build/ supprimé" -ForegroundColor Green
}

if (Test-Path ".gradle") {
    Remove-Item -Recurse -Force .gradle
    Write-Host "✅ Cache .gradle/ supprimé" -ForegroundColor Green
}

# Étape 2 : Vérifier gradle.properties
Write-Host ""
Write-Host "🔧 Étape 2/5 : Configuration gradle.properties..." -ForegroundColor Cyan

$gradleProps = @"
# Désactiver nouvelle architecture React Native
newArchEnabled=false

# AndroidX
android.useAndroidX=true
android.enableJetifier=true

# Optimisations Gradle
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=512m
org.gradle.daemon=true
org.gradle.parallel=true
org.gradle.configureondemand=true

# Versions SDK (stables)
android.compileSdkVersion=34
android.targetSdkVersion=34
android.minSdkVersion=24
android.buildToolsVersion=34.0.0

# Désactiver minify pour éviter les erreurs
android.enableMinifyInReleaseBuilds=false
android.enableShrinkResourcesInReleaseBuilds=false
android.enablePngCrunchInReleaseBuilds=false
"@

$gradleProps | Out-File -FilePath gradle.properties -Encoding UTF8 -Force
Write-Host "✅ gradle.properties configuré" -ForegroundColor Green

# Étape 3 : Vérifier local.properties
Write-Host ""
Write-Host "🔧 Étape 3/5 : Configuration local.properties..." -ForegroundColor Cyan

$localProps = "sdk.dir=C:\Users\Dell\AppData\Local\Android\Sdk"
$localProps | Out-File -FilePath local.properties -Encoding ASCII -Force
Write-Host "✅ local.properties configuré" -ForegroundColor Green

# Étape 4 : Clean Gradle
Write-Host ""
Write-Host "🧹 Étape 4/5 : Gradle Clean..." -ForegroundColor Cyan
.\gradlew clean --no-daemon

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Gradle clean a échoué" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Solutions possibles :" -ForegroundColor Yellow
    Write-Host "1. Fermer Android Studio s'il est ouvert"
    Write-Host "2. Redémarrer l'ordinateur"
    Write-Host "3. Supprimer manuellement le dossier .gradle"
    exit 1
}

Write-Host "✅ Clean terminé" -ForegroundColor Green

# Étape 5 : Build APK
Write-Host ""
Write-Host "🏗️ Étape 5/5 : Build APK Release..." -ForegroundColor Cyan
Write-Host "⏱️ Cela peut prendre 5-10 minutes..." -ForegroundColor Yellow
Write-Host ""

.\gradlew assembleRelease --no-daemon --info

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 BUILD RÉUSSI !" -ForegroundColor Green
    Write-Host ""
    
    $apkPath = "app\build\outputs\apk\release\app-release.apk"
    
    if (Test-Path $apkPath) {
        $apkSize = (Get-Item $apkPath).Length / 1MB
        Write-Host "📱 APK généré avec succès !" -ForegroundColor Green
        Write-Host "📍 Emplacement : $apkPath" -ForegroundColor Cyan
        Write-Host "📊 Taille : $([math]::Round($apkSize, 2)) MB" -ForegroundColor Cyan
        Write-Host ""
        
        # Copier l'APK vers le bureau
        $desktopPath = "$env:USERPROFILE\Desktop\CacaoTrack.apk"
        Copy-Item $apkPath $desktopPath -Force
        Write-Host "✅ APK copié vers le bureau : $desktopPath" -ForegroundColor Green
        Write-Host ""
        Write-Host "🚀 Vous pouvez maintenant installer l'APK sur les tablettes !" -ForegroundColor Green
    } else {
        Write-Host "⚠️ APK généré mais introuvable à l'emplacement attendu" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "❌ BUILD ÉCHOUÉ" -ForegroundColor Red
    Write-Host ""
    Write-Host "📋 Vérifiez les logs ci-dessus pour identifier l'erreur" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 Solutions courantes :" -ForegroundColor Yellow
    Write-Host "1. Vérifier que Java JDK est installé"
    Write-Host "2. Vérifier que Android SDK est installé"
    Write-Host "3. Fermer Android Studio"
    Write-Host "4. Redémarrer et réessayer"
    exit 1
}

Set-Location ..
