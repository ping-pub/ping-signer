<template>
  <Listbox v-model="selectedPerson">
    <ListboxButton>{{ selectedPerson.name }}</ListboxButton>
    <ListboxOptions>
      <ListboxOption v-for="person in people" :key="person" :value="person">{{
        person.name
      }}</ListboxOption>
    </ListboxOptions>
  </Listbox>
</template>

<script>
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";

const people = [
  { name: "Durward Reynolds" },
  { name: "Kenton Towne" },
  { name: "Therese Wunsch" },
  { name: "Benedict Kessler" },
  { name: "Katelyn Rohan" },
];

export default {
  components: { Listbox, ListboxButton, ListboxOptions, ListboxOption },
  data() {
    return {
      people,
      selectedPerson: people[1],
    };
  },
};
</script>
