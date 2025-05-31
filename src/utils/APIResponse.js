class APIResponse{
    constructor(statusCode,message,Data){
        this.statusCode=statusCode
        this.message=message
        this.Data=Data
        this.success=this.statusCode<400

    }
}


export {APIResponse}