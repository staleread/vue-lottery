import type { User } from './types'

const NEXT_USER_ID_KEY = 'NEXT_USER_ID_KEY'
const USERS_KEY = 'USERS_KEY'

const nextUserIdData = localStorage.getItem(NEXT_USER_ID_KEY)
let nextUserId: number = nextUserIdData ? Number.parseInt(nextUserIdData) : 1

const usersData = localStorage.getItem(USERS_KEY)
const users: User[] = usersData ? JSON.parse(usersData) : []

export function getUsers(): User[] {
  return [...users]
}

export function getUserById(id: number): User {
  const user = users.find(u => u.id === id)

  if (!user) {
    throw new Error('User not found')
  }
  return user
}

export function addUser(dto: Omit<User, 'id'>): number {
  const user: User = { id: nextUserId, ...dto }

  nextUserId++
  users.push(user)

  saveChanges()
  return user.id
}

function saveChanges(): void {
  localStorage.setItem(NEXT_USER_ID_KEY, nextUserId.toString())
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}
