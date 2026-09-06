interface PageTitleProps {
  title: string
  description?: string
}

function PageTitle({ title, description }: PageTitleProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold">{title}</h1>

      {description && (
        <p className="mt-1 text-gray-600">{description}</p>
      )}
    </div>
  )
}

export default PageTitle