class ApiException extends Error {
    status: number;
    mssage: string;

    constructor(errorMessage?: string, status?: number, ) {
        super(errorMessage || 'Something went wrong');
              
        this.status = status || 500;
    }
}
 
export default ApiException;