import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function cleanup() {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'thswndrnr80@gmail.com',
    password: 'Fkdldhs80!'
  })

  if (authError) {
    console.error('Auth error:', authError)
    return
  }

  const { data, error } = await supabase
    .from('worship_sets')
    .delete()
    .eq('title', 'Test Set')

  if (error) {
    console.error('Delete error:', error)
  } else {
    console.log('Cleanup success. Deleted test sets.')
  }
}

cleanup()
