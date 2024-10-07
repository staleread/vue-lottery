<script script lang="ts">
import type { User } from './types'
import { defineComponent } from 'vue'
import {
  addUser,
  getUserById,
  getUsers,
} from './local-storage-manager'
import {
  validateDateOfBirth,
  validateEmail,
  validateName,
  validatePhoneNumber,
} from './validation'

interface AppState {
  users: User[]
  nameInput: string
  dateOfBirthInput: string
  emailInput: string
  phoneNumberInput: string
  nameResult: string | null
  dateOfBirthResult: string | null
  emailResult: string | null
  phoneNumberResult: string | null
  nameTimeout: number | null
  dateOfBirthTimeout: number | null
  emailTimeout: number | null
  phoneNumberTimeout: number | null
}

const DEBOUNCE_TIMEOUT = 500

export default defineComponent({
  data(): AppState {
    return {
      users: [],
      nameInput: '',
      dateOfBirthInput: '',
      emailInput: '',
      phoneNumberInput: '',
      nameResult: null,
      dateOfBirthResult: null,
      emailResult: null,
      phoneNumberResult: null,
      nameTimeout: null,
      dateOfBirthTimeout: null,
      emailTimeout: null,
      phoneNumberTimeout: null,
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.users = getUsers()
  },
  methods: {
    handleNameInput(e: Event) {
      this.nameInput = (e.target as HTMLInputElement).value

      if (this.nameTimeout) {
        clearTimeout(this.nameTimeout)
      }
      this.nameTimeout = setTimeout(() => {
        this.nameResult = validateName(this.nameInput)
      }, DEBOUNCE_TIMEOUT)
    },
    handleDateOfBirthInput(e: Event) {
      this.dateOfBirthInput = (e.target as HTMLInputElement).value

      if (this.dateOfBirthTimeout) {
        clearTimeout(this.dateOfBirthTimeout)
      }
      this.dateOfBirthTimeout = setTimeout(() => {
        this.dateOfBirthResult = validateDateOfBirth(this.dateOfBirthInput)
      }, DEBOUNCE_TIMEOUT)
    },
    handleEmailInput(e: Event) {
      this.emailInput = (e.target as HTMLInputElement).value

      if (this.emailTimeout) {
        clearTimeout(this.emailTimeout)
      }
      this.emailTimeout = setTimeout(() => {
        this.emailResult = validateEmail(this.emailInput)
      }, DEBOUNCE_TIMEOUT)
    },
    handlePhoneNumberInput(e: Event) {
      this.phoneNumberInput = (e.target as HTMLInputElement).value

      if (this.phoneNumberTimeout) {
        clearTimeout(this.phoneNumberTimeout)
      }
      this.phoneNumberTimeout = setTimeout(() => {
        this.phoneNumberResult = validatePhoneNumber(this.phoneNumberInput)
      }, DEBOUNCE_TIMEOUT)
    },
    handleUserAdd() {
      if (!this.nameResult) {
        this.nameResult = validateName(this.nameInput)
      }
      if (!this.dateOfBirthResult) {
        this.dateOfBirthResult = validateDateOfBirth(this.dateOfBirthInput)
      }
      if (!this.emailResult) {
        this.emailResult = validateEmail(this.emailInput)
      }
      if (!this.phoneNumberResult) {
        this.phoneNumberResult = validatePhoneNumber(this.phoneNumberInput)
      }

      if (this.nameResult
        || this.dateOfBirthResult
        || this.emailResult
        || this.phoneNumberResult
      ) {
        return
      }

      const userId = addUser({
        name: this.nameInput,
        dateOfBirth: this.dateOfBirthInput,
        email: this.emailInput,
        phoneNumber: this.phoneNumberInput,
      })

      const newUser = getUserById(userId)
      this.users.push(newUser)

      this.nameResult = null
      this.dateOfBirthResult = null
      this.emailResult = null
      this.phoneNumberResult = null

      this.nameInput = ''
      this.dateOfBirthInput = ''
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
        <form class="flex flex-col gap-3" novalidate @submit.prevent="handleUserAdd">
          <div class="flex flex-col">
            <label for="name" class="font-bold text-neutral-900 mb-1">Name</label>
            <input
              id="name"
              :value="nameInput"
              type="text"
              placeholder="Enter user name"
              :class="{
                'border-neutral-200 border': nameResult === null,
                'border-red-400 border-2': nameResult?.length,
                'border-green-400 border-2': nameResult === '',
              }"
              class="rounded py-1 px-3 bg-neutral-100"
              @input="handleNameInput"
            >
            <div v-if="nameResult?.length" class="text-red-500 text-sm">
              {{ nameResult }}
            </div>
          </div>
          <div class="flex flex-col">
            <label for="birth-date" class="font-bold text-neutral-900 mb-1">Date of Birth</label>
            <input
              id="birth-date"
              :value="dateOfBirthInput"
              type="date"
              name="birth-date"
              :class="{
                'border-neutral-200 border': dateOfBirthResult === null,
                'border-red-400 border-2': dateOfBirthResult?.length,
                'border-green-400 border-2': dateOfBirthResult === '',
              }"
              class="rounded py-1 px-3 bg-neutral-100"
              @input="handleDateOfBirthInput"
            >
            <div v-if="dateOfBirthResult?.length" class="text-red-500 text-sm">
              {{ dateOfBirthResult }}
            </div>
          </div>
          <div class="flex flex-col">
            <label for="email" class="font-bold text-neutral-900 mb-1">Email</label>
            <input
              id="email"
              :value="emailInput"
              type="email"
              name="email"
              placeholder="Enter email"
              :class="{
                'border-neutral-200 border': emailResult === null,
                'border-red-400 border-2': emailResult?.length,
                'border-green-400 border-2': emailResult === '',
              }"
              class="rounded py-1 px-3 bg-neutral-100"
              @input="handleEmailInput"
            >
            <div v-if="emailResult?.length" class="text-red-500 text-sm">
              {{ emailResult }}
            </div>
          </div>
          <div class="flex flex-col">
            <label for="phone" class="font-bold text-neutral-900 mb-1">Phone number</label>
            <input
              id="phone"
              :value="phoneNumberInput"
              type="tel"
              name="phone"
              placeholder="Enter Phone number"
              :class="{
                'border-neutral-200 border': phoneNumberResult === null,
                'border-red-400 border-2': phoneNumberResult?.length,
                'border-green-400 border-2': phoneNumberResult === '',
              }"
              class="rounded py-1 px-3 bg-neutral-100"
              @input="handlePhoneNumberInput"
            >
            <div v-if="phoneNumberResult?.length" class="text-red-500 text-sm">
              {{ phoneNumberResult }}
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
                {{ user.dateOfBirth }}
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
