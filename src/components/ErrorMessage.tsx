import { PropsWithChildren } from "react"

export default function ErrorMessage({children} : PropsWithChildren) { // Con ese children hacemos referencia a ese {error}
  return (
    <p className='bg-red-600 p-2 text-white font-bold text-sm text-center'>
        {children} 
    </p> // Renderizamos ese children
  )
}