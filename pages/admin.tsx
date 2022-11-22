import { useEffect } from 'react'
import BlogPostPreview from '../previews/BlogPost'
import ContentPagePreview from '../previews/ContentPage'

const Admin = () => {
    useEffect(() => {
        ; (async () => {
            const CMS = (await import('netlify-cms-app')).default
            CMS.init();

            CMS.registerPreviewStyle('/admin.css')

            // hook our preview up to the cms
            CMS.registerPreviewTemplate('blog', BlogPostPreview)
            CMS.registerPreviewTemplate('page', ContentPagePreview)
        })()
    }, [])

    return <div />
}

export default Admin