import { Fragment } from 'react'
import { PlusCircleIcon } from '@heroicons/react/24/solid' // Instalamos como dependencias de desarrollo npm i @heroicons/react 
import { Dialog, Transition } from '@headlessui/react' // Instalamos como dependencias de desarrollo npm i @headlessui/react
import { useBudget } from '../hooks/useBudget'
import ExpenseForm from './ExpenseForm'

// Este componente crea la ventana modal que nos permite registrar o crear gastos

export default function ExpenseModal() {

    const { state, dispatch } = useBudget() // Extraemoos el state porque ese modal se muestra dependiendo del show={}, y el dispatch porque es el que dispara ese button cuando presionemos en él y lo cambia a true para mostrar el modal.

    return (
        <>
            <div className="fixed right-5 bottom-5 flex items-center justify-center">
                <button
                type="button"
                onClick={() => dispatch({type: 'show-modal' })} // Mostramos el modal cuando demos click en el botón de + con el fondo azul
                >
                <PlusCircleIcon className='w-16 h-16 text-blue-600 rounded-full' />
                </button>
            </div>

            <Transition appear show={state.modal} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => dispatch({type: 'close-modal'})} // Cierra el modal
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-75" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                
                                <ExpenseForm />
                
                            </Dialog.Panel>
                        </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}