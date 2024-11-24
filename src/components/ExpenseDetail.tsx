import { useMemo } from "react"
import {
    LeadingActions, // Son las acciones que vienen de uno de los costados, es decir, de un lado
    SwipeableList,
    SwipeableListItem,
    SwipeAction,
    TrailingActions // Son las acciones que vienen del otro lado
 } from 'react-swipeable-list' // Son dependencias que permiten la opción de editar o eliminar deslizando hacia la izquierda o derecha. npm i react-swipeable-list
import { formatDate } from "../helpers"
import { Expense } from "../types"
import AmountDisplay from "./AmountDisplay"
import { categories } from "../data/categories"
import { useBudget } from "../hooks/useBudget"
import "react-swipeable-list/dist/styles.css" // Esa dependencia de react-swipeable-list tiene su propia hoja de estilos, por lo tanto, hay que importarla

type ExpenseDetailProps = {
    expense : Expense // De tipo Expense
}

// Este componente muestra la información de los gastos cuando se hayan agregado

export default function ExpenseDetail({expense} : ExpenseDetailProps) { // Extraemos ese gasto o expense
    const { dispatch } = useBudget() // Solamente requerimos el dispatch

    // En base a la categoría vamos a mostrar el tipo de ícono correspondiente por categoría.
    const categoryInfo = useMemo(() => categories.filter(cat => cat.id === expense.category)[0], [expense]) // Ese ueMemo va a estar pendiente de ese expense, es decir, puede que haya creado un gasto y le asigné cierta categoría, y luego puede que al editarlo le cambie la categoría, entonces va a estar revisando cada vez que cambie ese expense o gasto, ya sea porque creamos o editamos ese gasto. Ese filter va a iterar sobre cada categoría y supongamos que estamos en el id 5, ese filter nos trae todo ese objeto: { id: '5', name: 'Ocio', icon: 'ocio' }, y ya tenemos acceso a esa categoría, y como ese filter retorna un arreglo le colocamos que en la posición 0. Va a revisar la coincidencia de cat.id === expense.category.

    const leadingActions = () => ( // Cuando deslizamos ese gasto del lado izquierdo al derecho . Y en ese SwipeAction es lo que se dispara cuando recorremos esos pixeles del maxSwipe
        <LeadingActions>
            <SwipeAction
                onClick={() => dispatch({type: 'get-expense-by-id', payload: {id: expense.id}})} // Actualizamos el gasto pasándole la acción y lo que tomamos en el payload que es el id
            >
                Actualizar
            </SwipeAction>
        </LeadingActions>
    )

    const trailingActions = () => ( // Cuando deslizamos el gasto del lado derecho al izquierdo. Y en ese SwipeAction es lo que se dispara cuando recorremos esos pixeles del maxSwipe
        <TrailingActions>
            <SwipeAction
                onClick={() => dispatch({type: 'remove-expense', payload: {id: expense.id}})} // Eliminamos ese gasto del state, y como ese expense ya tiene el id, entonces le pasamos ese expense.id
                destructive={true} // Esa animación es para que elimine ese gasto, pero no lo elimina del state, por lo tanto, para eliminarlo del state debemos disparar esa acción de eliminar un gasto llamada 'remove-expense'
            >
                Eliminar
            </SwipeAction>
        </TrailingActions>
    )
  
    return ( // Rodeamos todo ese div por el componente de SwipeableList, luego por el componente SwipeableListItem y le añadimos los props que espera ese componente, uno obligatorio es el maxSwipe que son los pixeles que queremos que se recorran para disparar esas acciones, también debemos especificarle cuáles son las acciones y la configuración. Los leadingActions son por ejemplo lo que queremos hacer cuando deslicemos hacia el lado izquierda al derecho, y el trailingActions es lo que queremos ejecutar al deslizar del lado derecho a izquierdo
        <SwipeableList>
            <SwipeableListItem
                maxSwipe={1}
                leadingActions={leadingActions()}
                trailingActions={trailingActions()}
            >
                <div className="bg-white shadow-lg p-5 w-full border-b border-gray-200 flex gap-5 items-center">
                    <div>
                        <img
                            src={`/icono_${categoryInfo.icon}.svg`} // Mostramos el ícono correspondiente a cada categoría
                            alt="icono gasto"
                            className="w-20"
                        />
                    </div>

                    <div className="flex-1 space-y-2">
                        <p className=" text-sm font-bold uppercase text-slate-500">{categoryInfo.name}</p>
                        <p>{expense.expenseName}</p>
                        <p className="text-slate-600 text-sm">{formatDate( // Convertimos la fecha a tipo string para que la renderice bien y para que nos muestre bien el formato de fecha lo formateamos tal cuál como hicimos con cantidad en el index.ts
                            expense.date!.toString())}</p>
                    </div>

                    <AmountDisplay
                        amount={expense.amount} // Mostramos la cantidad
                    />

                </div>
            </SwipeableListItem>
        </SwipeableList>
    )
}
