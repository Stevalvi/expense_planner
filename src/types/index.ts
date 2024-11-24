// Definimos el type para los gastos

export type Expense = { // Vamos a generar ese id hasta que se guarde ese gasto, en proyectos anteriores se generaba el id cuando cargaba el componente. Ambas formas van a ser comunes
    id: string
    expenseName: string // Va a ser el nombre del gasto
    amount: number // Va a ser la cantidad del gasto
    category: string
    date: Value
}

export type DraftExpense = Omit<Expense, 'id'> // Va a ser lo mismo que el type de Expense pero sin el id

type ValuePiece = Date | null;
export type Value = ValuePiece | [ValuePiece, ValuePiece]; // De esa forma la libreria react-date-picker define el type a las fechas

export type Category = {
    id: string
    name: string
    icon: string
}