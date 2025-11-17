import { ref } from 'vue'
import { supabase } from './useSupabase'

export const useDoctors = () => {
  const doctors = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Fetch all users with doctor role from auth.users
  const fetchDoctors = async () => {
    isLoading.value = true
    error.value = null

    try {
      console.log('Attempting to fetch doctors...')

      // Try using RPC function first (most secure and reliable)
      const { data, error: fetchError } = await supabase.rpc('get_doctors')

      console.log('RPC Response:', { data, error: fetchError })

      if (fetchError) {
        console.error('RPC function get_doctors error:', fetchError)
        console.log('Error details:', fetchError.message, fetchError.details, fetchError.hint)
        error.value = 'Unable to fetch doctors. Please contact administrator.'
        doctors.value = []
      } else {
        doctors.value = data || []
        console.log('✅ Successfully fetched doctors:', doctors.value)
        console.log('Number of doctors:', doctors.value.length)

        if (doctors.value.length === 0) {
          console.warn('⚠️ No doctors found. Please register users with role="doctor"')
        }
      }
    } catch (err) {
      console.error('Error fetching doctors:', err)
      error.value = err.message
      doctors.value = []
    } finally {
      isLoading.value = false
    }
  }

  // Get doctor options formatted for v-select
  const doctorOptions = () => {
    return doctors.value.map((doctor) => ({
      title: 'Dr ' + doctor.full_name || doctor.email,
      value: doctor.id,
    }))
  }

  return {
    doctors,
    isLoading,
    error,
    fetchDoctors,
    doctorOptions,
  }
}
