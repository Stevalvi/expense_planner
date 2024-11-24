import { v4 as uuidv4 } from 'uuid' // Se instala con npm i uuid y luego npm i --save-dev @types/uuid para instalar las definiciones de types
import { Category, DraftExpense, Expense } from "../types"

export type BudgetActions = 
    { type: 'add-budget', payload: {budget: number} } | // Va a ser ese budget del formulario y es de tipo number
    { type: 'show-modal' } | // No toma ningún payload porque solo cambia de false a true
    { type: 'close-modal' } | // Cierra el modal
    { type: 'add-expense', payload: { expense: DraftExpense } } | // Acción para nuevos gastos, de tipo DraftExpense, es decir, no va a tener un id. El id lo vamos a generar en el reducer.
    { type: 'remove-expense', payload: {id: Expense['id']} } | // Eliminar un gasto
    { type: 'get-expense-by-id', payload: {id: Expense['id'] } } | // Para identificar que id es el que queremos editar
    { type: 'update-expense', payload: { expense: Expense} } | // Editando el gasto, cuando vayamos a editar un gasto no se cree un nuevo gasto, sino que se actualice solamente. Cuando generamos uno nuevo es de tipo DraftExpense, osea temporal, pero como en este punto ya tenemos un gasto que tiene un id es de tipo Expense.
    { type: 'reset-app' } | // Reiniciar app
    { type: 'add-filter-category', payload: {id: Category['id'] } } // Para filtrar los gastos por categoría


export type BudgetState = { // Vamos a tener un state local o un state de presupuesto para este reducer
    budget: number
    modal: boolean
    expenses: Expense[] 
    editingId: Expense['id'] // Editar id, va a ser un gasto y vamos a leer su id
    currentCategory: Category['id']
}

// Tenemos dos localStorage para no tener tanta lógica, uno sería para el presupuesto y el otro para los gastos
const initialBudget = () : number => { // Requerimos el presupuesto, eso retorna un number
    const localStorageBudget = localStorage.getItem('budget')
    return localStorageBudget ? +localStorageBudget : 0 // En caso de que localStorage tenga algo, le decimos retorna ese localStorage pero lo voy a convertir a número +, caso contrario entonces va a iniciar en 0 ese presupuesto llamado budget.
}

const localStorageExpenses = () : Expense[] => { // Requerimos los gastos, su valor inicial va a ser Expense como arreglo.
    const localStorageExpenses = localStorage.getItem('expenses')
    return localStorageExpenses ? JSON.parse(localStorageExpenses) : [] // Si localStorageExpenses tiene algo, convertimos ese localStorage a parse porque obtenemos un number, caso contrario, retornamos un arreglo vacío.
}

export const initialState : BudgetState = { // Primero va a iniciar en 0 nuestro presupuesto, osea el budget, despues le asignamos initialBudget como valor inicial.
    budget: initialBudget(), // Va a ser su valor inicial
    modal: false, // El modal va a estar oculto por defecto, por eso está en false.
    expenses: localStorageExpenses(), // Va a ser su valor inicial
    editingId: '', // Va a ser un string vacío inicialmente
    currentCategory: '' // No va a tener nada porque se irá llenando en base a los filtros por categoría que haga el usuario con los gastos.
}

const createExpense = (draftExpense: DraftExpense) : Expense => { // Esta función toma un DraftExpense que no tiene un id pero si debe regresar un expense que tenga ese id, es decir, regresa un expense con el id de cada gasto.
    return {
        ...draftExpense, // Tomamos una copia del draftExpense
        id: uuidv4() // Le agrega ese id
    }
}

export const budgetReducer = ( // Que conozca su state y que funciones vamos a tener
        state: BudgetState = initialState,
        action: BudgetActions
    ) => {

    if(action.type === 'add-budget') {
        return {
            ...state, // Tomamos una copia del state
            budget: action.payload.budget // Que conozca su state y que funciones vamos a tener
        }
    }

    if(action.type === 'show-modal') {
        return {
            ...state,
            modal: true // Una vez que se presente ese evento o esa acción cambia a true y se muestra ese modal
        }
    }

    if(action.type === 'close-modal') {
        return {
            ...state,
            modal: false, // Cierra el modal
            editingId: '' // Esto es para que se reinicie ese formulario cuando vamos a editar un gasto y cerramos ese modal, es decir, nunca completamos la acción de actualizarlo. Entonces luego al intentar agregar un gasto, aparece esa información del gasto que ibamos a editar. Para evitar eso reiniciamos ese editingId a string vacío.
        }
    }

    if(action.type === 'add-expense') {
        const expense = createExpense(action.payload.expense)

        return {
            ...state, // Retornamos una copia del state
            expenses: [...state.expenses, expense], // Agregamos los gastos en su propio arreglo. Toma una copia del state.expense y agregale ese nuevo gasto a expense
            modal: false // Luego de agregar un gasto, reiniciamos el formulario y cambiamos el modal a false para ocultarlo.
        }
    }

    if(action.type === 'remove-expense') {
        return {
            ...state, // Mantenemos lo que tengamos
            expenses: state.expenses.filter( expense => expense.id !== action.payload.id) // Accedemos a cada gasto y le decimos, traete todos los que sean diferentes al payload que le estamos pasando, porque ese es el que queremos eliminar.
        }
    }

    if(action.type === 'get-expense-by-id') { // Identificamos el gasto a editar o actualizar
        return {
            ...state,
            editingId: action.payload.id, // Le pasamos lo que tomamos como payload
            modal: true // Cuando deslicemos para actualizar o editar queremos volver a mostrar ese modal para que el formulario se llene con esos datos del gasto 
        }
    }

    if(action.type === 'update-expense') { // Editando el gasto, cuando vayamos a editar un gasto no se cree un nuevo gasto, sino que se actualice solamente.
        return {
            ...state,
            expenses: state.expenses.map(expense => expense.id === action.payload.expense.id ? action.payload.expense : expense ),
            modal: false, // Luego de actualizar el gasto queremos ocultar ese modal
            editingId: '' // Luego de actualizar ese gasto cuando le damos click en el botón de + para agregar otro gasto, se muestra la información del gasto que actualizamos anteriormente, para evitar esto regresamos ese editinId a un string vacío. Ese editing siempre queda activo y como está en el useEffect, lo vuelve a llamar, por eso pasa eso, pero se soluciona asignandole el string vacío.
        } // Vamos a iterar sobre cada gasto con map, y vamos a validar que si ese gasto o su id es igual al que le estamos pasando al payload, es decir, al que queremos actualizar, entonces ? voy a reescribir de mis gastos con action.payload.expense, osea el objeto completo, caso contrario retorno el gasto sobre el cuál estoy iterando para no perder los otros gastos.
    }

    if(action.type === 'reset-app') { // Reiniciar app
        return {
            ...state,
            budget: 0, // Reiniciamos el presupuesto
            expenses: [] // Reiniciamos los gastos
        }
    }

    if(action.type === 'add-filter-category') { // Para filtrar los gastos por categoría
        return {
            ...state,
            currentCategory: action.payload.id // Le pasamos el id de lo que tengamos en el payload cuando demos click en esa categoría.
        }
    }
    
    return state
}