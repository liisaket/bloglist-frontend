const LogoutForm = ({ handleLogout }) => {
  return (
    <div>
      <form onSubmit={handleLogout}>
        <button type="submit">logout</button>
      </form>
    </div>
  )}

export default LogoutForm