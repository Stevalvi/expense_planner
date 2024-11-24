import { useMemo } from "react"
import { useBudget } from "../hooks/useBudget"
import ExpenseDetail from "./ExpenseDetail"

// Este componente muestra el listado de gastos

export default function ExpenseList() {

    const { state } = useBudget() // Queremos extraer los gastos
    const filteredExpenses = state.currentCategory ? state.expenses.filter( expense => expense.category === state.currentCategory) : state.expenses // Mostramos los gastos de la categoría seleccionada. Si hay una categoría seleccionada, entonces ? vamos a filtrar los gastos que tenga esa categoría con filter, accedemos a cada gasto y le decimos que si la categoría del gasto es igual a la categoría seleccionada, pues va a mostrar ese gasto con esa categoría seleccionada, caso contrario, osea que si no hay nada retornamos todos los gastos.
    const isEmpty = useMemo(() => filteredExpenses.length === 0, [filteredExpenses]) // Va a estar pendiente de esa dependencia de FilteredExpenses cada vez que cambie, si el filteredExpenses es igual a 0, es decir, no se han agregado gastos, que muestre ese mensaje de No hay gastos, caso contrario, mostramos la información de cada gasto.
    
    return (
        <div className="mt-10 bg-white shadow-lg rounded-lg p-10">
            {isEmpty ? <p className="text-gray-600 text-2xl font-bold">No Hay Gastos</p> : (
                <>
                    <p className="text-gray-600 text-2xl font-bold my-5">Listado de Gastos.</p>
                    {filteredExpenses.map( expense => ( // Iteramos sobre cada gasto y los mostramos
                        <ExpenseDetail 
                            key={expense.id}
                            expense={expense} // Le pasamos su gasto
                        />
                    ))}
                </>
            )}
        </div>
    )
}
