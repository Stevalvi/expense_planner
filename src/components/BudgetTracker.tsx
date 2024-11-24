import { CircularProgressbar, buildStyles} from 'react-circular-progressbar' // Se instala con npm i react-circular-progressbar. Es para agregar una gráfica circular interactiva. Ese buildStyles va a permitir darle los estilos a nuestra gráfica.
import { useBudget } from "../hooks/useBudget";
import AmountDisplay from "./AmountDisplay";
import "react-circular-progressbar/dist/styles.css" // Importamos su hoja de estilos.

// Este es el componente que se muestra una vez que el usuario ha registrado un presupuesto, muestra el presupuesto, gastado y disponible.

export default function BudgetTracker() {
    const { state, totalExpenses, remainingBudget, dispatch} = useBudget() // Extraemos el state porque ahí tenemos las actividades, ahí vienen las cantidades que hemos gastado, y el presupuesto. Importamos el dispatch para resetear la app con ese button.

    // totalExpenses es cuánto hemos gastado

    // remainingBudget es cuánto queda del presupuesto

    const percentage = +((totalExpenses / state.budget) * 100).toFixed(2) // Calculamos el total gastado para volver interactiva esa gráfica. Es decir, primero convertimos ese resultado a number con +, el total gastado sobre el presupuesto y el resultado se multiplica por 100 y con toFixed le decimos que máximo 2 decimales. Es decir, si un resultado nos da 50.43233 con ese fixed nos trae solamente 50.43. Supongamos que tenemos un presupuesto de 500 y un gasto de 300, sería 300/500*100 eso nos dá 60 que sería 60% gastado

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex justify-center">
                <CircularProgressbar
                    value={percentage}
                    styles={buildStyles({
                        pathColor: percentage === 100 ? '#DC2626' : '#3b82f6',
                        trailColor: '#F5F5F5',
                        textSize: 8,
                        textColor: percentage === 100 ? '#DC2626' : '#3b82f6',
                    })} // El value es el valor que requiere para graficar, en base a ese valor la gráfica toma el porcentaje. Y ese buildStyles es el que permite darle la apariencia a esa gráfica. pathColor es el color de la gráfica, el trailColor es el color que se le dá a lo que no se ha gastado, es decir, al disponible. Le asignamos el color rojo cuando llenemos el presupuesto, pero a lo demás le agregamos el azul. Lo mismo con el texto. Y ese textSize es el tamaño de la letra.
                    text={`${percentage}% Gastado`}
                />
            </div>

            <div className="flex flex-col justify-center items-center gap-8">
                <button
                    type="button"
                    className="bg-pink-600 w-full p-2 text-white uppercase font-bold rounded-lg"
                    onClick={() => dispatch({type: 'reset-app'})} // Reseteamos la app
                >
                    Resetear App
                </button>

                <AmountDisplay
                    label="Presupuesto"
                    amount={state.budget} // De esa forma lo hacemos dinámico
                />

                <AmountDisplay
                    label="Disponible"
                    amount={remainingBudget}
                />

                <AmountDisplay
                    label="Gastado"
                    amount={totalExpenses}
                />
            </div>
        </div>
    )
}
