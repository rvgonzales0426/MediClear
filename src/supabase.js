import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://huqyhxmltzlaforqdlem.supabase.co'

const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1cXloeG1sdHpsYWZvcnFkbGVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwMjQ3MDYsImV4cCI6MjA3NDYwMDcwNn0.j0SzFakMHTeasz6sc01_ac7P1J_vswoLbs0_e2DcBvM'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
