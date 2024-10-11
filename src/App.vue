<script setup lang="ts">
import type { User } from './types'
import { onBeforeMount, ref } from 'vue'
import UserAddForm from './components/UserAddForm.vue'
import UserList from './components/UserList.vue'
import UserWinnerList from './components/UserWinnerList.vue'
import { getUsers } from './local-storage-manager'

const users = ref<User[]>([])

onBeforeMount(() => users.value = getUsers())
</script>

<template>
  <div class="py-8">
    <div class="container mx-auto flex flex-col gap-4 items-center py-8">
      <UserWinnerList :users="users" />
      <UserAddForm @valid-submit="(user: User) => users.push(user)" />
      <UserList :users="users" />
    </div>
  </div>
</template>
