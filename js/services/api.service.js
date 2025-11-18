// API Configuration
const API_URL = 'http://localhost:3001';

// API Service
const api = {
    // Usuarios
    async register(userData) {
        try {
            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    },

    async login(email, password) {
        try {
            const response = await fetch(`${API_URL}/users?email=${email}`);
            const users = await response.json();
            
            if (users.length === 0) {
                throw new Error('Usuario no encontrado');
            }
            
            const user = users[0];
            // En producción, verificar password hash
            if (user.password_hash) {
                return user;
            }
            
            throw new Error('Contraseña incorrecta');
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    },

    async getUser(id) {
        try {
            const response = await fetch(`${API_URL}/users/${id}`);
            return await response.json();
        } catch (error) {
            console.error('Error obteniendo usuario:', error);
            throw error;
        }
    },

    async updateUser(id, userData) {
        try {
            const response = await fetch(`${API_URL}/users/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error actualizando usuario:', error);
            throw error;
        }
    },

    // Sesiones
    async createSession(userId) {
        try {
            const session = {
                userId: userId,
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 días
            };
            
            const response = await fetch(`${API_URL}/sessions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(session)
            });
            return await response.json();
        } catch (error) {
            console.error('Error creando sesión:', error);
            throw error;
        }
    },

    async deleteSession(sessionId) {
        try {
            await fetch(`${API_URL}/sessions/${sessionId}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('Error eliminando sesión:', error);
            throw error;
        }
    }
};

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
}
