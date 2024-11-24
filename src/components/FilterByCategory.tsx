import { ChangeEvent } from "react";
import { categories } from "../data/categories";
import { useBudget } from "../hooks/useBudget";

// Este componente va a filtrar los gastos por categoría

export default function FilterByCategory() {

    const { dispatch } = useBudget() // Extraemos el dispatch porque vamos a escribir en el state

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        dispatch({type: 'add-filter-category', payload: {id: e.target.value}}) // El payload va a ser el id porque le estamos pasando el value como id en el option
    }

    return (
        <div className="bg-white shadow-lg rounded-lg p-10">
            <form>
                <div className="flex flex-col md:flex-row md:items-center gap-5">
                    <label htmlFor="category">Filtrar Gastos</label>
                    <select 
                        id="category"
                        className="bg-slate-100 p-3 flex-1 rounded"
                        onChange={handleChange}
                    >
                        <option value="">-- Todas las Categorias</option>
                        {categories.map(category => ( // Iteramos las categorías y retornamos una opción por cada una de ellas
                            <option 
                                value={category.id} // Eso es lo que colocamos en el state
                                key={category.id}
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </form>

        </div>
    )
}
