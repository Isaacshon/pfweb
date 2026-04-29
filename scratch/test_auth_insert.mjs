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

async function testAuthInsert() {
  const email = `testuser${Date.now()}@gmail.com`
  const password = 'Password123!'
  
  let res = await fetch(`${supabaseUrl}/auth/v1/signup`, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  
  let data = await res.json()
  if (!data.access_token) {
    console.log("Signup failed:", data)
    return
  }
  
  const token = data.access_token
  
  const payload = {
    date: '2026-04-30',
    title: 'Auth Test Set',
    songs: [],
    team_members: [],
    notes: 'Testing insert from script with auth'
  }

  res = await fetch(`${supabaseUrl}/rest/v1/worship_sets`, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(payload)
  })
  
  console.log('Insert Status:', res.status)
  console.log('Insert Response:', await res.text())
}

testAuthInsert()
