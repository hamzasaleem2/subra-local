import { Helmet } from "react-helmet-async"

interface SEOProps {
  title: string
  description: string
  image?: string
  url?: string
  noindex?: boolean
  children?: React.ReactNode
}

export function SEO({ title, description, image, url, noindex, children }: SEOProps) {
  const siteUrl = "https://subra.app"
  const defaultImage = `${siteUrl}/og-image.png`
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url || siteUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || defaultImage} />
      
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url || siteUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image || defaultImage} />
      
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <link rel="canonical" href={url || siteUrl} />
      
      {noindex && <meta name="robots" content="noindex" />}
      {children}
    </Helmet>
  )
}