<script setup lang="ts">
import type { User } from '../types'

const { users } = defineProps<{ users: User[] }>()

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString()
}
</script>

<template>
  <section
    class="flex flex-col gap-4 w-full bg-white border-solid border border-neutral-200 rounded p-4"
  >
    <table class="table-auto">
      <thead
        class="border-b border-neutral-200 font-medium text-neutral-900"
      >
        <tr>
          <th class="px-6 py-4 font-bold text-left">
            #
          </th>
          <th class="px-6 py-4 font-bold text-left">
            Name
          </th>
          <th class="px-6 py-4 font-bold text-left">
            Date of Birth
          </th>
          <th class="px-6 py-4 font-bold text-left">
            Email
          </th>
          <th class="px-6 py-4 font-bold text-left">
            Phone number
          </th>
        </tr>
      </thead>
      <tbody class="text-neutral-500">
        <tr
          v-for="(user, idx) in users"
          :key="user.id"
          class="border-b border-neutral-200"
        >
          <td class="px-6 py-4 font-medium">
            {{ idx + 1 }}
          </td>
          <td class="px-6 py-4">
            {{ user.name }}
          </td>
          <td class="px-6 py-4">
            {{ formatDate(user.dateOfBirth) }}
          </td>
          <td class="px-6 py-4">
            {{ user.email }}
          </td>
          <td class="px-6 py-4">
            {{ user.phoneNumber }}
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="!users.length" class="text-neutral-400 px-6">
      No users yet
    </div>
  </section>
</template>
