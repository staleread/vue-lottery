<script setup lang="ts">
import type { User } from './types'
import { computed, onBeforeMount, ref } from 'vue'
import UserAddForm from './components/UserAddForm.vue'
import UserList from './components/UserList.vue'
import { getUsers } from './local-storage-manager'

const users = ref<User[]>([])

onBeforeMount(() => users.value = getUsers())

// winners section
const MAX_WINNERS = 3

const winnerUsers = ref<Map<number, User>>(new Map())

const canSelectWinner = computed(() =>
  winnerUsers.value.size < Math.min(MAX_WINNERS, users.value.length),
)

function selectNewWinner() {
  const notWinners
    = users.value.filter((u: User) => !winnerUsers.value.has(u.id))
  const newWinner
    = notWinners[Math.floor(Math.random() * notWinners.length)]

  winnerUsers.value.set(newWinner.id, newWinner)
}
</script>

<template>
  <div class="py-8">
    <div class="container mx-auto flex flex-col gap-4 items-center py-8">
      <section
        class="w-full bg-white border-solid border border-neutral-200 rounded p-4 flex gap-4"
      >
        <div
          class="flex-1 border border-neutral-200 rounded py-1 px-2 flex gap-2 items-center"
        >
          <button
            v-for="winner in winnerUsers.values()"
            :key="winner.id"
            class="bg-sky-500 hover:bg-red-400 ease-out duration-300 rounded h-5 flex gap-2 justify-between items-center px-1"
            @click="() => winnerUsers.delete(winner.id)"
          >
            <p class="text-xs font-bold text-white">
              {{ winner.name }}
            </p>
            <span class="text-xs text-white font-bold">X</span>
          </button>
          <p class="text-neutral-400">
            Winners
          </p>
        </div>
        <button
          class="bg-sky-400 hover:bg-sky-500 ease-out duration-300 rounded px-3 py-1 font-bold text-white disabled:bg-sky-200"
          :disabled="!canSelectWinner"
          @click="selectNewWinner"
        >
          New winner
        </button>
      </section>
      <UserAddForm @valid-submit="(user: User) => users.push(user)" />
      <UserList :users="users" />
    </div>
  </div>
</template>
