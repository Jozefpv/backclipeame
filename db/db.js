import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  // @ts-ignore
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)

export default supabase;