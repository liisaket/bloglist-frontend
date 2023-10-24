import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Error from './components/Error'
import LoginForm from './components/Login'
import LogoutForm from './components/Logout'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  // show blogs & toggle form
  const [blogs, setBlogs] = useState([])
  const blogFormRef = useRef()

  // info & error messages
  const [errorMessage, setErrorMessage] = useState(null)
  const [infoMessage, setInfoMessage] = useState(null)

  // user log in
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    blogService.setToken(null)
    setUser(null)
    setUsername('')
    setPassword('')
    window.localStorage.clear()
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={infoMessage} />
      <Error message={errorMessage} />
      {!user && <Togglable buttonLabel='login'>
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </Togglable>}
      {user && <div>
       <p>{user.name} logged in</p>
       <LogoutForm handleLogout={handleLogout} />
       <Togglable buttonLabel='create new blog' ref={blogFormRef}>
          <BlogForm blogs={blogs} setBlogs={setBlogs} blogFormRef={blogFormRef}
            emsgSet={setErrorMessage} imsgSet={setInfoMessage} />
        </Togglable>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} user={user} setBlogs={setBlogs} />
        )}
      </div>
    }
    </div>
  )
}

export default App