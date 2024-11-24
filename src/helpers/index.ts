export function formatCurrency(amount: number) { // Va a tomar una cantidad de tipo number 
    return new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(amount)
} // Para formatearlo como dólar y le decimos que queremos formatear amount para que lo muestre con ese $ y los dos ceros al final

export function formatDate(dateStr: string) : string { // Formateamos la fecha, toma un string y regresa un string
    const dateObj = new Date(dateStr) // La convertimos a un objeto de tipo fecha para poder formatearla
    const options : Intl.DateTimeFormatOptions = { // Especificamos el tipo de dato, de esta forma va a ser un objeto con la información que requiere
        weekday: 'long', // Es decir, queremos el nombre completo
        year: 'numeric',
        month: 'long', // Traiga el nombre completo del mes
        day: 'numeric'
    }
    return new Intl.DateTimeFormat('es-ES', options).format(dateObj) // Le decimos que lo queremos en español y le pasamos las opciones
} // De esa forma estamos creando el objeto, le pasamos la configuración y estamos retornando la fecha formateada