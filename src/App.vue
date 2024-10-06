<script lang="ts">
import type { User } from './services/types'
import { defineComponent } from 'vue'
import * as userService from './services/user-service'

type DisplayUser =
  Omit<User, 'dateOfBirth'> & { displayDateOfBirth: string }

export default defineComponent({
  data() {
    return {
      usersData: [] as User[],
      nameInput: '',
      displayDateOfBirthInput: '',
      emailInput: '',
      phoneNumberInput: '',
    }
  },
  computed: {
    users(): DisplayUser[] {
      return this.usersData.map(u => this.toDisplayUser(u))
    },
  },
  async created() {
    this.usersData = await userService.getUsers()
  },
  methods: {
    toDisplayUser(user: User): DisplayUser {
      const displayDate = new Date(user.dateOfBirth)
        .toISOString()
        .substring(0, 10)

      return {
        id: user.id,
        name: user.name,
        displayDateOfBirth: displayDate,
        email: user.email,
        phoneNumber: user.phoneNumber,
      }
    },
    async handleUserAdd() {
      const date = new Date(this.displayDateOfBirthInput)
      const dateOfBirthJson = date.toJSON()

      const newId = await userService.addUser({
        name: this.nameInput,
        dateOfBirth: dateOfBirthJson,
        email: this.emailInput,
        phoneNumber: this.phoneNumberInput,
      })

      const newUser = await userService.getUser(newId)
      this.users.push(this.toDisplayUser(newUser))

      this.nameInput = ''
      this.displayDateOfBirthInput = ''
      this.emailInput = ''
      this.phoneNumberInput = ''
    },
  },
})
</script>

<template>
  <div class="min-h-screen bg-neutral-100 py-8">
    <div class="container mx-auto flex flex-col gap-4 items-center py-8">
      <section
        class="w-full bg-white border-solid border border-neutral-200 rounded p-4 flex gap-4"
      >
        <div
          class="flex-1 border border-neutral-200 rounded py-1 px-2 flex gap-2 items-center"
        >
          <button
            class="bg-sky-500 hover:bg-red-400 ease-out duration-300 rounded h-5 flex gap-2 justify-between items-center px-1"
          >
            <p class="text-xs font-bold text-white">
              Amsterdam
            </p>
            <span class="text-xs text-white font-bold">X</span>
          </button>
          <button
            class="bg-sky-500 hover:bg-red-400 ease-out duration-300 rounded h-5 flex gap-2 justify-between items-center px-1"
          >
            <p class="text-xs font-bold text-white">
              Washington
            </p>
            <span class="text-xs text-white font-bold">X</span>
          </button>
          <p class="text-neutral-400">
            Winners
          </p>
        </div>
        <button
          class="bg-sky-400 hover:bg-sky-500 ease-out duration-300 rounded px-3 py-1 font-bold text-white"
        >
          New winner
        </button>
      </section>
      <section
        class="flex flex-col gap-4 w-full bg-white border-solid border border-neutral-200 rounded p-4"
      >
        <hgroup>
          <h2 class="text-neutral-900 font-bold uppercase">
            Register form
          </h2>
          <p class="text-neutral-400">
            Please fill all the fields
          </p>
        </hgroup>
        <form class="flex flex-col gap-3" @submit.prevent="handleUserAdd">
          <div class="flex flex-col">
            <label for="name" class="font-bold text-neutral-900 mb-1">Name</label>
            <input
              id="name"
              v-model="nameInput"
              type="text"
              placeholder="Enter user name"
              class="border-2 border-red-400 rounded py-1 px-3 bg-neutral-100"
            >
            <div class="text-red-500 text-sm">
              This value is required
            </div>
          </div>
          <div class="flex flex-col">
            <label for="birth-date" class="font-bold text-neutral-900 mb-1">Date of Birth</label>
            <input
              id="birth-date"
              v-model.lazy="displayDateOfBirthInput"
              type="date"
              name="birth-date"
              placeholder="Enter user name"
              class="border border-neutral-200 rounded py-1 px-3 bg-neutral-100"
            >
            <div class="text-red-500 text-sm hidden">
              This value is required
            </div>
          </div>
          <div class="flex flex-col">
            <label for="email" class="font-bold text-neutral-900 mb-1">Email</label>
            <input
              id="email"
              v-model="emailInput"
              type="email"
              name="email"
              placeholder="Enter email"
              class="border border-neutral-200 rounded py-1 px-3 bg-neutral-100"
            >
            <div class="text-red-500 text-sm hidden">
              This value is required
            </div>
          </div>
          <div class="flex flex-col">
            <label for="phone" class="font-bold text-neutral-900 mb-1">Phone number</label>
            <input
              id="phone"
              v-model="phoneNumberInput"
              type="tel"
              name="phone"
              placeholder="Enter Phone number"
              class="border border-neutral-200 rounded py-1 px-3 bg-neutral-100"
            >
            <div class="text-red-500 text-sm hidden">
              This value is required
            </div>
          </div>
          <div class="flex flex-row justify-end mt-6">
            <button
              type="submit"
              class="bg-sky-400 hover:bg-sky-500 rounded px-5 py-1 font-bold text-white ease-out duration-300"
            >
              Save
            </button>
          </div>
        </form>
      </section>
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
                {{ user.displayDateOfBirth }}
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
    </div>
  </div>
</template>
