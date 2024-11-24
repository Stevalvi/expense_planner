import { formatCurrency } from "../helpers"

type AmountDisplayProps = {
    label?: string // Es opcional, puede ser que esté o no esté
    amount: number
}
export default function AmountDisplay({label, amount} : AmountDisplayProps)  {
  return (
    <p className="text-2xl text-blue-600 font-bold">
        {label && `${label}: `} 
        <span className="font-black text-black">{formatCurrency( amount )}</span>
    </p> // Ese formatCurreny le da el formato de dinero a esa cantidad. Le decimos que si tenemos un label && que ejecute ese `${label}`
  )
}
