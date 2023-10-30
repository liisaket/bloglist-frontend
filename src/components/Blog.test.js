import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const testUser = {
  name: 'mario',
  username: 'supermario',
  id: '652d34b2a765869dbf9a3ffd'
}
const blog = {
  title: 'test title',
  author: 'tester',
  url: 'www.test.com',
  likes: 2,
  user: testUser
}

test('renders title and author but details are hidden', () => {
  const { container } = render(<Blog blog={blog} user={testUser} />)

  const div = container.querySelector('.default')
  expect(div).toHaveTextContent(blog.title)
  expect(div).toHaveTextContent(blog.author)
  expect(div).not.toHaveTextContent(blog.likes)
  expect(div).not.toHaveTextContent(blog.url)
  expect(div).not.toHaveTextContent(blog.user)
})

test('clicking view button shows url, likes, user values', async () => {
  const { container } = render(<Blog blog={blog} user={testUser} />)

  const divDefault = container.querySelector('.default')
  const divHidden = container.querySelector('.hidden')

  expect(divHidden).toHaveStyle('display: none')
  expect(divDefault).not.toHaveTextContent(blog.url)
  expect(divDefault).not.toHaveTextContent(blog.likes)
  expect(divDefault).not.toHaveTextContent(blog.user.name)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  expect(divHidden).not.toHaveStyle('display: none')
  expect(divHidden).toHaveTextContent(blog.url)
  expect(divHidden).toHaveTextContent(blog.likes)
  expect(divHidden).toHaveTextContent(blog.user.name)
})

test('clicking like button twice calls up the event handler twice', async () => {
  const mockHandler = jest.fn()

  render(<Blog blog={blog} user={testUser}
    updateBlog={mockHandler} />)

  const user = userEvent.setup()
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})