# 🚀 Guia de Deploy - Vercel & Firebase

## ✅ Status Atual

- ✅ GitHub: Atualizado (11e15c0)
- ✅ Firebase: Configurado e sincronizando
- ⏳ Vercel: Pronto para deploy

## 📋 Checklist de Deploy

### 1. Vercel (Deploy da Aplicação)

#### Opção A: Deploy com GitHub (RECOMENDADO)

```bash
# 1. Abra https://vercel.com/
# 2. Clique em "New Project"
# 3. Selecione "Import Git Repository"
# 4. Procure por "frleandro1/programaacademia"
# 5. Clique em "Import"
# 6. Configure:
#    - Framework: "Other" (é HTML/CSS/JS puro)
#    - Root Directory: ./
#    - Build Command: (deixe em branco)
#    - Output Directory: (deixe em branco)
# 7. Clique em "Deploy"
```

#### Resultado: A app estará disponível em:
- `https://[seu-projeto].vercel.app`
- Deploy automático a cada push no GitHub ✨

#### Opção B: Deploy com CLI (Alternativa)

```bash
# 1. Instale Vercel CLI
npm install -g vercel

# 2. Na pasta do projeto
vercel

# 3. Responda as perguntas:
#    - Set up and deploy? → Yes
#    - Which scope? → (seu usuário)
#    - Link to existing project? → No
#    - Project name? → programaacademia
#    - Directory? → ./
```

---

### 2. Firebase (Dados em Nuvem)

#### Status Atual ✅
```
✅ Projeto: academiatreinoapp-d2004
✅ Database URL: https://academiatreinoapp-d2004-default-rtdb.firebaseio.com
✅ Modo: Realtime Database
✅ Sincronização: Automática
```

#### Verificar Dados no Firebase

1. Acesse: https://console.firebase.google.com/
2. Projeto: **academiatreinoapp-d2004**
3. Vá para **Realtime Database**
4. Expanda para ver:
   - `exercises/` - 19 exercícios
   - `trainings/` - Treinos dos usuários
   - `sessions/` - Sessões ativas
   - `custom_trainings/` - Customizações

---

### 3. Configuração de Domínio Personalizado (Opcional)

No Vercel Dashboard:
```
Projeto → Settings → Domains
→ Adicione seu domínio (Ex: academia.com.br)
→ Siga as instruções de DNS
```

---

### 4. Variáveis de Ambiente (Opcional)

Se quiser adicionar segurança, crie `.env.local`:

```
VITE_FIREBASE_API_KEY=AIzaSyB5CPHE4fvlkZYa0KkINr-NlhIMPYs4qAM
VITE_FIREBASE_PROJECT_ID=academiatreinoapp-d2004
VITE_FIREBASE_DATABASE_URL=https://academiatreinoapp-d2004-default-rtdb.firebaseio.com
```

No Vercel Dashboard:
- Projeto → Settings → Environment Variables
- Adicione as variáveis acima
- Deploy novamente

---

## 📊 Estrutura do Deploy

```
Vercel (Frontend)
    ↓
GitHub (Source Code)
    ↓
Firebase (Backend/Database)
```

### Fluxo de Dados

1. **Usuário acessa**: vercel.app
2. **Faz login**: localStorage + Firebase Auth
3. **Treina**: dados salvos em localStorage
4. **Sincroniza**: Firebase Realtime Database
5. **Admin atualiza**: dados persistem na nuvem

---

## 🔄 Sincronização Firebase

### Automática

Ao fazer login, a aplicação sincroniza:
- ✅ Treinos do usuário
- ✅ Sessões ativas
- ✅ Customizações de carga
- ✅ Histórico de treinos

### Manual

Abra `firebase-sync.html` para:
- 🔄 Sincronizar banco completo
- 🧪 Testar conexão
- 📊 Ver logs de sincronização

---

## ✨ Depois do Deploy

### Testes

1. **Acesse a URL do Vercel**
   - Login: leandro / 123456
   - Verifique se treino funciona

2. **Abra Console (F12)**
   - Procure por "✅ Firebase iniciado"
   - Procure por "✅ Banco sincronizado"

3. **Teste Sincronização**
   - Faça uma alteração na carga
   - Atualize a página
   - Verifique se mantém os dados

### Monitorar

```
Vercel Dashboard:
- Deployment History
- Analytics
- Performance

Firebase Console:
- Database
- Realtime Updates
- Storage Usage
```

---

## 🚨 Troubleshooting

### Problema: Vercel mostra erro 404

**Solução**: Verifique se o arquivo `index.html` está na raiz do projeto

```bash
ls index.html  # Deve retornar o arquivo
```

### Problema: Firebase não sincroniza

**Solução**: Verifique credenciais em `js/main.js`

```javascript
// Linha 45-60 em main.js
firebaseReady  // Deve ser true
console.log(firebaseReady)  // No console (F12)
```

### Problema: Vercel build falha

**Solução**: Projeto não precisa de build! Deixe em branco as opções:
- Build Command: (vazio)
- Output Directory: (vazio)

---

## 📱 Testar em Dispositivos

### Após Deploy no Vercel

```
Desktop: https://seu-projeto.vercel.app
Mobile: QR Code do Vercel Dashboard

Ou compartilhe o link com qualquer pessoa!
```

### Verificar Responsividade

1. Abra DevTools (F12)
2. Clique em dispositivo (Ctrl+Shift+M)
3. Teste em iPhone, Samsung, Tablet

---

## 🎉 Próximas Etapas

1. ✅ Deploy no Vercel
2. ✅ Verificar Firebase sincronização
3. ✅ Testar em mobile
4. ✅ Compartilhar com usuários
5. 🎯 Monitorar performance

---

## 📞 Comandos Úteis

```bash
# Ver versão do Node
node -v

# Verificar se está em um projeto Git
git remote -v

# Ver último deploy
git log -1 --format="%H %s"

# Sincronizar com GitHub
git pull origin main
git push origin main
```

---

**Status**: 🟢 PRONTO PARA DEPLOY
**Última Atualização**: 4 de fevereiro de 2026
**Repositório**: https://github.com/frleandro1/programaacademia
