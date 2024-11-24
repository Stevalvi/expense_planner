import { useEffect, useMemo } from "react"
import BudgetForm from "./components/BudgetForm"
import { useBudget } from "./hooks/useBudget"
import BudgetTracker from "./components/BudgetTracker"
import ExpenseModal from "./components/ExpenseModal"
import ExpenseList from "./components/ExpenseList"
import FilterByCategory from "./components/FilterByCategory"

function App() {  
  const { state } = useBudget() // Importamos el custom hook de useBudget para poder usar ese state. Y como es un hook se debe retornar un objeto a diferencia de como lo hacíamos en otros proyecots anteriores que era como un arreglo.
  const isValidBudget = useMemo(() => state.budget > 0, [state.budget]) // Creamos una función para validar ese presupuesto, cada vez que cambie ese state.budget ejecutamos esa función de isValidBudget

  useEffect(() => {
    localStorage.setItem('budget', state.budget.toString()) // Como localStorage no acepta numbers lo convertimos a string para almacenarlo en localStorage
    localStorage.setItem('expenses', JSON.stringify(state.expenses)) // Convertimos ese arreglo a string
  }, [state]) // Escuchamos por todos los cambios en el state para que a medida que cambien los gastos o presupuestos se almacene en ese localStorage y se graben.
  
  return (
    <>
      <header className="bg-blue-600 py-8 max-h-72">
        <h1 className="uppercase text-center font-black text-4xl text-white">
          Planificador de Gastos
        </h1>
      </header>

      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg mt-10 p-10">
          {isValidBudget ? <BudgetTracker />  : <BudgetForm />} 
      </div> 

      {isValidBudget && ( // Esto va a crear la ventana modal para registrar o agregar gastos, y agregamos como validación que si se cumplió esa función de isValidBudget se muestren estos componentes
        <main className="max-w-3xl mx-auto py-10">
          <FilterByCategory />
          <ExpenseList />
          <ExpenseModal />
        </main>
      )} 
    </>
  ) // En caso de que isValidBudget se cumpla, renderizamos el componente de tracker, caso contrario, lo renderizamos al componente que le pide registrar un presupuesto
}

export default App
