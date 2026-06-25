import { supabase } from './supabase'
import { Template, Theme, Background } from '../types'
import { uploadAsset } from './storage'

export type TemplateSort = 'popular' | 'new'

// Danh sách template công khai (chợ template). search lọc theo tên.
export async function listTemplates(sort: TemplateSort = 'popular', search = ''): Promise<Template[]> {
  let q = supabase.from('templates').select('*').eq('is_public', true)
  if (search.trim()) q = q.ilike('name', '%' + search.trim() + '%')
  q = sort === 'new'
    ? q.order('created_at', { ascending: false })
    : q.order('downloads', { ascending: false })
  const { data, error } = await q.limit(60)
  if (error) throw error
  return (data ?? []) as Template[]
}

// Template do chính user đã đăng
export async function myTemplates(userId: string): Promise<Template[]> {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Template[]
}

export type PublishTemplateInput = {
  ownerId: string
  name: string
  description?: string
  previewUrl?: string
  tags?: string[]
  theme: Theme | null
  background: Background | null
  isPublic?: boolean
}

// Đăng 1 template mới lên chợ
export async function publishTemplate(input: PublishTemplateInput): Promise<Template> {
  const { data, error } = await supabase
    .from('templates')
    .insert({
      owner_id: input.ownerId,
      name: input.name,
      description: input.description ?? null,
      preview_url: input.previewUrl ?? null,
      tags: input.tags ?? [],
      theme: input.theme,
      background: input.background,
      is_public: input.isPublic ?? true,
    })
    .select('*')
    .single()
  if (error) throw error
  return data as Template
}

// Upload ảnh preview cho template (tái dùng bucket assets, folder 'template')
export async function uploadTemplatePreview(userId: string, file: File): Promise<string> {
  return uploadAsset(userId, file, 'template')
}

// Áp dụng template: tăng lượt tải + trả theme/background để Editor set vào profile
export async function useTemplate(template: Template): Promise<{ theme: Theme | null; background: Background | null }> {
  const { error } = await supabase.rpc('use_template', { template_id: template.id })
  if (error) throw error
  return { theme: template.theme, background: template.background }
}

// Xoá template của mình
export async function deleteTemplate(id: string): Promise<void> {
  const { error } = await supabase.from('templates').delete().eq('id', id)
  if (error) throw error
}
