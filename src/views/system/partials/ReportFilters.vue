<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  dateRange: {
    type: Array,
    required: true,
  },
  selectedWard: {
    type: String,
    required: true,
  },
  selectedStatus: {
    type: String,
    required: true,
  },
  wardOptions: {
    type: Array,
    required: true,
  },
  statusOptions: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits([
  'update:dateRange',
  'update:selectedWard',
  'update:selectedStatus',
  'clear',
])

const localDateRange = computed({
  get: () => props.dateRange,
  set: (value) => emit('update:dateRange', value),
})

const localWard = computed({
  get: () => props.selectedWard,
  set: (value) => emit('update:selectedWard', value),
})

const localStatus = computed({
  get: () => props.selectedStatus,
  set: (value) => emit('update:selectedStatus', value),
})

const clearFilters = () => {
  emit('clear')
}

// Preset date ranges
const setLastWeek = () => {
  localDateRange.value = [
    dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD'),
  ]
}

const setLastMonth = () => {
  localDateRange.value = [
    dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD'),
  ]
}

const setLastYear = () => {
  localDateRange.value = [
    dayjs().subtract(1, 'year').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD'),
  ]
}
</script>

<template>
  <v-card title="Report Filters" elevation="4" class="mb-6">
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6" lg="3">
          <v-text-field
            v-model="localDateRange[0]"
            label="Start Date"
            type="date"
            variant="outlined"
            density="compact"
          />
        </v-col>
        <v-col cols="12" md="6" lg="3">
          <v-text-field
            v-model="localDateRange[1]"
            label="End Date"
            type="date"
            variant="outlined"
            density="compact"
          />
        </v-col>
        <v-col cols="12" md="6" lg="3">
          <v-select
            v-model="localWard"
            label="Ward"
            :items="wardOptions"
            variant="outlined"
            density="compact"
          />
        </v-col>
        <v-col cols="12" md="6" lg="3">
          <v-select
            v-model="localStatus"
            label="Status"
            :items="statusOptions"
            variant="outlined"
            density="compact"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="8">
          <div class="text-caption text-medium-emphasis mb-2">Quick Select:</div>
          <v-btn-group variant="outlined" density="compact">
            <v-btn @click="setLastWeek">Last 7 Days</v-btn>
            <v-btn @click="setLastMonth">Last Month</v-btn>
            <v-btn @click="setLastYear">Last Year</v-btn>
          </v-btn-group>
          <v-btn
            class="ml-2"
            variant="outlined"
            prepend-icon="mdi-filter-off"
            @click="clearFilters"
          >
            Clear Filters
          </v-btn>
        </v-col>
        <v-col cols="12" md="4">
          <v-card elevation="2" color="grey-lighten-4">
            <v-card-text>
              <div class="text-subtitle-2 mb-2 font-weight-bold">Quick Stats</div>
              <v-list density="compact" class="bg-transparent">
                <v-list-item class="px-0">
                  <template #prepend>
                    <v-icon icon="mdi-calendar" size="small" class="mr-2" />
                  </template>
                  <v-list-item-title class="text-caption">Date Range</v-list-item-title>
                  <v-list-item-subtitle class="text-caption">
                    {{
                      localDateRange[0] && localDateRange[1]
                        ? `${dayjs(localDateRange[0]).format('MMM DD')} to ${dayjs(localDateRange[1]).format('MMM DD, YYYY')}`
                        : 'All Time'
                    }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item class="px-0">
                  <template #prepend>
                    <v-icon icon="mdi-bed" size="small" class="mr-2" />
                  </template>
                  <v-list-item-title class="text-caption">Ward Filter</v-list-item-title>
                  <v-list-item-subtitle class="text-caption">{{ localWard }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item class="px-0">
                  <template #prepend>
                    <v-icon icon="mdi-information" size="small" class="mr-2" />
                  </template>
                  <v-list-item-title class="text-caption">Status Filter</v-list-item-title>
                  <v-list-item-subtitle class="text-caption">
                    {{ localStatus }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
