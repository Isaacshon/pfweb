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

async function checkSchema() {
  // Try to query postgres metadata via REST API RPC if possible, but usually not exposed.
  // Instead, let's just do a GET /rest/v1/worship_sets with limit 1
  const res = await fetch(`${supabaseUrl}/rest/v1/worship_sets?limit=1`, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    }
  })
  
  if (res.status === 200) {
    const data = await res.json()
    console.log("Data:", data)
  } else {
    const text = await res.text()
    console.log("Error:", res.status, text)
  }
}

checkSchema()
