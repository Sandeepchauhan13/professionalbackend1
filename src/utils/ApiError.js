class ApiError extends Error{
    // constructor and super for  override 
    constructor(
     statusCode,
     message = "Something went wrong",
     errors = [],
     stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false ;
        this.errors = errors
        // stack trace particularly yha yha errors hai 
        if (stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
export {ApiError}