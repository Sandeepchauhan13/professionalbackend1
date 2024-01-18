// advance syntax of  asyncHandler with the use of promises  
const asyncHandler = (requestHandler) => {
(req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err)=> next(err))
}
}





export {asyncHandler}


// asyncHandler is higher order function as a parameter b accept kar sakte hen ya phir return kar sakte hen as variable hi treat karte hen 

// const asyncHandler = () => {}
// const asyncHandler = (func) => () = {}
// two function with and make it async 
// const asyncHandler = (func) => async () = {}

// #try catch code 
// const asyncHandler = (fn) => async (req, res, next) => {
// try{
// await fn(req, res, next)
// }catch (error){
//     res.status(err.code || 500).json({
//         success: false,
//         message: err.message
//     })
// }
// }