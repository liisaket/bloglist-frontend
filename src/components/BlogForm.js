import { useState } from "react"
import blogService from '../services/blogs'

const BlogForm = ({
    blogs, setBlogs, blogFormRef, emsgSet, imsgSet }) => {
  const [title, setTitle] = useState('') 
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleNewBlog = async (event) => {
    event.preventDefault()
    blogFormRef.current.toggleVisibility()
    try {
      const newBlog = await blogService.create({ title, author, url })
      setBlogs(blogs.concat(newBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      imsgSet(`added a new blog ${title} by ${author}`)
      setTimeout(() => {
        imsgSet(null)
      }, 5000)
    } catch (exception) {
      emsgSet('error')
      setTimeout(() => {
        emsgSet(null)
      }, 5000)
    }
  }

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={handleNewBlog}>
        <div>
          title:
            <input
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
            <input
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
            <input
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div> 
)}

export default BlogForm