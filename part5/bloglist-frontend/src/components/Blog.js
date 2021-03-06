import React from 'react'
import Togglable from './Togglable'
import blogService from '../services/blogs'
import userService from '../services/users'

const ReducedBlog = ({ blog, loggedInUser, setNotification }) => {
  return (
    <div>
      {blog.title} {blog.author} <Togglable buttonLabel='view' cancelLabel='hide'>
        <FullBlog blog={blog} loggedInUser={loggedInUser} setNotification={setNotification} />
      </Togglable>
    </div>)
}

const FullBlog = ({ blog, loggedInUser, setNotification }) => {

  const addLike = async (event) => {
    event.preventDefault()

    userService.getAll()
      .then(users => {
        const user = users.find(user => user.username === loggedInUser.username)
        const newLikes = blog.likes + 1

        blogService.updateBlog(blog.id, blog.title, blog.author, blog.url, user.id, newLikes)
          .then(blog => {
            setNotification(`Blog ${blog.title} by ${blog.author} was updated`, false)
          })
          .catch(error => setNotification(`Could not update blog, ${error}`, true))
      })
      .catch(error => setNotification(`Could not get user id in order to update blog, ${error}`, true))
  }

  const deleteBlog = async (event) => {
    event.preventDefault()

    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      blogService.deleteBlog(blog.id)
        .then(response => {
          if (response.status >= 200 && response.status < 300) {
            setNotification('Blog was deleted', false)
          } else {
            setNotification('Could not delete blog', true)
          }
        })
        .catch(error => setNotification(`Could not delete blog, ${error}`, true))
    }
  }

  const blogBelongsToThisUser = blog.user.username === loggedInUser.username
  const showDelete = { display: blogBelongsToThisUser ? '' : 'none' }

  return (
    <div>
      <div>{blog.url}</div>
      <div>likes {blog.likes} <button onClick={addLike}>like</button></div>
      <div>{blog.user.name}</div>
      <button style={showDelete} onClick={deleteBlog}>remove</button>
    </div>
  )
}

const Blog = ({ blog, loggedInUser, setNotification }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} >
      <ReducedBlog blog={blog} loggedInUser={loggedInUser} setNotification={setNotification} />
    </div>
  )
}

export default Blog