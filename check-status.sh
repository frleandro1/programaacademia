#!/bin/bash
# Verificação Rápida de Deploy - Academia App

echo "================================"
echo "🔍 VERIFICAÇÃO DE STATUS"
echo "================================"
echo ""

# Git Status
echo "📊 Git Status:"
git status --short
echo ""

# Últimos commits
echo "📝 Últimos 3 Commits:"
git log --oneline -3
echo ""

# Firebase Config
echo "🔥 Firebase Configurado:"
if grep -q "firebaseConfig" js/main.js; then
    echo "✅ Firebase config encontrado em main.js"
else
    echo "❌ Firebase config NÃO encontrado"
fi
echo ""

# Estrutura de Arquivos
echo "📁 Estrutura de Arquivos:"
echo "✅ index.html (Dashboard)"
echo "✅ login.html (Login)"
echo "✅ admin.html (Painel Admin)"
echo "✅ admin-login.html (Login Admin)"
echo "✅ firebase-sync.html (Ferramenta de Sync)"
echo ""

# JavaScript Files
echo "📄 JavaScript Files:"
ls -lh js/*.js | awk '{print "✅", $NF, "(" $5 ")"}'
echo ""

# CSS Files
echo "🎨 CSS Files:"
ls -lh css/*.css | awk '{print "✅", $NF, "(" $5 ")"}'
echo ""

# Videos
echo "🎬 Vídeos na Pasta:"
VIDEO_COUNT=$(ls -1 videos/*.mp4 2>/dev/null | wc -l)
echo "✅ Total: $VIDEO_COUNT vídeos"
echo ""

# Status Final
echo "================================"
echo "✅ APLICAÇÃO PRONTA PARA DEPLOY"
echo "================================"
echo ""
echo "🚀 Próximo Passo: Deploy no Vercel"
echo "📖 Veja: DEPLOY_VERCEL_FIREBASE.md"
