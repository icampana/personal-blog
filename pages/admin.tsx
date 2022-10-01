import { useEffect } from 'react'
import BlogPostPreview from '../previews/BlogPost'

const Admin = () => {
    useEffect(() => {
        ; (async () => {
            const CMS = (await import('netlify-cms-app')).default
            CMS.init();

            CMS.registerPreviewStyle('/admin.css')

            // hook our preview up to the cms
            CMS.registerPreviewTemplate('blog', BlogPostPreview)
        })()
    }, [])

    return <div />
}

export default Admin