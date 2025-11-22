<script setup>
import { useBilling } from '@/composables/useBilling'

const props = defineProps({
  patientId: {
    type: String,
    required: true,
  },
  billing: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['added'])

const { formAction, isUpdate, isEditing, formData, startEditing, cancelEditing, submitBilling } =
  useBilling(props, emit)
</script>

<template>
  <v-card title="Billing Information" elevation="4" class="pb-16">
    <template v-slot:prepend>
      <v-icon icon="mdi-currency-usd" />
    </template>

    <template v-slot:append>
      <v-btn v-if="!isEditing" size="50" variant="plain" icon @click="startEditing">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>

    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="formData.item_description"
              label="Item Description"
              variant="underlined"
              density="compact"
              :disabled="!isEditing"
              placeholder="No item description recorded"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model.number="formData.amount"
              label="Amount"
              type="number"
              variant="underlined"
              density="compact"
              :disabled="!isEditing"
              prefix="₱"
              placeholder="0.00"
            />
          </v-col>
        </v-row>

        <v-row v-if="isEditing">
          <v-col cols="12" class="d-flex ga-2 justify-end">
            <v-btn @click="cancelEditing" :disabled="formAction.formProccess" variant="outlined">
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              @click="submitBilling"
              :loading="formAction.formProccess"
              :disabled="formAction.formProccess"
            >
              {{ isUpdate ? 'Update' : 'Save' }}
            </v-btn>
          </v-col>
        </v-row>
        <!-- for additional spacing -->
        <div class="pb-4"></div>
      </v-container>
    </v-card-text>
  </v-card>
</template>
