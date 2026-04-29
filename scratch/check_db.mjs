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

async function test() {
  const res = await fetch(`${supabaseUrl}/rest/v1/worship_sets?select=*&order=date.desc&limit=5`, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    }
  })
  const data = await res.json()
  console.log('Recent sets in DB:', JSON.stringify(data.map((d) => ({ id: d.id, title: d.title, date: d.date })), null, 2))
}

test()
