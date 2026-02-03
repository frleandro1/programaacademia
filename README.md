# 💪 Programa de Academia

Um aplicativo web simples e eficiente para gerenciar seu treino diário da academia.

## 📁 Estrutura do Projeto

```
Programa_cantina/
├── index.html          # Arquivo principal (HTML)
├── css/
│   └── styles.css      # Estilos CSS
├── js/
│   └── main.js         # Lógica JavaScript
└── README.md           # Este arquivo
```

## 🚀 Como Usar

1. **Abra o arquivo `index.html`** no seu navegador
2. **Visualize seu treino** organizado por grupos (Push, Pull, Legs)
3. **Marque ✓** os exercícios conforme completa
4. **Clique em 📹** para ver vídeos no YouTube
5. **Acompanhe seu progresso** nos contadores

## 🎯 Funcionalidades

- ✅ Checkbox para marcar exercícios concluídos
- 📹 Link direto para vídeos no YouTube
- 📊 Contador em tempo real de exercícios completos
- 💾 Dados salvos automaticamente no navegador
- 📱 Design responsivo (funciona em celular)

## 🎨 Design

- **Header azul escuro** com informações do usuário
- **Cards detalhados** com série, carga e intervalo
- **Interface limpa** e intuitiva
- **Visual feedback** ao completar exercícios (card fica verde)

## 📌 Dados Padrão

O app vem com 9 exercícios pré-carregados:

- **Push:** Supino, Inclinado, Crucifixo, Desenvolvimento, Tríceps
- **Pull:** Puxada, Rosca
- **Legs:** Agachamento, Leg Press

## 💡 Personalização

Para editar os exercícios, modifique o objeto `DEMO_DATA` no arquivo `js/main.js`:

```javascript
const DEMO_DATA = {
    push: [
        {
            id: 1,
            name: 'Nome do exercício',
            series: '3x12',
            load: '10kg',
            interval: '60s',
            instructions: 'Descrição...',
            image: 'url-da-imagem',
            completed: false
        }
    ]
}
```

## 📱 Compatibilidade

- ✅ Chrome, Firefox, Safari, Edge
- ✅ Desktop e Mobile
- ✅ Sem dependências externas (apenas HTML/CSS/JS)

## 🔒 Dados

Todos os dados são armazenados localmente no navegador (LocalStorage), sem envio para servidor.

---

**Desenvolvido para sua jornada fitness!** 💪🏋️
