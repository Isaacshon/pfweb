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

async function getOpenAPI() {
  const res = await fetch(`${supabaseUrl}/rest/v1/`, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    }
  })
  
  if (res.status === 200) {
    const data = await res.json()
    // Look for worship_sets in the OpenAPI spec
    const schema = data.definitions?.worship_sets
    if (schema) {
      console.log('worship_sets schema:', JSON.stringify(schema, null, 2))
    } else {
      console.log('worship_sets not found in definitions. All definitions:', Object.keys(data.definitions || {}))
    }
  } else {
    const text = await res.text()
    console.log("Error:", res.status, text)
  }
}

getOpenAPI()
