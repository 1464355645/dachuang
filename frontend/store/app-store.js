import Vue from 'vue'

export const appStore = Vue.observable({
  user: null,
  reminder: null
})

export function setStoreUser(user) {
  appStore.user = user
}

export function setStoreReminder(reminder) {
  appStore.reminder = reminder
}
