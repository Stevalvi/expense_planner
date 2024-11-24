import { ChangeEvent, useEffect, useState } from "react";
import type { DraftExpense, Value } from "../types";
import { categories } from "../data/categories";
import DatePicker from 'react-date-picker'; // Se importa para el formato de fecha y hay que instalarlo con npm i react-date-picker
import 'react-calendar/dist/Calendar.css' // Se debe importar para el formato de fecha, se importa la dependencia para que aparezcan bien las fechas y ese formato de calendario, npm i react-calendar
import 'react-date-picker/dist/DatePicker.css' // Se debe importar para el formato de fecha, eso importa la hoja de estilos
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";

// Este componente va a tener el formulario para registrar gastos

export default function ExpenseForm() {

    // Definimos los valores iniciales en nuestro state, importamos state porque necesitamos un estado de manera local, no se requiere en el reducer. Por lo tanto lo hago en este archivo.
    const [expense, setExpense] = useState<DraftExpense>({ // Y le asignamos ese type de dato, sin el id, ya que el id se genera cuando guardemos ese gasto. Esto nos permite conectar nuestro con cada uno de los elementos como el input del nombre del gasto, la cantidad, la categoría y la fecha. Agregándoles ese value.
        amount: 0,
        expenseName: '',
        category: '',
        date: new Date()
    })
    const [error, setError] = useState('') // Inicia como string vacío
    const [previousAmount, setPreviousAmount] = useState(0) // Esto es para que cuando no tengamos presupuesto y queramos editar o actualizar un gasto para tener más disponible, no nos aparezca ese mensaje de se pasa del presupuesto, ya que antes estamos tratando de actualizar el gasto que ya consumió parte del presupuesto. Inicia en 0.
    const { dispatch, state, remainingBudget } = useBudget() // Extraemos el state para volver a llenar ese formulario cuando vayamos a actualizar un gasto. // remainingBudget es cuánto queda del presupuesto

    useEffect(() => { // Para llenar el formulario cuando deslicemos para actualizar ese gasto.
        if(state.editingId) { // Si tenemos algo en nuestro state
            const editingExpense = state.expenses.filter( currentExpense => currentExpense.id === state.editingId )[0] // Detectamos que gasto es con ese id, y como ese filter retorna un arreglo le colocamos que en la posición [0]. Nos traemos el id que sea igual al id que estemos presionando en actualizar
            setExpense(editingExpense) // Seteamos nuestro state y lo regresamos del global al local para tener esa validación acá. De esta forma ya se llena ese formulario con los datos del gasto a actualizar.
            setPreviousAmount(editingExpense.amount) // Cuando estemos editando vamos a congelar esa cantidad llamada previousAmount porque la requerimos. Esto es para que cuando no tengamos presupuesto y queramos editar o actualizar un gasto para tener más disponible, no nos aparezca ese mensaje de se pasa del presupuesto, ya que antes estamos tratando de actualizar el gasto que ya consumió parte del presupuesto.
        }
    }, [state.editingId]) // En caso de que editingId cambie, en caso de que pase de estar vacío a tener algo queremos ejecutar ese código.

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement> ) => { // Le establecemos el valor que nos da react al colocar onChange={e => } en el input y en el select para saber que tipo de dato es ese parámetro de e.
        const { name, value } = e.target
        const isAmountField = ['amount'].includes(name) // Va a retornar true o false en caso de que estemos en amount, porque nos interesa convertir amount a number
        setExpense({
            ...expense, // Tomamos una copia para no perder ese state
            [name] : isAmountField ? Number(value) : value // Escribimos en el name, si se cumple el isAmountField, es decir, si estamos en amount convertimos ese value a number, caso contrario, escribimos el value en el name de los otros campos, es decir, el del nombre y la categoría.
        })
    }

    const handleChangeDate = (value : Value) => {
        setExpense({
            ...expense, // Tomamos la copia del state como está
            date: value // Le ponemos que la fecha va a ser ese value, de esa forma cuando seleccionemos la fecha en el calendario se asigna ese valor que seleccionemos.
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // validar
        // Object.value lo que hace es tomar un objeto y lo transforma a arreglo
        if(Object.values(expense).includes('')) { // Si al menos un campo incluye un string vacío le mandamos el mensaje
            setError('Todos los campos son obligatorios')
            return // Para que no se siga ejecutando ese código después de mandar la alerta
        } 

        // Validar que no me pase del limite
        if( (expense.amount - previousAmount) > remainingBudget  ) { // La cantidad nueva expense.amount menos - la cantidad previa que ya estaba disponible es mayor a lo que tenemos como disponible, mostramos ese mensaje
            setError('Ese gasto se sale del presupuesto')
            return
        } // Es decir, supongamos que tenemos la cantidad previa que ya habiamos agregado que son 200, y luego queremos actualizar ese valor a 400, serían 400 - 200 = 200. Esto es para que cuando no tengamos presupuesto y queramos editar o actualizar un gasto para tener más disponible, no nos aparezca ese mensaje de se pasa del presupuesto, ya que antes estamos tratando de actualizar el gasto que ya consumió parte del presupuesto.

        // Agregar o actualizar el gasto
        if(state.editingId) { // Si estamos editando entonces vamos a actualizar
            dispatch({type: 'update-expense', payload: {expense: { id: state.editingId, ...expense }} }) // Si ya existe ese gasto, vamos a editarlo. Como el gasto que tenemos en el state de este formulario para tener validación no tiene el id, por lo tanto, debemos recuperarlo de algún lado. Entonces le decimos que el objeto de gasto expense, le decimos que el id que le hace falta viene de state.editingId, y del resto toma una copia de lo que tenemos en el state como gasto. Porque para actualizar ese gasto requerimos el id.
        } else { // Caso contrario generamos un nuevo gasto
            dispatch({type: 'add-expense', payload: { expense }}) // Si no existe ese gasto, lo creamos
        }

        // reiniciar el state o formulario después de agregar un gasto
        setExpense({
            amount: 0,
            expenseName: '',
            category: '',
            date: new Date()
        })
        setPreviousAmount(0) // Porque los siguientes que yo agregue quiero que vuelva a iniciar en 0, entonces cuando se monta el componente, si estamos editando pues que lo tome de ahí 
    }
    // {error && <ErrorMessage>{error}</ErrorMessage>} Si hay algo en error entonces ejecuta renderiza ese ErrorMessage con el mensaje de error.

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <legend
                className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2"
            >{state.editingId ? // Mostramos de forma condicional si es un nuevo gasto o si estamos editando un gasto. Si estamos editando mostramos Guardar Cambios, caso contrario, Nuevo gasto
                    'Guardar Cambios'
                    : 'Nuevo Gasto'}
            </legend>

            {error && <ErrorMessage>{error}</ErrorMessage>} 

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="expenseName"
                    className="text-xl"
                >Nombre Gasto:</label>
                <input
                    type="text"
                    id="expenseName"
                    placeholder="Añade el Nombre del gasto"
                    className="bg-slate-100 p-2"
                    name="expenseName"
                    onChange={handleChange}
                    value={expense.expenseName} // Le asignamos su valor
                />
            </div>

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="amount"
                    className="text-xl"
                >Cantidad:</label>
                <input
                    type="number"
                    id="amount"
                    placeholder="Añade la cantaidad del gasto: ej. 300"
                    className="bg-slate-100 p-2"
                    name="amount"
                    onChange={handleChange}
                    value={expense.amount}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="category"
                    className="text-xl"
                >Categoría:</label>
                <select
                    id="category"
                    placeholder="Añade la cantaidad del gasto: ej. 300"
                    className="bg-slate-100 p-2"
                    name="category"
                    onChange={handleChange}
                    value={expense.category}
                >
                    <option value="">-- Seleccione --</option>
                    {categories.map( category => ( // Iteramos y mostramos las categorias de ese categories.ts de data
                        <option 
                            key={category.id} // Y siempre que usemos map para iterar debemos usar un key y agregarle el valor único
                            value={category.id}
                        >{category.name}</option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="date"
                    className="text-xl"
                >Fecha Gasto:</label>
                <DatePicker
                    className="bg-slate-100 p-2 border-0"
                    value={expense.date}
                    onChange={handleChangeDate}
                />
            </div>

            <input
                type="submit"
                className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
                value={state.editingId ? 'Guardar Cambios' : 'Registrar Gasto'} // Muestra de forma dinámica si ya existe el gasto para editarlo o si es nuevo para registrarlo. Si estamos editando sería Guardar Cambios, caso contrario Registrar Gasto
            />
        </form>
    )
}
