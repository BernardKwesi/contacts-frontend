import { toast } from 'react-toastify';

const toastConfig = {
    position: "top-right",
    autoclose: 1500,
    hideProgessIndicator : false,
    closeOnClick : true,
    pauseOnHover: true,
    draggable: true,
    progress : undefined,
    theme: 'light'
}


export function toastSuccess(message){
    console.log(message)
    toast.success(message, toastConfig)
}

export function toastInfo(message){
    toast.info(message, toastConfig)
}

export function toastWarning(message){
    toast.warn(message, toastConfig)
}


export function toastError(message){
    toast.error(message, toastConfig)
}