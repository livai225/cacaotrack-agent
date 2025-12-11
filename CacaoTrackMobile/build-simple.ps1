# Script simple de build APK
Write-Host "BUILD APK CACAOTRACK" -ForegroundColor Green

# Aller dans le dossier android
Set-Location android

# Nettoyer
Write-Host "Nettoyage..." -ForegroundColor Cyan
if (Test-Path "build") { Remove-Item -Recurse -Force build }
if (Test-Path "app/build") { Remove-Item -Recurse -Force app/build }
if (Test-Path ".gradle") { Remove-Item -Recurse -Force .gradle }

# Configurer gradle.properties
Write-Host "Configuration..." -ForegroundColor Cyan
@"
newArchEnabled=false
android.useAndroidX=true
android.enableJetifier=true
org.gradle.jvmargs=-Xmx4096m
android.compileSdkVersion=34
android.targetSdkVersion=34
android.minSdkVersion=24
android.buildToolsVersion=34.0.0
"@ | Out-File gradle.properties -Encoding UTF8 -Force

# Configurer local.properties
"sdk.dir=C:\Users\Dell\AppData\Local\Android\Sdk" | Out-File local.properties -Encoding ASCII -Force

# Clean
Write-Host "Gradle clean..." -ForegroundColor Cyan
.\gradlew clean --no-daemon

# Build
Write-Host "Build APK (5-10 minutes)..." -ForegroundColor Yellow
.\gradlew assembleRelease --no-daemon

if ($LASTEXITCODE -eq 0) {
    Write-Host "BUILD REUSSI!" -ForegroundColor Green
    $apk = "app\build\outputs\apk\release\app-release.apk"
    if (Test-Path $apk) {
        $size = (Get-Item $apk).Length / 1MB
        Write-Host "APK: $apk" -ForegroundColor Cyan
        Write-Host "Taille: $([math]::Round($size, 2)) MB" -ForegroundColor Cyan
        Copy-Item $apk "$env:USERPROFILE\Desktop\CacaoTrack.apk" -Force
        Write-Host "Copie vers Bureau: OK" -ForegroundColor Green
    }
} else {
    Write-Host "BUILD ECHOUE" -ForegroundColor Red
}

Set-Location ..
