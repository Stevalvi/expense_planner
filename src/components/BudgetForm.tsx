import { useMemo, useState } from "react"
import { useBudget } from "../hooks/useBudget"

// Creamos el formulario para definir el presupuesto

export default function BudgetForm() {

    const [budget, setBudget] = useState(0) // Requerimos un state local, requerimos el state para validar el formulario, en caso de que pase la validación ya escribimos en nuestro reducer. Inicia en 0 nuestro presupuesto o formulario.
    const { dispatch } = useBudget() // Importamos el hook de useBudget y de esa forma ya tenemos acceso al dispatch

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setBudget(e.target.valueAsNumber) // Lo seteamos en nuestro state. Accedemos a ese valor y lo convertimos a number, como el input es de type number si lo soporta a diferencia del type radio del otro proyecto que tocó usar el + para convertirlo a number
    } 
    const isValid = useMemo(() => { // Validar formulario
        return isNaN(budget) || budget <= 0 // Si es NaN o es menor o igual a 0, no es un presupuesto válido
    }, [budget]) // Es decir cada vez que ese budget cambie queremos revisar esta función, solamente cuando el usuario esté escribiendo queremos revisar esta función, por eso usamos useMemo

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch({type: 'add-budget', payload: {budget}}) // Requiere un budget de tyipo number
    }

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-5">
                <label htmlFor="budget" className="text-4xl text-blue-600 font-bold text-center">
                    Definir Presupuesto
                </label>
                <input
                    id="budget"
                    type="number"
                    className="w-full bg-white border bordger-gray-200 p-2"
                    placeholder="Define tu presupuesto"
                    name="budget"
                    value={budget}
                    onChange={handleChange}
                />
            </div>

            <input
                type="submit"
                value='Definir Presupuesto'
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer w-full p-2 text-white font-black uppercase disabled:opacity-40"
                disabled={isValid} // Va a agregarle un true cuando no sean números y de esa forma lo deshabilitamos, y solo cuando sea false, es decir, estamos agregando correctamente los valores, permitimos presionar el botón
            />
        </form>
    )
}
