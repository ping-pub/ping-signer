<template>
  <Listbox v-model="selectedPerson">
    <ListboxButton>{{ selectedPerson.name }}</ListboxButton>

    <!--
      By default, this will automatically show/hide when the
      ListboxButton is pressed.
    -->
    <ListboxOptions>
      <ListboxOption v-for="person in people" :key="person" :value="person">
        {{ person.name }}
      </ListboxOption>
    </ListboxOptions>
  </Listbox>
</template>

<script>
  import { ref } from 'vue'
  import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  } from '@headlessui/vue'

  export default {
    components: { Listbox, ListboxButton, ListboxOptions, ListboxOption },

    setup() {
      const people = [
        { name: 'Durward Reynolds' },
        { name: 'Kenton Towne' },
        { name: 'Therese Wunsch' },
        { name: 'Benedict Kessler' },
        { name: 'Katelyn Rohan' },
      ]
      const selectedPerson = ref(people[0])

      return {
        people,
        selectedPerson,
      }
    },
  }
</script>