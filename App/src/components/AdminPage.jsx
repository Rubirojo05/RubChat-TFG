import { useEffect, useState } from "react"
import { Trash2, ArrowLeft, Check, Search } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { instancePrivate } from "../services/axios"
import { useAuth } from "../hooks/useAuth"
import "../styles/AdminPage.css"

const ROLES = [
  { id: 1, name: "Administrador" },
  { id: 2, name: "Usuario" }
]

const AdminPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const [editedRoles, setEditedRoles] = useState({})
  const [modalOpen, setModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [search, setSearch] = useState("")
  const { auth } = useAuth()
  const navigate = useNavigate()

  // Obtener todos los usuarios
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await instancePrivate.get("/user/all")
      setUsers(res.data)
      // Inicializa los roles editados con el rol actual de cada usuario
      const initialRoles = {}
      res.data.forEach(user => {
        initialRoles[user.id] = user.roleId ?? user.role_id
      })
      setEditedRoles(initialRoles)
    } catch (err) {
      alert("Error al cargar usuarios. Vuelve a iniciar sesión si el problema persiste.")
    }
    setLoading(false)
  }

  useEffect(() => {
    if (auth?.accessToken) fetchUsers()
  }, [auth?.accessToken])

  // Cambiar rol (solo cuando se pulsa guardar)
  const handleRoleChange = (userId, newRoleId) => {
    setEditedRoles(prev => ({
      ...prev,
      [userId]: Number(newRoleId)
    }))
  }

  const handleSaveRole = async (userId) => {
    setUpdating(userId)
    try {
      await instancePrivate.patch("/user/", {
        id: userId,
        roleId: editedRoles[userId]
      })
      fetchUsers()
    } catch (err) {
      if (err?.response?.status === 409) {
        alert("Ya existe un usuario con ese email.")
      } else {
        alert(err?.response?.data?.message || "Error al actualizar el rol")
      }
    }
    setUpdating(null)
  }

  // Abrir modal de confirmación para borrar usuario
  const openDeleteModal = (userId) => {
    const user = users.find(u => u.id === userId)
    setUserToDelete(user)
    setModalOpen(true)
  }

  // Confirmar borrado de usuario
  const confirmDelete = async () => {
    setUpdating(userToDelete.id)
    try {
      await instancePrivate.delete("/user/", { data: { id: userToDelete.id } })
      fetchUsers()
      setModalOpen(false)
      setUserToDelete(null)
    } catch (err) {
      alert("Error al borrar usuario")
    }
    setUpdating(null)
  }

  // Filtrado de usuarios según búsqueda
  const filteredUsers = (() => {
    if (!search.trim()) return users
    const term = search.trim().toLowerCase()
    return users.filter(
      u =>
        u.firstName?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term)
    )
  })()

  return (
    <div className="adminpage-wrapper">
      <div className="adminpage-header">
        <h1>Panel de Administración</h1>
        <p>Gestiona los usuarios registrados en RubChat.</p>
      </div>
      <div className="adminpage-container">
        <button className="adminpage-backbtn" onClick={() => navigate("/chat")}>
          <ArrowLeft size={20} style={{ marginRight: 8 }} />
          Volver al chat
        </button>
        <div className="adminpage-searchbar">
          <Search size={20} style={{ marginRight: 8, color: "#888" }} />
          <input
            className="adminpage-searchinput"
            type="text"
            placeholder="Buscar usuario..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="adminpage-loading">Cargando usuarios...</div>
        ) : (
          <>
            {search.trim() && (
              filteredUsers.length > 0 ? (
                <div className="adminpage-found">
                  {filteredUsers.length === 1
                    ? "1 usuario encontrado"
                    : `${filteredUsers.length} usuarios encontrados`}
                </div>
              ) : (
                <div className="adminpage-notfound">
                  Usuario no encontrado para "{search.trim()}"
                </div>
              )
            )}
            {filteredUsers.length > 0 && (
              <div className="adminpage-userlist">
                {filteredUsers.map(user => (
                  <div className="adminpage-usercard" key={user.id}>
                    <img className="adminpage-avatar" src={user.img} alt={user.firstName} />
                    <div className="adminpage-userinfo">
                      <div className="adminpage-name">{user.firstName}</div>
                      <div className="adminpage-email">{user.email}</div>
                    </div>
                    <div className="adminpage-controls">
                      <select
                        className="adminpage-roleselect"
                        value={editedRoles[user.id]}
                        disabled={updating === user.id}
                        onChange={e => handleRoleChange(user.id, e.target.value)}
                      >
                        {ROLES.map(role => (
                          <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                      </select>
                      <div className="adminpage-actions">
                        <button
                          className="adminpage-savebtn"
                          title="Guardar cambios"
                          disabled={updating === user.id}
                          onClick={() => handleSaveRole(user.id)}
                          style={{
                            visibility: editedRoles[user.id] !== user.roleId ? "visible" : "hidden"
                          }}
                        >
                          <Check size={20} />
                        </button>
                        <button
                          className="adminpage-deletebtn"
                          title="Eliminar usuario"
                          disabled={updating === user.id}
                          onClick={() => openDeleteModal(user.id)}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <ConfirmModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={confirmDelete}
          userName={userToDelete?.firstName}
          updating={updating}
        />
      </div>
    </div>
  )
}

// Modal de confirmación
const ConfirmModal = ({ open, onClose, onConfirm, userName, updating }) => {
  if (!open) return null
  return (
    <div className="adminpage-modal-overlay">
      <div className="adminpage-modal-box">
        <h3>¿Eliminar usuario?</h3>
        <p>
          ¿Seguro que quieres eliminar a <b>{userName}</b>?<br />
          <span className="adminpage-dangertext">
            Esta acción es irreversible <br />
            Se eliminarán todos sus datos.
          </span>
        </p>
        <div className="adminpage-modal-actions">
          <button className="adminpage-modal-btn" onClick={onClose} disabled={!!updating}>Cancelar</button>
          <button className="adminpage-modal-btn-delete" onClick={onConfirm} disabled={!!updating}>
            {updating ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminPage