import { addStateOnJOb } from '@/http/event';
import { X } from 'lucide-react'
import React, { FC, useCallback, useState } from 'react'
import toast from 'react-hot-toast';


interface Props {
    open: boolean;
    onClose: () => void;
    id: string;
}

const AddState: FC<Props> = ({ onClose, open, id }) => {
    const [state, setState] = useState('');
    const [loading, setLoading] = useState(false);


    const onAdd = useCallback(async () => {
        setLoading(true)
        try {
            const res = await addStateOnJOb(id, { state });
            toast.success(res.data.message)
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }, [state, id])
    return (
        <div className={`fixed top-0 left-0 right-0 bottom-0 w-[100vw] h-[100vh] flex items-center justify-center bg-black/20 z-[1000000] ${!open && 'hidden'}`}>
            <div className='w-[40rem] bg-white shadow-md rounded-md p-5 space-y-4 flex items-center flex-col justify-center relative'>
                <button className='absolute top-2 right-2' onClick={onClose}><X /></button>
                <h3 className='text-black text-3xl'>Add New State</h3>
                <input
                    className='py-2 px-2 border border-grayLight outline-none rounded-md w-full'
                    placeholder='New State'
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                />

                <textarea
                    className='py-2 px-2 border border-grayLight outline-none rounded-md w-full h-[10rem]'
                    placeholder='State Description'
                />
                <button className={`!py-3 px-8 bg-themePrimary rounded-lg shadow-themePrimary text-white disabled:opacity-40`} disabled={loading} onClick={onAdd}>
                    {loading ? "Loading..." : "Add Now"}
                </button>
            </div>
        </div>
    )
}

export default AddState