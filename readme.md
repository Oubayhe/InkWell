# MERN Stack Project - Travel Together

This is to simplify some parts of the MERN Project that might be a little of a chanllenge to implement in other projects in the future if your not used to them.

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
## 2- Redux Toolkit
* We use Redux as an alternative for Context and sepecialy for bigger and more complicated project. The main objectif is to wrap your react app into a companent that can sens the changed in what ever page the user is in and what ever state as well, and render the page based on that, Say it's like a bigger version of useState, but with customization of all the states that we might update the pages on.
* How To start:
    - You can visit the site:
    https://redux-toolkit.js.org/tutorials/quick-start
    there you can find a deep explenation of what we're about to show.
    1. install the package:
    ```
    npm install @reduxjs/toolkit react-redux
    ```
    2. Create a Redux Store:
    in src/redux/store.js, we create a redux store by importing **configureStore**.
    **configureStore** is a standard method for creating Redux store. It uses the low-level Redux code ***createStore*** method internally, but wraps that to provide good defaults to the store setup for a better development experience.
    ```
    import { configureStore } from '@reduxjs/toolkit'

    export const store = configureStore ({
        reducer: {
            // Here we're giong to add our provider
        },
    })
    ```
    3. Provide the Redux Store to React
    in front-end/main.jsx, we need to add our store and import the Provider component from react-redux:
    ```
    import React from 'react'
    import ReactDOM from 'react-dom/client'
    import App from './App.jsx'
    import './index.css'
    import { store } from './redux/store.js'
    import { Provider } from 'react-redux'

    ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App />
    </Provider>,
    )
    ```
    4. Now after creating our Store and wrap our app with it, we need to start working on the Slices, meaning the states that we want to know about the user, like the theme, or the Sign-in situation ..., In this case , we'll go with the example of user sign in situation.
    We go to **src/redux/user/userSlice.js**, and then we create our slice, using createSlice method from @reduxjs/toolkit.
    
    Every Slice, has a name, initialState and reducers which are the states, like Start, Success and Failure, and within them, we set certain variables, like what kind of error, what kind of loaidng situation(true or false), message ...

    In the user sign-in situation, the name will be basic 'user', the initial state is that there no current user, so null, there no error message ('') and loading is false, because nothing is being submited. And based on the state, like Success, we set the currentUser to the actual user returned from the backend ...

    And to use the Slice we'll need to export it as a reducer, and also we can export its actions (which are the reducers various states)

    ```
    import { createSlice } from '@reduxjs/toolkit'

    const initialState = {
        currentUser: null,
        error: '', 
        loading: false
    }

    const userSlice = createSlice({
        name: 'user',
        initialState,
        reducers: {
            signInStart: (state) => {
                state.loading = true
                state.error = ''
            },
            signInSuccess: (state, action) => {
                state.currentUser = action.payload
                state.loading = false
                state.error = ''
            },
            signInFailure: (state, action) => {
                state.loading = false,
                state.error = action.payload
            }
        }
    })

    export const { signInFailure, signInStart, signInSuccess } = userSlice.actions

    export default userSlice.reducer
    ```

    5. Set the Slice as a reducer, because that is how it was exported in the Slice page (previous step), in our Redux store:
    ```
    import { configureStore } from '@reduxjs/toolkit'
    import userReducer from './user/userSlice'

    export const store = configureStore ({
        reducer: {
            user: userReducer,
        },
    })
    ```

* How to update the states/actions of a Reducer:
    - You can import the actions of a Reducer 
    ```
    import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'
    ```
    - To update the actions/state of the pages, we use the Hook **useDispatch** from 'react-redux', and we pass the one of the actions we imported besed on the situation.
    ```
    dispatch(signInStart())
    ```
    ```
    dispatch(signInSuccess(data))
    ```
    ```
    dispatch(signInFailure('Please fill out all the fields'))
    ```
* Most of the time we'll need to use of the variables in the current state of the prvider, and to get it, we use **useSelector** from react-redux, and we set what attributes we want and we can also named them, so we can use them in the page with different name:
```
const { loading: signinLoading, error: signinErrorMsg } = useSelector(state => state.user)
```
In the example above, we can see that we're selecting the loading and error values of the current state of the user, and we named them signinLoading and singinErrorMsg, so we can use them in the page with these names other than laoding and error. So if you want to get the currentUser of the current state of the user, you'll need to indicate that in the object of the useSelect, like
``` 
const { currentUser } = useSelector(state => state.user)
```