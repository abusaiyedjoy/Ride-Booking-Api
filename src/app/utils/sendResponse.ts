import { Response } from "express"


interface TMeta {
    total: number,
};

interface TResponse<T> {
    status: number,
    success: boolean,
    message: string,
    data: T,
    meta?: TMeta
}

export const sendResponse = <T>(res: Response, data: TResponse<T>)=>{
    res.status(data.status).json({
        status: data.status,
        success: data.success,
        message: data.message,
        data: data.data,
        meta: data.meta
    })
}