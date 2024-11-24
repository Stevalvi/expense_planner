import { useContext } from "react" // Que nos permite crear y usar ese ContextAPI
import { BudgetContext } from "../context/BudgetContext"

// De esta forma solo basta con importar useBudget en nuestros componentes sin necesidad de importar useContext y BudgetContext en cada componente para usarlo, ya que useBudget contiene eso.

export const useBudget = () => { // Va a retornar el context completo.
    // Creamos un Hook para fácilmente acceder al Context y al Reducer
    // De esa forma tenemos acceso a esos props que podremos consumir en nuestros componentes, en este caso el state y el dispatch de ese BidgetContext

    // De esta forma utilizamos los hooks de React para conectar con el context que nosotros hemos creado personalizado
    const context = useContext(BudgetContext)
    if(!context) { // Una buena práctica a la hora de usar un hook que use context, es colocar que si no existe ese context se muestra este error. Básicamente lo que dice es que se debe rodear ese <App /> con <BudgetProvider> para que rodee la aplicación y funcione ese provider
        throw new Error('useBudget must be used within a BudgetProvider')
    }
    return context
}