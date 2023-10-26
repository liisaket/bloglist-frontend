import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, user, updateBlog, removeBlog }) => {
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
    const newInfo = {
      id: blog.id,
      title: blog.title,
      author: blog.author,
      likes: blog.likes+1,
      user: blog.user.id
    }
    updateBlog(newInfo.id, newInfo)
  }

  const handleRemove = async () => {
    removeBlog(blog.id, blog.title, blog.author)
  }

  return (
    <div>
      <div style={blogStyle} className='default'>
        <i>{blog.title}</i> by {blog.author} <button onClick={handleClick}>{viewButton}</button>
      </div>
      <div style={toggleInfo} className='hidden'>
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