import fs from 'fs'
import path from 'path'

const envPath = path.join(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')

let supabaseUrl = ''
let supabaseKey = ''

envContent.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim()
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim()
})

async function testInsert() {
  const payload = {
    date: '2026-04-30',
    title: 'Test Set',
    songs: [],
    team_members: [],
    notes: 'Testing insert from script'
  }

  const res = await fetch(`${supabaseUrl}/rest/v1/worship_sets`, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(payload)
  })
  
  const text = await res.text()
  console.log('Insert Status:', res.status)
  console.log('Insert Response:', text)
}

testInsert()
