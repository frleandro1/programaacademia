# 🗄️ Banco de Dados Online - Academia Treino

## Problema Atual
- Projeto usa `localStorage` (dados apenas no navegador do usuário)
- XAMPP é local (não funciona no Vercel/GitHub Pages)
- Precisamos de um banco online para armazenar dados

## 🎯 Opções Recomendadas

### Opção 1: Firebase (MAIS FÁCIL - Recomendado)
Banco de dados em tempo real do Google - **0% de configuração**

**Vantagens:**
- ✅ Grátis até 1GB
- ✅ Autenticação integrada
- ✅ Funciona sem backend
- ✅ Tempo real

**Desvantagens:**
- ❌ Requer SDK JavaScript do Firebase

### Opção 2: MongoDB Atlas (MAIS FLEXÍVEL)
Banco NoSQL na nuvem

**Vantagens:**
- ✅ Grátis até 512MB
- ✅ Muito flexível
- ✅ Suporta queries complexas

**Desvantagens:**
- ⚠️ Precisa de backend (API Node.js/Express)

### Opção 3: Supabase (MELHOR BALANÇO)
PostgreSQL + Autenticação + Real-time

**Vantagens:**
- ✅ PostgreSQL grátis
- ✅ Autenticação OAuth
- ✅ API REST automática
- ✅ Real-time subscriptions

**Desvantagens:**
- ⚠️ Pequena curva de aprendizado

### Opção 4: Railway (COM MYSQL)
Hospeda MySQL diretamente

**Vantagens:**
- ✅ MySQL/PostgreSQL real
- ✅ Dashboard amigável
- ✅ Backups automáticos

**Desvantagens:**
- ⚠️ Requer crédito de cartão
- ⚠️ Precisa de backend

---

## 🚀 Guia Passo-a-Passo: Firebase (Mais Rápido)

### Passo 1: Criar Projeto Firebase
1. Acesse https://console.firebase.google.com/
2. Clique "Criar projeto"
3. Nome: `academia-treino`
4. Clique "Continuar"
5. Desabilite Google Analytics
6. Clique "Criar projeto"
7. Aguarde 1 minuto

### Passo 2: Adicionar Realtime Database
1. No menu esquerdo, vá em **Criar** → **Realtime Database**
2. Clique "Criar banco de dados"
3. Localização: `us-central1`
4. Modo: **Iniciar no modo de teste**
5. Clique "Ativar"

### Passo 3: Obter Credenciais
1. Clique na engrenagem ⚙️ → **Configurações do projeto**
2. Vá em **Contas de serviço**
3. Copie a **URL do banco de dados** (tipo: `https://seu-projeto.firebaseio.com`)

### Passo 4: Atualizar o Projeto
Crie arquivo `js/firebase-config.js`:

```javascript
// Configuração do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, get, update, remove } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  databaseURL: "https://seu-projeto.firebaseio.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "SEU_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Exportar para usar em main.js
export { db, ref, set, get, update, remove };
```

### Passo 5: Atualizar main.js
Adicione no topo:

```javascript
// Importar Firebase
import { db, ref, set, get, update } from './firebase-config.js';

const USE_DATABASE = true; // Mudar para true

// Função para sincronizar usuários
async function loadUsersFromFirebase() {
    const usersRef = ref(db, 'users');
    const snapshot = await get(usersRef);
    return snapshot.val() || {};
}

// Função para salvar treino
async function saveTrainingToFirebase(username, trainingData) {
    const trainingRef = ref(db, `trainings/${username}`);
    await set(trainingRef, trainingData);
}
```

---

## 🗄️ Guia: Supabase (Alternativa Melhor)

### Passo 1: Criar Projeto Supabase
1. Acesse https://supabase.com/
2. Clique "Start your project"
3. Sign in com GitHub
4. Clique "New Project"
5. Nome: `academia-treino`
6. Senha: gere uma forte
7. Region: `South America (São Paulo)` (mais perto)
8. Clique "Create new project"

### Passo 2: Criar Tabelas
Na seção "SQL Editor", execute:

```sql
-- Tabela de Usuários
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  routine TEXT,
  goal TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Exercícios
CREATE TABLE exercicios (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  grupo TEXT NOT NULL,
  series TEXT,
  load TEXT,
  interval TEXT,
  instructions TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Treinos do Usuário
CREATE TABLE user_trainings (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL REFERENCES usuarios(username),
  exercise_id INT NOT NULL REFERENCES exercicios(id),
  custom_series TEXT,
  custom_load TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Histórico
CREATE TABLE training_history (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL REFERENCES usuarios(username),
  exercise_id INT NOT NULL REFERENCES exercicios(id),
  time_spent INT,
  total_load TEXT,
  completed_at TIMESTAMP DEFAULT NOW()
);
```

### Passo 3: Conectar no Projeto
Em `js/supabase-config.js`:

```javascript
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://sua-url.supabase.co';
const SUPABASE_KEY = 'sua-chave-publica';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
```

### Passo 4: Usar no main.js
```javascript
import { supabase } from './supabase-config.js';

async function loadUsersFromSupabase() {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*');
  
  if (error) console.error(error);
  return data || [];
}
```

---

## 📊 Comparação Rápida

| Aspecto | Firebase | Supabase | MongoDB | Railway |
|---------|----------|----------|---------|---------|
| Custo | Grátis | Grátis | Grátis | Pago |
| Facilidade | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| SQL | Não | Sim | Não | Sim |
| Real-time | Sim | Sim | Não | Sim |
| Backend | Não | Não | Sim | Sim |
| Ideal para | Frontend puro | Full-stack | APIs | Produção |

---

## ✅ Recomendação Final

**Para começar rápido: Use Firebase**
- Copia/cola código
- Funciona em segundos
- Sem backend necessário

**Para projeto profissional: Use Supabase**
- SQL real
- Melhor controle
- Backups automáticos
- OAuth integrado

---

## 🔐 Regras de Segurança Firebase

⚠️ **IMPORTANTE**: Configure regras no Firebase!

1. Vá em **Realtime Database** → **Regras**
2. Clique "Regras"
3. Adicione:

```json
{
  "rules": {
    "users": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "trainings": {
      "$username": {
        ".read": "$username === auth.uid",
        ".write": "$username === auth.uid"
      }
    }
  }
}
```

4. Clique "Publicar"

---

## 📝 Checklist de Deploy

- [ ] Criar conta no Firebase/Supabase
- [ ] Configurar banco de dados
- [ ] Copiar credenciais
- [ ] Atualizar `main.js` com credenciais
- [ ] Testar localmente
- [ ] Fazer commit e push
- [ ] Deploy no Vercel

---

## 📞 Próximos Passos

1. **Escolha uma opção** (recomendo Firebase para começar)
2. **Me informe qual escolheu** e qual é o seu GitHub username
3. **Vou criar os arquivos** configurados com seu banco

Qual você quer usar? 🚀
