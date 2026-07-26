import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import { env } from '../config/env'

export const SCENE_IMAGES_BUCKET = 'scene-images'

/** True when a service-role key is configured — Storage calls are skipped otherwise. */
export const hasSupabaseServiceKey = (): boolean => env.supabaseServiceKey.length > 0

let supabase: SupabaseClient | null = null

/** Lazily built so importing this module never throws when Supabase env vars are unset (e.g. in CI). */
function getSupabaseClient(): SupabaseClient {
  supabase ??= createClient(env.supabaseUrl, env.supabaseServiceKey, {
    auth: { persistSession: false },
  })
  return supabase
}

/** Uploads image bytes to the scene-images bucket and returns its public URL, or null on failure. */
export async function uploadSceneImage(
  fileName: string,
  bytes: Uint8Array
): Promise<string | null> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.storage.from(SCENE_IMAGES_BUCKET).upload(fileName, bytes, {
    contentType: 'image/jpeg',
    upsert: true,
  })

  if (error) {
    console.warn(`[SceneImage] Supabase Storage upload failed for ${fileName}:`, error.message)
    return null
  }

  const { data } = supabase.storage.from(SCENE_IMAGES_BUCKET).getPublicUrl(fileName)
  return data.publicUrl
}
