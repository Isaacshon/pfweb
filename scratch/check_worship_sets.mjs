import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSets() {
  const { data, error } = await supabase.from('worship_sets').select('id, title, date, created_at').order('created_at', { ascending: false }).limit(5)
  if (error) {
    console.error('Error fetching sets:', error)
  } else {
    console.log('Recent Sets:', data)
  }
}

checkSets()
