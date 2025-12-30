import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
    return createBrowserClient(
        'https://zrjznebxxtlhykyaizaf.supabase.co',
        'sb_publishable_trplQLyMWTwlTIKykYzgNA_ubB1y0hY'
    )
}