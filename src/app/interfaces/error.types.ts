
export interface TErrorResource {
    path: string,
    message: string
}

export interface TGenericErrorResponse {
    statusCode: number,
    success: boolean,
    message: string,
    errorMessages?: TErrorResource[],
};