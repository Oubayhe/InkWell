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
## 2- Json Web Token
JSON Web Tokens (JWT) are widely used for several reasons in web development, particularly in the context of user authentication and authorization.
* How to use:
    - Install jsonwebtoken
    ```
    npm install jsonwebtoken
    ```
    - We use it mainly in th sign-in success situation, say the in the backend, the controller function for returning a json object of all the user information after a successfule sign-in, you need to sign a token the user with his id and the JWT SECRET you set in the .env, and it can be anything, and then for the returned response, you set a cookie with signed token:
    ```
    const validUser = await User.findOne({ email })
    if (!validUser) {
        next(errorHandler(400, 'Wrong email and/or password'))
    }
    const validPassword = await bcrypt.compare(password, validUser.password)
    if(!validPassword) {
        next(errorHandler(400, 'Wrong email and/or password'))
    }
    const token = jwt.sign({ id: validUser._id}, process.env.JWT_SECRET )
    // down below, we're using password: _pass, instead of just password,
    // because the variable password is used above,
    // and it will return an error if we asigned to a value again
    const {password: unusedpass, ...rest} = validUser._doc
    // httpOnly: true => the cookie is only accessible by the server and cannot be accessed by client-side JavaScript.
    // Setting the httpOnly flag to true when creating an HTTP cookie is a security best practice.
    // Protects Sensitive Data specialy in authentification
    return res.status(200).cookie('access_token', token, {httpOnly: true}).json(rest)
    ``` 

## 3- Redux Toolkit
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

# 4- Redux Persist
We use redux persist to save the last current state of the pages even if the react app was refreshed. So in the example above of the state of the sign in of the user, we wouldn't know what was the last state if the user just refershed the page, so it would go to the initial state, but in the case of Redux persist, we would even if the page was refreshed.
* How to use it:
    - Install redux persist:
    ```
    npm i redux-persist
    ```
    - After that we're going to need these methods and object:
    1. combineReducers a method from @reduxjs/toolkit, and it's for gathering different reducers that we have in our app like 'user', 'theme' ...
    ```
    const rootReducer = combineReducers({
        user: userReducer,
        theme: themeReducer,
    })
    ```
    2. storage object from redux-persist/lib/storage, and we'll need it to fill all the main 3 attribuets in the persistConfig object, which we'll need in the method below (persistReducer).
    ```
    const persistConfig = {
        key: 'root',
        storage,
        version: 1
    }
    ```
    3. persistReducer method from redux-persist, which will take two attributes persistConfig & rootReducer which is the has the combined Reducer that we created with combineReducer.
    ```
    const persistedReducer = persistReducer(persistConfig, rootReducer)
    ```
    - And after that, we just pass the persistReducer to the reducer attribute in our redux store, and add a bit of a middleware to avoid getting an error:
    ```
    export const store = configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) => 
            getDefaultMiddleware({ serializableCheck: false }),
    })
    ```
    - And to finish we need to export a persisted store, and to do that we use persistStore method from redux-persist/es/persistStore
    ```
    export const persistor = persistStore(store)
    ```
    - And lastly, we need to implement that in the main.jsx file, by wrapping everything with PersistGate Component from redux-persist/intergration/react, and within that component we need to pass our persistor that we created and exported in the store file:
    ```
    import React from 'react'
    import ReactDOM from 'react-dom/client'
    import App from './App.jsx'
    import './index.css'
    import { store, persistor } from './redux/store.js'
    import { Provider } from 'react-redux'
    import { PersistGate } from 'redux-persist/integration/react'
    import ThemeProvider from './components/ThemeProvider.jsx'

    ReactDOM.createRoot(document.getElementById('root')).render(
    <PersistGate persistor={persistor}>
        <Provider store={store}>
        <ThemeProvider>
            <App />
        </ThemeProvider>
        </Provider>
    </PersistGate>
    )
    ```
    
## 5- OAuth Authentication with Google
OAuth allow users to sign in and up with thier other applications accounts like Google, Meta, GitHub...
After creating the components for the buttons, you need to follow these steps:
1. Login to your Firebase account
2. Go to Console
3. Create a new project
4. Name the project & continue
5. You can either enable or disable Google Analytics for your project & then continue
6. After little while the project will be ready & after it's done you continue
7. You click on the web app icon which looks like this: **</>**
8. You enter the app nickname (just stick to the same name of the project most of the time) & you Register the app
9. Once you do that, you'll need to install firebase
```
npm install firebase
```
10. And a create a file in your front-end named firebase.js for example, and add to it the code given to youin firebase website. The code is called firebase SDK or firebase configuration. 
11. After that you click on Continue to th console -> Authentication -> Get started -> Choose Google -> Click on Enable -> Choose a project name (same as before) -> Choose a Gmail Account and Save
12. After create the firebase file and adding the SDK code, you'll need to save the **apiKey** in an envirement file ***.env***. And to use the apiKey in SDK code, it's quite different on how to import env variables in Vite.
```
apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
```
13. And then you need to export the app in the SDK file:
```
export const app = initializeApp(firebaseConfig);
```
> [!NOTE]
> All methods that are going to be used for Google Authentication need to be put inside an handle Google button when it's clicked function
14. For Google Authentication, we need to set a provider with the help of  **GoogleAuthProvider** from firebase/auth
```
const provider = new GoogleAuthProvider()
```
> [!NOTE]
> Now with the code above the user will only have to sign in/up once with a certain google account, and after that whenever he/she clicks the button it will directly choose the already chosen account. To disable that, and let the user choose everytime:
```
provider.setCustomParameters({ prompt: 'select_account' })
```
15. Create the Auth, which should be put ***outside the Google handling function***:
getAuth is a method from firebase/auth, and app is what we exported from firebase file.
```
const auth = getAuth(app)
```
16. Next, is the signIn part, where we're going to use **signInPopup** method from firebase/auth, that takes two arguement the auth and provider, after that we set our res to the backend to sing in/up with Google, meaning that the backend controller for this situation is not the regular sign in and upfunctions, but we create one sepcific for this case, so we can check if the user is already in the database or not. And this part will be set within a try&catch methods.
```
try {
    const resultFromGoogle = await signInWithPopup(auth, provider)
    const res = await fetch( 'api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: resultFromGoogle.user.displayName,
            email: resultFromGoogle.user.email,
            googlePhotoUrl: resultFromGoogle.user.photoURL,
        }),
    })
    const data = await res.json()
    if (res.ok){
        dispatch(signInSuccess(data))
        navigate('/')
    }
} catch (error) {
    console.log(error)
}
```
17. And with the information send to the backend, the google auth controller can either sing-in ro sign-up the user.

## 6- Dark Mode Functionality
Along teh coding of the ui of the pages, we've set the dark mode by putting 'dark:' before any tailwind attribute to the UI, now all we need to do is to let the server know that we want to pass to the attributes that has dark: before them.
* How To do it?
    1. Create A Slice for The Theme:
        * As we did for the user's slice, we start by going to redux/theme/themeSlice.js. 
        * Create our slice with createSlice from @reduxjs/toolkit
        * Put the basic configurations for creating the slice: name, initialState (in this case it will be theme that is set to 'light') and reducers (which has one state situation => Changing the theme state from one to the other)
        * Export our slice as a reducer and also the state in the reducers, so we can change them in other pages (mainly the top bar / header, where the toggle button is put)
        ```
        import { createSlice } from '@reduxjs/toolkit'
        const initialState = {
            theme: 'light',
        }

        const themeSlice = createSlice({
            name: 'theme',
            initialState,
            reducers: {
                toggleTheme: (state) => {
                    state.theme = state.theme === 'light' ? 'dark' : 'light'
                },
            }
        })
        export const {toggleTheme} = themeSlice.actions
        export default themeSlice.reducer
        ```
    2. Add the Theme Reducer to the Redux Store to be combines with other reducers
    ```
    const rootReducer = combineReducers({
        user: userReducer,
        theme: themeReducer,
    })
    ```
    3. Use the state action in the Header to change the state of the theme. Ofcourse we'll need to import the { toggleTheme } from the themeSlice and useDispatch from react-redux, plus useSelector as well to identifiy the current theme (like if we want to change an icon component we need to know what theme we're currently in)
    ```
    onClick={()=> { dispatch(toggleTheme()) }}
    ```
    4. Now the last part is to wrap our application with a Theme provider that has the current theme as its className:
        * ThemeProvider compoenent:
        ```
        import React from 'react'
        import { useSelector } from 'react-redux'

        export default function ThemeProvider({children}) {
            const {theme} = useSelector(state => state.theme)
        return (
            <div className={theme}>
                <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen">
                    {children}
                </div>
            </div>
        )
        }
        ```
        * Wrapping the main app:
        ```
        import React from 'react'
        import ReactDOM from 'react-dom/client'
        import App from './App.jsx'
        import './index.css'
        import { store, persistor } from './redux/store.js'
        import { Provider } from 'react-redux'
        import { PersistGate } from 'redux-persist/integration/react'
        import ThemeProvider from './components/ThemeProvider.jsx'

        ReactDOM.createRoot(document.getElementById('root')).render(
        <PersistGate persistor={persistor}>
            <Provider store={store}>
            <ThemeProvider>
                <App />
            </ThemeProvider>
            </Provider>
        </PersistGate>
        )
        ```

## 7- Make Private Pages
Now the user, weither he/she is Signed in or not, can navigate to any page (Dashboard, Profile...). But certain are meant for Signed in users only, and to acheive that, we need to create a Private Provider component, that return the Private Pages if the user is Signed in or navigate to the Home Page if he/she is not.
* So in the PrivateProvider Component, we'll have something like this:
```
import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

export default function PrivateRoute() {
    /* <Outlet /> is the equivalent of {children} but is you want to set ti as a component, which is our case where we should return a whole component an it's the children that we're wrapping the PrivateProvider Component with. */
    const { currentUser } = useSelector( (state) => state.user)
    return currentUser ? <Outlet /> : (
        <Navigate to='/sign-in' />
    )
}
``` 
* And for wrapping, we go to our App.jsx and set it:
```
<Route element={<PrivateRoute />}>
    <Route path='/dashboard' element={<Dashboard />} />
</Route>
```

## 8- Uploading Image
Here we want to acheive these 3 thinigs, first is to choose an image just by clicking on the current image, second is to save the image and last is to have a sort of animation for uploading the image.
### Choose the image
1. Create a function for handling the image file
2. Create an input of type file, that only choose image files
```
<input 
    type='file' 
    accept='image/*' 
    onChange={handleImageChange} 
/>
```
3. With the use of useRef, we can refere to this input whenever the user clicks on the image div
    * Import the necessary Hook:
    ```
    import {useRef}  from 'react'
    ```
    * Refere to the input:
    ```
    <input 
        type='file' 
        accept='image/*' 
        onChange={handleImageChange} 
        ref={filePickerRef}
    />
    ```
    * Set the div to refer to the input:
    ```
    <div onClick={() => {filePickerRef.current.click()}}>
    ```
4. Now because we can get to the input file just from the image, we can hide the input as whole using hidden attribute:
```
<input 
    type='file' 
    accept='image/*' 
    onChange={handleImageChange} 
    ref={filePickerRef}
    hidden
/>
```
### Save the image
1. Firebase -> Got to console -> The Project you created -> Sidebar/build/Storage -> Get started -> Next -> Done 
2. After everything is well set, you choose Rules in topbar to customize the allow and read rules
    Examples: 
    - size by **request.resource.size < 2 * 1024 * 1023**
    - image type only by: **request.resuorce.contentType.matches('image/.*')**
3. To use the storage we created in Firebase for the project, we need to use **getStorage** from firebase
```
import { getStorage } from 'firebase/storage'
```
2. Create the storage for our app, which means we'll need to import the app that we created earlier with the SDK Code got from firebase
```
import { app } from '../firebase'
``` 
&&
```
const storage = getStorage(app)
```
3. Make each image unique, so we can store same image multiple times. We can do that by using the current Date:
```
const fileName = new Date().getTime() + imageFile.name
```
4. To upload the image to the storage, we'll use uploadBytesResumable, which takes two attributes the storage Reference and the image File.
    * For the Storage Reference, we can get it by the ref function and passin to it our created storage and the file name we set.
    * For the imageFile, it's just the file that we're getting from the file input, we can use a useState to updated evertime a new image file is chosen.
```
const storageRef = ref(storage, fileName)
const uploadTask = uploadBytesResumabl(storageRef, imageFile)
```
5. Now we turn on the uploading (uploadingTask), by using the on method, and setting the first attribute to 'state_changed', plus other methods used to get the job done. And ofcourse handling certain errors as well:
```
uploadTask.on(
    'state_changed',
    (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setImageFileUploadingProgress(progress.toFixed(0))
    },
    (error) => {
        setImageFileUploadingError('Could not upload image (File must be less than 2MB)')
        setImageFileUploadingProgress(null)
        setImageFileUrl(null)
        setImageFile(null)
    },
    () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUrl(downloadURL)
        })
    }
)
```
6. The whole code of handleImageChange is this:
```
const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file){
        setImageFile(file)
        setImageFileUrl(URL.createObjectURL(file))
        }
    }
    useEffect(() => {
        if(imageFile) {
            uploadImage()
        }
    }, [imageFile])

    // If you can check the type of the input before
    const uploadImage = async () => {
    setImageFileUploadingError(null)
    const storage = getStorage(app)
    const fileName = new Date().getTime() + imageFile.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, imageFile)
    uploadTask.on(
        'state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            setImageFileUploadingProgress(progress.toFixed(0))
        },
        (error) => {
            setImageFileUploadingError('Could not upload image (File must be less than 2MB)')
            setImageFileUploadingProgress(null)
            setImageFileUrl(null)
            setImageFile(null)
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setImageFileUrl(downloadURL)
            })
        }
    )
}
```
### Upload Animation
For the uploading animation, we'll need to use a package named **React Circular Progressbar**
1. First you should install the package:
```
npm install --save react-circular-progressbar
```
2. We're going to create the uploading animationg that is circalr so it surround the image. We will be using CircularProgressbar component from react circular progressbar:
```
import { CircularProgressbar } from 'react-circular-progressbar';
```
3. Add some animation after importing the styles directory:
```
import 'react-circular-progressbar/dist/styles.css';
```
```
<CircularProgressbar 
    value={imageFileUploadingProgress || 0} 
    text={`${imageFileUploadingProgress}%`}
    strokeWidth={5}
    styles={{
        root:{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
        },
        path: {
            stroke: `rgba(62, 152, 199, ${imageFileUploadingProgress / 100})`,
        },

    }}
/>
```




