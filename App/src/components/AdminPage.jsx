import { useEffect, useState } from "react"
import styled from "styled-components"
import { Trash2, ArrowLeft, Check, Search } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { instancePrivate } from "../services/axios"
import { useAuth } from "../hooks/useAuth"

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
        <PageWrapper>
            <Header>
                <h1>Panel de Administración</h1>
                <p>Gestiona los usuarios registrados en RubChat.</p>
            </Header>
            <Container>
                <BackButton onClick={() => navigate("/chat")}>
                    <ArrowLeft size={20} style={{ marginRight: 8 }} />
                    Volver al chat
                </BackButton>
                <SearchBar>
                    <Search size={20} style={{ marginRight: 8, color: "#888" }} />
                    <SearchInput
                        type="text"
                        placeholder="Buscar usuario..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </SearchBar>
                {loading ? (
                    <Loading>Cargando usuarios...</Loading>
                ) : (
                    <>
                        {search.trim() && (
                            filteredUsers.length > 0 ? (
                                <Found>
                                    {filteredUsers.length === 1
                                        ? "1 usuario encontrado"
                                        : `${filteredUsers.length} usuarios encontrados`}
                                </Found>
                            ) : (
                                <NotFound>
                                    Usuario no encontrado para "{search.trim()}"
                                </NotFound>
                            )
                        )}
                        {filteredUsers.length > 0 && (
                            <UserList>
                                {filteredUsers.map(user => (
                                    <UserCard key={user.id}>
                                        <Avatar src={user.img} alt={user.firstName} />
                                        <Name>{user.firstName}</Name>
                                        <Email>{user.email}</Email>
                                        <RoleSelect
                                            value={editedRoles[user.id]}
                                            disabled={updating === user.id}
                                            onChange={e => handleRoleChange(user.id, e.target.value)}
                                        >
                                            {ROLES.map(role => (
                                                <option key={role.id} value={role.id}>{role.name}</option>
                                            ))}
                                        </RoleSelect>
                                        {editedRoles[user.id] !== user.roleId && (
                                            <SaveBtn
                                                title="Guardar cambios"
                                                disabled={updating === user.id}
                                                onClick={() => handleSaveRole(user.id)}
                                            >
                                                <Check size={20} />
                                            </SaveBtn>
                                        )}
                                        <DeleteBtn
                                            title="Eliminar usuario"
                                            disabled={updating === user.id}
                                            onClick={() => openDeleteModal(user.id)}
                                        >
                                            <Trash2 size={20} />
                                        </DeleteBtn>
                                    </UserCard>
                                ))}
                            </UserList>
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
            </Container>
        </PageWrapper>
    )
}

// Modal de confirmación
const ConfirmModal = ({ open, onClose, onConfirm, userName, updating }) => {
    if (!open) return null
    return (
        <ModalOverlay>
            <ModalBox>
                <h3>¿Eliminar usuario?</h3>
                <p>
                    ¿Seguro que quieres eliminar a <b>{userName}</b>?<br />
                    <DangerText>
                        Esta acción es irreversible <br />
                        Se eliminarán todos sus datos.
                    </DangerText>
                </p>
                <ModalActions>
                    <ModalButton onClick={onClose} disabled={!!updating}>Cancelar</ModalButton>
                    <ModalButtonDelete onClick={onConfirm} disabled={!!updating}>
                        {updating ? "Eliminando..." : "Eliminar"}
                    </ModalButtonDelete>
                </ModalActions>
            </ModalBox>
        </ModalOverlay>
    )
}
const PageWrapper = styled.div`
  min-height: 100vh;
  background: #fff;
  padding: 2.5rem 0 2rem 0;
  font-family: system-ui, sans-serif;
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  h1 {
    font-size: 2.2rem;
    color: #222;
    margin-bottom: 0.3rem;
    font-family: inherit;
  }
  p {
    color: #444;
    font-size: 1.1rem;
    margin-bottom: 0;
    font-family: inherit;
  }
`

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2.5rem 2rem 2rem 2rem;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 6px 32px rgba(0,0,0,0.10), 0 1.5px 4px rgba(0,0,0,0.04);
  font-family: inherit;
`

const Found = styled.div`
  text-align: center;
  color: #1abc9c;
  font-size: 1.1rem;
  margin-bottom: 1rem;
`

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: #f3f3f3;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  margin-bottom: 1.2rem;
  margin-top: -0.5rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.03);
  max-width: 340px;
  width: 100%;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
`

const SearchInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  font-size: 1rem;
  width: 100%;
  color: #222;
  font-family: inherit;
  &::placeholder {
    color: #aaa;
    font-family: inherit;
  }
`

const DangerText = styled.span`
    color: #e74c3c;
    font-weight: 600;
`

const BackButton = styled.button`
  display: flex;
  align-items: center;
  background: transparent;
  color: #222;
  border: 1.5px solid #e3e6ee;
  border-radius: 7px;
  padding: 0.5rem 1.1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: background 0.18s, border 0.18s, color 0.18s;
  font-family: inherit;
  &:hover {
    background: #f6f6f6;
    border: 1.5px solid #111;
    color: #111;
  }
`

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
`

const UserCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  background: #f7f7f7;
  border-radius: 10px;
  padding: 0.7rem 1.2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
`

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e3e6ee;
  background: #fff;
`

const Name = styled.div`
  flex: 1;
  font-size: 1.15rem;
  font-weight: 600;
  color: #222;
`
const Email = styled.div`
  min-width: 140px;
  color: #555;
  font-size: 0.97rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const RoleSelect = styled.select`
  padding: 0.4rem 0.7rem;
  border-radius: 6px;
  border: 1.5px solid #e3e6ee;
  background: #fff;
  font-size: 1rem;
  color: #333;
  margin-right: 1rem;
  font-family: inherit;
  &:disabled {
    opacity: 0.7;
  }
`

const SaveBtn = styled.button`
  background: #1abc9c;
  border: none;
  color: #fff;
  cursor: pointer;
  border-radius: 6px;
  padding: 0.3rem 0.7rem;
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  transition: background 0.15s;
  font-family: inherit;
  &:hover {
    background: #16a085;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const DeleteBtn = styled.button`
  background: transparent;
  border: none;
  color: #c00;
  cursor: pointer;
  border-radius: 6px;
  padding: 0.3rem 0.5rem;
  transition: background 0.15s;
  font-family: inherit;
  &:hover {
    background: #ffeaea;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const Loading = styled.div`
  text-align: center;
  color: #888;
  font-size: 1.1rem;
  margin-top: 2rem;
  font-family: inherit;
`

const NotFound = styled.div`
  text-align: center;
  color: #c0392b;
  font-size: 1.1rem;
  margin-top: 2rem;
  font-family: inherit;
`

// Modal styles
const ModalOverlay = styled.div`
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`
const ModalBox = styled.div`
    background: #fff;
    padding: 2rem 2.2rem;
    border-radius: 12px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.13);
    max-width: 350px;
    width: 100%;
    text-align: center;
    font-family: inherit;
`
const ModalActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
`
const ModalButton = styled.button`
    background: #eee;
    border: none;
    border-radius: 6px;
    padding: 0.5rem 1.2rem;
    font-size: 1rem;
    cursor: pointer;
    font-family: inherit;
    &:hover { background: #e3e6ee; }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
`
const ModalButtonDelete = styled(ModalButton)`
    background: #e74c3c;
    color: #fff;
    &:hover { background: #c0392b; }
`

export default AdminPage