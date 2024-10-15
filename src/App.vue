<script setup lang="ts">
import type { User } from './types'
import { onBeforeMount, ref } from 'vue'
import UserAddForm from './components/UserAddForm.vue'
import UserList from './components/UserList.vue'
import UserWinnerList from './components/UserWinnerList.vue'
import { addUser, getUserById, getUsers } from './local-storage-manager'

const users = ref<User[]>([])

onBeforeMount(() => users.value = getUsers())

function handleUserAdd(userAddDto: Omit<User, 'id'>) {
  const id = addUser(userAddDto)
  const newUser = getUserById(id)

  users.value.push(newUser)
}
</script>

<template>
  <div class="py-8">
    <div class="container mx-auto flex flex-col gap-4 items-center py-8">
      <UserWinnerList :users="users" />
      <UserAddForm @valid-submit="handleUserAdd" />
      <UserList :users="users" />
    </div>
  </div>
</template>
