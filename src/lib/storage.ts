import { supabase } from './supabase'

// Upload 1 file lên bucket 'assets', trả về public URL.
// Đường dẫn: <userId>/<folder>-<timestamp>.<ext>
export async function uploadAsset(
  userId: string,
  file: File,
  folder: string,
): Promise<string> {
  const ext = file.name.split('.').pop() || 'bin'
  const path = userId + '/' + folder + '-' + Date.now() + '.' + ext
  const { error } = await supabase.storage
    .from('assets')
    .upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from('assets').getPublicUrl(path)
  return data.publicUrl
}
