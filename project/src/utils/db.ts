import { openDB } from 'idb';
import type { QuizAttempt } from '../types';

const DB_NAME = 'quiz-platform';
const STORE_NAME = 'attempts';

export async function initDB() {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
    },
  });
  return db;
}

export async function saveAttempt(attempt: QuizAttempt) {
  const db = await initDB();
  return db.add(STORE_NAME, attempt);
}

export async function getAttempts(): Promise<QuizAttempt[]> {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}