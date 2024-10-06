import type { User } from './types'
import Storage from './storage'

const storageKey = 'user-storage'
const storage = new Storage<User>(storageKey)

export async function getUser(id: number): Promise<User> {
  return new Promise((resolve, reject) => {
    const maybeUser = storage.get(id)

    maybeUser ? resolve(maybeUser) : reject(new Error('User not found'))
  })
}

export async function getUsers(): Promise<User[]> {
  return new Promise(resolve => resolve(storage.getAll()))
}

export async function addUser(dto: Omit<User, 'id'>): Promise<number> {
  return new Promise((resolve) => {
    const id = storage.getNextId()
    const user: User = { id, ...dto }

    storage.add(user)
    storage.saveChanges()

    resolve(id)
  })
}
