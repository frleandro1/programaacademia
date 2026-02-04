# 🚀 Guia de Deploy Online - Academia Treino

## Opções de Deploy

### Opção 1: GitHub Pages (Recomendado - Mais Fácil)
Ideal para frontend puro (HTML/CSS/JS)

#### Passo 1: Criar Repositório no GitHub
1. Acesse https://github.com/new
2. Nome: `academia-treino`
3. Descrição: "Sistema de gerenciamento de treinos de academia"
4. Deixe **Público**
5. Clique "Create repository"

#### Passo 2: Clonar ou Fazer Push do Código
```bash
# Se nunca fez push antes (no seu PC)
cd C:\Users\Leandro\Desktop\Programa_cantina

# Inicializar git (se ainda não fez)
git init
git add .
git commit -m "Initial commit: Academia Treino v1"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/academia-treino.git
git push -u origin main
```

#### Passo 3: Ativar GitHub Pages
1. No repositório do GitHub, vá em **Settings** → **Pages**
2. Em "Source", selecione **main** branch
3. Pasta: **(root)**
4. Clique "Save"
5. Aguarde 1-2 minutos
6. Sua URL será: `https://seu-usuario.github.io/academia-treino/`

#### Passo 4: Acessar Online
- Dashboard: `https://seu-usuario.github.io/academia-treino/index.html`
- Login: `https://seu-usuario.github.io/academia-treino/login.html`
- Admin: `https://seu-usuario.github.io/academia-treino/admin.html`

**Vantagens:**
- ✅ Totalmente grátis
- ✅ HTTPS automático
- ✅ Sem configuração de servidor
- ✅ Funciona com localStorage

---

### Opção 2: Vercel (Recomendado - Mais Rápido)
Plataforma moderna de deploy

#### Passo 1: Fazer Push para GitHub (se ainda não fez)
```bash
git push origin main
```

#### Passo 2: Conectar ao Vercel
1. Acesse https://vercel.com
2. Clique "Sign Up"
3. Escolha "Continue with GitHub"
4. Autorize o Vercel
5. Clique "Import Project"
6. Selecione seu repositório `academia-treino`
7. Clique "Import"
8. Clique "Deploy"

#### Passo 3: Configurar (Opcional)
- Nome do projeto: `academia-treino`
- Framework: **Other** (não precisa)
- Deploy automático em cada push

#### Passo 4: Acessar
URL gerada automaticamente: `https://academia-treino.vercel.app`

**Vantagens:**
- ✅ Deploy automático em cada push
- ✅ Muito rápido
- ✅ Analytics gratuito
- ✅ Preview antes de fazer push

---

### Opção 3: Heroku + Backend PHP (Para Usar Banco de Dados)
Se quiser usar MySQL e PHP

#### Passo 1: Preparar Projeto para Heroku
Crie arquivo `Procfile` na raiz:
```
web: vendor/bin/heroku-php-apache2 public/
```

Crie `composer.json`:
```json
{
  "require": {
    "php": "^8.0"
  }
}
```

#### Passo 2: Deploy
```bash
npm install -g heroku
heroku login
heroku create academia-treino
git push heroku main
```

#### Passo 3: Acessar
`https://academia-treino.herokuapp.com`

---

### Opção 4: Replit (Mais Fácil para Iniciantes)
IDE online com deploy integrado

#### Passo 1: Fazer Upload
1. Acesse https://replit.com
2. Clique "Create Repl"
3. Selecione "HTML, CSS, JS"
4. Nomeie: `academia-treino`
5. Clique "Create Repl"

#### Passo 2: Fazer Upload dos Arquivos
1. Clique em "Upload file"
2. Selecione todos os arquivos do seu projeto
3. Clique "Run"

#### Passo 3: Compartilhar
URL: `https://replit.com/@seu-usuario/academia-treino`

---

## 📊 Comparação de Opções

| Opção | Custo | Facilidade | Banco Dados | Tempo |
|-------|-------|-----------|-----------|-------|
| GitHub Pages | Grátis | ⭐⭐⭐⭐⭐ | Não | 2 min |
| Vercel | Grátis | ⭐⭐⭐⭐⭐ | Não | 3 min |
| Replit | Grátis | ⭐⭐⭐⭐ | Sim | 5 min |
| Heroku | Pago ($7/mês) | ⭐⭐⭐ | Sim | 10 min |

**Recomendação:** Comece com **Vercel** - é o mais rápido e fácil!

---

## 🔧 Passos Rápidos para Vercel (Resumido)

```bash
# 1. Vá ao seu repositório GitHub
# 2. Acesse https://vercel.com
# 3. Clique "Add New..." → "Project"
# 4. Selecione seu repositório
# 5. Clique "Deploy"
# Pronto! 🎉
```

---

## 📱 Testar Antes de Fazer Deploy

### Usar Python para Servir Localmente
```bash
# Windows - vá à pasta do projeto
cd C:\Users\Leandro\Desktop\Programa_cantina

# Python 3
python -m http.server 8000

# Acesse: http://localhost:8000
```

### Usar Live Server no VS Code
1. Instale extensão "Live Server"
2. Clique direito em `index.html`
3. Clique "Open with Live Server"
4. Abre em `http://127.0.0.1:5500`

---

## 🔐 Considerações de Segurança

⚠️ **IMPORTANTE**: O projeto atual usa `localStorage` - dados ficam no navegador do usuário

### Para Produção com Dados Reais:
1. Mover credenciais para variáveis de ambiente
2. Usar HTTPS (todas as opções acima oferecem)
3. Validar dados no servidor (PHP)
4. Usar token de autenticação (JWT)
5. Nunca expor senhas em texto no código

**Exemplo de .env (Vercel)**:
```
VITE_API_URL=https://sua-api.com
VITE_DB_HOST=seu-banco.com
```

---

## 📝 Passo-a-Passo Detalhado: Vercel

### 1. Se ainda não tem repositório:
```bash
cd C:\Users\Leandro\Desktop\Programa_cantina
git init
git config user.name "Seu Nome"
git config user.email "seu-email@gmail.com"
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/academia-treino.git
git push -u origin main
```

### 2. No GitHub:
- Vá em **Settings** → **Developer settings** → **Personal access tokens**
- Crie um token com permissão `repo`
- Copie o token

### 3. No Vercel:
```bash
npm install -g vercel
vercel login
vercel --prod
```

Ou acesse https://vercel.com e clique "Import Project"

### 4. Pronto!
Seu projeto está online! 🎉

---

## 🎯 Próximas Melhorias para Produção

- [ ] Criar conta no Firebase para banco de dados
- [ ] Configurar autenticação OAuth (Google, GitHub)
- [ ] Adicionar API em Node.js/Express
- [ ] Usar MongoDB para dados
- [ ] Configurar SSL/HTTPS
- [ ] Adicionar logs e monitoramento
- [ ] Fazer backup automático

---

## 📞 Suporte

Se tiver dúvidas:
1. Documentação Vercel: https://vercel.com/docs
2. Documentação GitHub Pages: https://pages.github.com/
3. Documentação Replit: https://docs.replit.com/

---

**Dica Final**: Comece com Vercel - é literalmente clicar 3 vezes! ⚡
