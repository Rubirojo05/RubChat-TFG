import { Navigate,Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { jwtDecode } from 'jwt-decode'

export const RequireAuth = ({ allowedRoles }) =>{
	const {auth} = useAuth()
	const location = useLocation()

	const decoded = auth?.accessToken ?
		jwtDecode(auth?.accessToken)
		: undefined

	const roleId = decoded?.roleId || []

	return (
		allowedRoles?.includes(roleId) ?
			<Outlet /> 
			: auth?.accessToken ? 
				<Navigate to="/unauthorized" state={{ from: location }} replace />
				:<Navigate to="/login" state={{ from: location }} replace />
	)
}