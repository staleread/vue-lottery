<script setup lang="ts">
import type { User } from '../types'
import type { FieldType } from '../validation'
import { reactive } from 'vue'
import { validationStrategy } from '../validation'

const emit = defineEmits<{
  (e: 'validSubmit', user: Omit<User, 'id'>): void
}>()

const DEBOUNCE_TIMEOUT = 500

interface Field {
  type: FieldType
  input: string
  result: string | null
  timeout: number | null
}

const name: Field = reactive({
  type: 'name',
  input: '',
  result: null,
  timeout: null,
})

const dateOfBirth: Field = reactive({
  type: 'dateOfBirth',
  input: '',
  result: null,
  timeout: null,
})

const email: Field = reactive({
  type: 'email',
  input: '',
  result: null,
  timeout: null,
})

const phoneNumber: Field = reactive({
  type: 'phoneNumber',
  input: '',
  result: null,
  timeout: null,
})

function triggerFieldValidation(field: Field) {
  if (field.timeout) {
    clearTimeout(field.timeout)
  }
  field.timeout = setTimeout(
    () => field.result = validationStrategy[field.type](field.input),
    DEBOUNCE_TIMEOUT,
  )
}

function handleUserAdd() {
  const fields = [name, dateOfBirth, email, phoneNumber]

  fields.forEach((field: Field) => {
    if (!field.result) {
      field.result = validationStrategy[field.type](field.input)
    }
  })

  if (fields.some((f: Field) => f.result)) {
    return
  }

  const dto = {
    name: name.input,
    dateOfBirth: dateOfBirth.input,
    email: email.input,
    phoneNumber: phoneNumber.input,
  }

  emit('validSubmit', dto)

  fields.forEach((field: Field) =>
    Object.assign(field, { input: '', result: null }),
  )
}
</script>

<template>
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
          v-model="name.input"
          type="text"
          placeholder="Enter user name"
          :class="{
            'border-neutral-200 border': name.result === null,
            'border-red-400 border-2': name.result?.length,
            'border-green-400 border-2': name.result === '',
          }"
          class="rounded py-1 px-3 bg-neutral-100"
          @input="triggerFieldValidation(name)"
        >
        <div v-if="name.result?.length" class="text-red-500 text-sm">
          {{ name.result }}
        </div>
      </div>
      <div class="flex flex-col">
        <label for="birth-date" class="font-bold text-neutral-900 mb-1">Date of Birth</label>
        <input
          id="birth-date"
          v-model="dateOfBirth.input"
          type="date"
          name="birth-date"
          :class="{
            'border-neutral-200 border': dateOfBirth.result === null,
            'border-red-400 border-2': dateOfBirth.result?.length,
            'border-green-400 border-2': dateOfBirth.result === '',
          }"
          class="rounded py-1 px-3 bg-neutral-100"
          @input="triggerFieldValidation(dateOfBirth)"
        >
        <div v-if="dateOfBirth.result?.length" class="text-red-500 text-sm">
          {{ dateOfBirth.result }}
        </div>
      </div>
      <div class="flex flex-col">
        <label for="email" class="font-bold text-neutral-900 mb-1">Email</label>
        <input
          id="email"
          v-model="email.input"
          type="email"
          name="email"
          placeholder="Enter email"
          :class="{
            'border-neutral-200 border': email.result === null,
            'border-red-400 border-2': email.result?.length,
            'border-green-400 border-2': email.result === '',
          }"
          class="rounded py-1 px-3 bg-neutral-100"
          @input="triggerFieldValidation(email)"
        >
        <div v-if="email.result?.length" class="text-red-500 text-sm">
          {{ email.result }}
        </div>
      </div>
      <div class="flex flex-col">
        <label for="phone" class="font-bold text-neutral-900 mb-1">Phone number</label>
        <input
          id="phone"
          v-model="phoneNumber.input"
          type="tel"
          name="phone"
          placeholder="Enter Phone number"
          :class="{
            'border-neutral-200 border': phoneNumber.result === null,
            'border-red-400 border-2': phoneNumber.result?.length,
            'border-green-400 border-2': phoneNumber.result === '',
          }"
          class="rounded py-1 px-3 bg-neutral-100"
          @input="triggerFieldValidation(phoneNumber)"
        >
        <div v-if="phoneNumber.result?.length" class="text-red-500 text-sm">
          {{ phoneNumber.result }}
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
</template>
