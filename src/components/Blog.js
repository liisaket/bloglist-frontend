import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, user, setBlogs, setImsg }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [viewButton, setButton] = useState('view')

  const toggleInfo = { display: viewButton === 'view' ? 'none' : '' }

  const handleClick = () => {
    setButton(viewButton === 'view' ? 'hide' : 'view')
  }

  const handleLikes = async () => {
    const updateBlog = {
      title: blog.title,
      author: blog.author,
      likes: blog.likes+1,
      user: user.id
    }
    await blogService.update(blog.id, updateBlog)
    const response = await blogService.getAll()
    setBlogs(response)
  }

  const handleRemove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await blogService.remove(blog.id, user.token)
      const response = await blogService.getAll()
      setBlogs(response)
      setImsg(
        `Removed blog ${blog.title} by ${blog.author}`
      )
      setTimeout(() => {
        setImsg(null)
      }, 5000)
    }
  }

  return (
    <div style={blogStyle}>
      <i>{blog.title}</i> by {blog.author} <button onClick={handleClick}>{viewButton}</button>
      <div style={toggleInfo}>
        {blog.url}<br></br>
      likes: {blog.likes} <button onClick={handleLikes}>like</button><br></br>
        {blog.user.name}<br></br>
        {user.id === blog.user.id && <div>
          <button onClick={handleRemove}>remove</button><br></br>
        </div>}
      </div>
    </div>
  )}

export default Blog