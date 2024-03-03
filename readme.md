# MERN Stack Project - Travel Together

Here is to simplify some parts of the MERN Project that might be a little of a chanllenge to implement in other projects in the future if your not used to them.

## 1- Error Handling Middleware & Function
* When working in the backend , you're going to need to informe the front-end of certain errors, and even need to customize those errors, specialy in thier payload message, therefor, it's good to create a function and a middleware that will help assure that, and facilitate the job.
* Function:
    - The Function(error.js) has to be in a folder named "utils", and its operation, is to take the statusCode and message and return an Error object (const error = new Error()), with these attributes:
    ```
    const errorHandler = (statusCode, message) => {
        const error = new Error()
        error.statusCode = statusCode
        error.message = message
        return error
    }

    module.exports = errorHandler
    ```
* Middleware:
    - This middleware has to be in the end of the code in the backend/index.js page.
    - It takes four arguments: err, req, res, next
    - Its operation is to return an error with its status code and message, including other attibutes, so we can adentify the error even if it's something customizable for our case, like some empty fields...
    - ! Because it's a middleware, to get to it, we need to add 'next' to all the other controller functions, cause it's what we'll use to pass to the error middleware
    - In the next function, that we passed as an attribute to the controller function, we set the error, if it's already a give error we can do this:
    ```
    catch (error) {
        next(error)
    }
    ```
    Or if we're setting it , then we can use the **errorHandling** function:
    ```
    if (!username || !email || !password || username === '' || email === '' || password === ''){
        next(errorHandler(400, 'All fields are required'))
    }
    ```
    - The Code of the middleware:
    ```
    app.use((err, req, res, next) => {
        const statusCode = err.statusCode || 500
        const message = err.message || 'Internal Server Error'
        res.status(statusCode).json({
            success: false,
            statusCode,
            message
        })
    })
    ```