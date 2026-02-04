// Configuração Firebase - Academia Treino
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, get, update, remove, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5CPHE4fvlkZYa0KkINr-NlhIMPYs4qAM",
  authDomain: "academiatreinoapp-d2004.firebaseapp.com",
  databaseURL: "https://academiatreinoapp-d2004-default-rtdb.firebaseio.com",
  projectId: "academiatreinoapp-d2004",
  storageBucket: "academiatreinoapp-d2004.firebasestorage.app",
  messagingSenderId: "1075985055185",
  appId: "1:1075985055185:web:bdaf8c84c4778361e974f0",
  measurementId: "G-8TVK5XD653"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// ============ FUNÇÕES DE USUÁRIOS ============

// Salvar usuário no Firebase
export async function saveUserToFirebase(username, userData) {
  try {
    const userRef = ref(db, `users/${username}`);
    await set(userRef, userData);
    console.log('✅ Usuário salvo no Firebase:', username);
    return true;
  } catch (error) {
    console.error('❌ Erro ao salvar usuário:', error);
    return false;
  }
}

// Carregar usuário do Firebase
export async function loadUserFromFirebase(username) {
  try {
    const userRef = ref(db, `users/${username}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error('❌ Erro ao carregar usuário:', error);
    return null;
  }
}

// Carregar todos os usuários
export async function loadAllUsersFromFirebase() {
  try {
    const usersRef = ref(db, 'users');
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return {};
  } catch (error) {
    console.error('❌ Erro ao carregar usuários:', error);
    return {};
  }
}

// ============ FUNÇÕES DE EXERCÍCIOS ============

// Salvar exercício no Firebase
export async function saveExerciseToFirebase(exerciseId, exerciseData) {
  try {
    const exerciseRef = ref(db, `exercises/${exerciseId}`);
    await set(exerciseRef, exerciseData);
    console.log('✅ Exercício salvo no Firebase:', exerciseId);
    return true;
  } catch (error) {
    console.error('❌ Erro ao salvar exercício:', error);
    return false;
  }
}

// Carregar todos os exercícios
export async function loadAllExercisesFromFirebase() {
  try {
    const exercisesRef = ref(db, 'exercises');
    const snapshot = await get(exercisesRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return {};
  } catch (error) {
    console.error('❌ Erro ao carregar exercícios:', error);
    return {};
  }
}

// ============ FUNÇÕES DE TREINO ============

// Salvar treino do usuário
export async function saveUserTrainingToFirebase(username, trainingData) {
  try {
    const trainingRef = ref(db, `trainings/${username}`);
    await set(trainingRef, trainingData);
    console.log('✅ Treino salvo no Firebase:', username);
    return true;
  } catch (error) {
    console.error('❌ Erro ao salvar treino:', error);
    return false;
  }
}

// Carregar treino do usuário
export async function loadUserTrainingFromFirebase(username) {
  try {
    const trainingRef = ref(db, `trainings/${username}`);
    const snapshot = await get(trainingRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return { push: [], pull: [], legs: [] };
  } catch (error) {
    console.error('❌ Erro ao carregar treino:', error);
    return { push: [], pull: [], legs: [] };
  }
}

// ============ FUNÇÕES DE PERSONALIZAÇÃO ============

// Salvar customização de exercício
export async function saveCustomTrainingToFirebase(username, exerciseId, customData) {
  try {
    const customRef = ref(db, `custom_trainings/${username}/${exerciseId}`);
    await set(customRef, customData);
    console.log('✅ Customização salva no Firebase:', username, exerciseId);
    return true;
  } catch (error) {
    console.error('❌ Erro ao salvar customização:', error);
    return false;
  }
}

// Carregar customizações
export async function loadCustomTrainingFromFirebase(username) {
  try {
    const customRef = ref(db, `custom_trainings/${username}`);
    const snapshot = await get(customRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return {};
  } catch (error) {
    console.error('❌ Erro ao carregar customizações:', error);
    return {};
  }
}

// ============ FUNÇÕES DE HISTÓRICO ============

// Salvar sessão de treino
export async function saveTrainingSessionToFirebase(username, sessionData) {
  try {
    const sessionRef = ref(db, `sessions/${username}`);
    await set(sessionRef, sessionData);
    console.log('✅ Sessão salva no Firebase:', username);
    return true;
  } catch (error) {
    console.error('❌ Erro ao salvar sessão:', error);
    return false;
  }
}

// Carregar histórico de treinos
export async function loadTrainingHistoryFromFirebase(username) {
  try {
    const historyRef = ref(db, `history/${username}`);
    const snapshot = await get(historyRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return [];
  } catch (error) {
    console.error('❌ Erro ao carregar histórico:', error);
    return [];
  }
}

// ============ REALTIME LISTENERS ============

// Ouvir mudanças em tempo real
export function listenToUserTraining(username, callback) {
  const trainingRef = ref(db, `trainings/${username}`);
  onValue(trainingRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      callback({ push: [], pull: [], legs: [] });
    }
  });
}

// Exportar objetos principais
export { db, auth, ref, set, get, update, remove };
