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

  const createBlog = async (newBlog) => {
    blogFormRef.current.toggleVisibility()
    try {
      const createdBlog = await blogService.create(newBlog)
      blogs.concat(createdBlog)
      const response = await blogService.getAll()
      setBlogs(response)
      setInfoMessage(`added a new blog ${createdBlog.title} by ${createdBlog.author}`)
      setTimeout(() => {
        setInfoMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('error')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const updateBlog = async (id, newInfo) => {
    try {
      await blogService.update(id, newInfo)
      const response = await blogService.getAll()
      setBlogs(response)
    } catch (exception) {
      setErrorMessage('error')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const removeBlog = async (id, title, author) => {
    if (window.confirm(`Remove blog ${title} by ${author}?`)) {
      await blogService.remove(id, user.token)
      const response = await blogService.getAll()
      setBlogs(response)
      setInfoMessage(
        `Removed blog ${title} by ${author}`
      )
      setTimeout(() => {
        setInfoMessage(null)
      }, 5000)
    }
  }

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
          <BlogForm createBlog={createBlog} />
        </Togglable>
        {blogs.sort(function(first, second) {
          return second.likes - first.likes}).map(blog =>
          <Blog key={blog.id} blog={blog} user={user}
            updateBlog={updateBlog} removeBlog={removeBlog} />
        )}
      </div>
      }
    </div>
  )
}

export default App