interface PageTitleProps {
  title: string
  description?: string
}

function PageTitle({ title, description }: PageTitleProps) {
  return (
    <div className="mb-7">
      <h1 className="text-2xl font-semibold tracking-tight text-gray-100 md:text-3xl">
        {title}
      </h1>

      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
          {description}
        </p>
      )}
    </div>
  )
}

export default PageTitle