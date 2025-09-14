interface CategoriaPageProps {
  params: Promise<{ categoria: string }>
}

export default async function CategoriaPage({ params }: CategoriaPageProps) {
  const { categoria } = await params
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">Categoría: {categoria}</h1>
      <p className="text-gray-600 mt-2">En construcción...</p>
    </div>
  )
}