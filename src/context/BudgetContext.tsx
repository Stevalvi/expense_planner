import { useReducer, createContext, Dispatch, ReactNode, useMemo } from "react" // Con createContext creamos el context
import { BudgetActions, BudgetState, budgetReducer, initialState } from "../reducers/budget-reducer"

// Para empezar a usar nuestro contextApi primero creamos el provider, el provider es de donde vienen los datos y los datos van a venir de nuestro reducer. Sin embargo, tenemos que agregarlo para tener de esa forma acceso al estado y también a las funciones que modifican nuestro estado.

type BudgetContextProps = { // Porque es lo que va a manejar ese provider
    state: BudgetState
    dispatch: Dispatch<BudgetActions>
    totalExpenses: number
    remainingBudget: number
} // remainingBudget es cuánto queda del presupuesto, totalExpenses es cuánto hemos gastado

type BudgetProviderProps = { // Es común usar ReactNode cuando queremos establecer un valor pero no sabemos específicamente que valor debe ser, pero de esta forma evitamos ese any.
    children: ReactNode
}

// Context es la acción de tener el estado global, pero provider va a ser los datos que va a tener ese context.

export const BudgetContext = createContext<BudgetContextProps>(null!) // De esta forma el context ya sabe que tiene ese dispatch, de dónde vienen y el provider tiene el acceso a esa información. 

export const BudgetProvider = ({ children }: BudgetProviderProps) => { // Siempre es un arrow function y siempre retorna algo. Esto toma children, un children es un prop propio de react que hace referencia a los hijos de un componente. El children se utiliza por ejemplo si requerimos hacer referencia a los hijos de un componente pero no sabemos como se llaman, entonces usamos children que hace referencia a todos los hijos de un componente. Y como children por defecto es de tipo any, creamos un type personalizado y se lo asignamos.
    
    // Lo instanciamos
    const [state, dispatch] = useReducer(budgetReducer, initialState) // El useReducer toma dos valores, el reducer y el state inicial, y al usarlo acá nos permite acceder a esos elementos de budget-reducer.tsz
    const totalExpenses = useMemo(() => state.expenses.reduce((total, expense) => expense.amount + total, 0), [state.expenses]) // Eso calcula el total gastado. Queremos que se ejecute ese código cada vez que cambie el state de gastos, osea expenses, cada vez que tengamos nuevos gastos o los actualicemos se va a ejecutar ese código. ese reduce toma dos parámetros, el total que es el acumulado y expense que es el objeto actual, entonces le sumamos la cantidad + el total y su valor inicial es 0. Es decir, amount es la cantidad que inicia en 0, y le sumamos el total que serían los gastos.
    
    const remainingBudget = state.budget - totalExpenses // Eso calcula el presupuesto que nos queda. Es decir restamos el presupuesto - los gastos que hemos hecho

    return ( // Y en este return vamos a pasarle el state y el dispatch, de esa forma siempre que utilicemos el provider vamos a tener acceso a nuestro reducer y a las funciones de ese reducer.

        // Eso rodea toda nuestra aplicación de react y vamos a tener acceso de forma fácil a ese state y al dispatch. Y este context espera esos props, tanto state como dispatch por eso debemos pasarselos con ese prop llamado value, siempre Provider tiene ese value. Aquí es donde se conectan nuestro context y el provider
        <BudgetContext.Provider
            value={{
                state,
                dispatch,
                totalExpenses,
                remainingBudget
            }}
        >
            {children}
        </BudgetContext.Provider>
    )
}