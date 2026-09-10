interface PageTitleProps {
  title: string
  description?: string
}

function PageTitle({ title, description }: PageTitleProps) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
        {title}
      </h1>

      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
          {description}
        </p>
      )}
    </div>
  )
}

export default PageTitle