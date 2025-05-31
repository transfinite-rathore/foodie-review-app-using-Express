class APIError extends Error{

    constructor(statusCode,message="Something went wrong",erros=[],stack){
        super(message)
        this.statusCode=statusCode
        this.message=message
        this.data=null
        this.success=false
        this.erros=[]

        if(stack){
            this.stack=stack
        }
        else{
        Error.captureStackTrace(this,this.constructor)
        }
    }



}

export {APIError}