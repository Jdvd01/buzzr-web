import io from "socket.io-client";

const endPoint = process.env.ENDPOINT;
const id = localStorage.getItem("id")
let socket = io.connect(`${endPoint}`, { query: `id = ${id}` })

const getState = ({ getStore, getActions, setStore }) => {
	return {

		store: {
			urlBase: `${endPoint}`,
			token: localStorage.getItem("token") || "",
			userId: localStorage.getItem("id") || "",
			userInfo: JSON.parse(localStorage.getItem("userInfo")) || {},
			messages: JSON.parse(localStorage.getItem("messages")) || [],
			allUsers: JSON.parse(localStorage.getItem("allUsers")) || [],
			channels: JSON.parse(localStorage.getItem("channels")) || [],
			channelUsers: JSON.parse(localStorage.getItem("channelUsers")) || [],
			isLogin: localStorage.getItem("token") !== "" ? false : true ,
		},

		actions: {
			handleIsLogin: () =>{
				const store = getStore()
				setStore({
					...store,
					isLogin: true
				})
			},
			handleLogin: async (login) => {
				const store = getStore();
				const actions = getActions();
				try {
					const response = await fetch(`${store.urlBase}/login`, {
						method: 'POST',
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify(login)
					})
					const data = await response.json()
					if (response.ok) {
						setStore({
							...store,
							token: data.token,
							userId: data.user_id,
							userInfo: data
						})
						localStorage.setItem("token", data.token)
						localStorage.setItem("id", data.user_id)
						localStorage.setItem("userInfo", JSON.stringify(data))
						socket.emit("login", data.username)
						actions.handleUser()
						actions.handleAllUsers()
						actions.handleChannels()
						actions.handleMessages("Welcome")
					}
				} catch (error) {
					console.log(error)
				}
			},

			signUp: async (email, password, nombre, apellido, username) => {
				const store = getStore()
				const actions = getActions()
				if (email.trim() == "" || password.trim() == "" || nombre.trim() == "" || apellido.trim() == "" || username.trim() == "") {
					alert('All fields are required')
				}
				else {
					if (actions.checkEmail(email) == false) {
						return alert("Invalid email")
					}
					else {
						let data = {
							"email": email,
							"password": password,
							"name": nombre,
							"last_name": apellido,
							"username": username
						}
						try {
							let response = await fetch(`${store.urlBase}/signup`, {
								method: 'POST',
								body: JSON.stringify(data),
								headers: {
									'Content-Type': 'application/json'
								}
							})
							if (response.ok) {
								let login = {
									"email": email,
									"password": password
								}
								actions.handleLogin(login)
							}
							else {
								console.log(response)
							}
						}
						catch (error) {
							console.log(error)
						}
					}
				}
			},

			handleLogout: () => {
				let store = getStore();
				setStore({
					...store,
					token: "",
					id: ""
				})
				localStorage.removeItem("token")
				localStorage.removeItem("id")
				localStorage.removeItem("userInfo")
				localStorage.removeItem("messages")
				localStorage.removeItem("channels")
			},

			checkEmail: (correo) => {
				let expReg = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
				let isOk = expReg.test(correo)
				if (!isOk) {
					return false
				} else {
					return true
				}
			},

			handleUser: async () => {
				const store = getStore()
				try {
					let response = await fetch(`${store.urlBase}/user/${store.userId}`, {
						method: 'GET',
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.token}`
						}
					})
					if (response.ok) {
						let data = await response.json()
						setStore({
							...store,
							userInfo: data
						})
						localStorage.setItem("userInfo", JSON.stringify(store.userInfo))
					}
				}
				catch (error) {
					console.log(error)
				}
			},

			handleEdit: async (info) => {
				let store = getStore();
				try {
					let response = await fetch(`${store.urlBase}/user/${store.userId}`, {
						method: 'PUT',
						body: JSON.stringify(info),
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.token}`
						}
					})
					if (response.ok) {
						let data = await response.json()
						setStore({
							...store,
							userInfo: data
						})
					}
				} catch (error) {
					console.log(error)
				}
			},
			transformDate: async (messages) => {
				let store = getStore()
				let localDateMessages = [];
				try {
					for (let message of messages) {
						let fecha = new Date(message.date)
						let newDate = fecha.toLocaleTimeString();
						message.date = newDate
						localDateMessages.push(message)
					}
					localDateMessages.sort((a, b) => a.id - b.id)
					setStore({
						...store,
						messages: localDateMessages
					})

				} catch (error) {
					console.log(error)
				}
			},

			handleAllUsers: async () => {
				let store = getStore()
				try {
					let response = await fetch(`${store.urlBase}/user`, {
						method: 'GET',
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.token}`
						}
					})
					if (response.ok) {
						let data = await response.json()
						setStore({
							...store,
							allUsers: data
						})
					}

				} catch (error) {
					console.log(error)
				}
			},

			handlePrivateMessages: async (username) => {
				let store = getStore();
				let actions = getActions();
				let response = await fetch(`${store.urlBase}/private/${username}`, {
					method: 'GET',
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${store.token}`
					}
				})
				if (response.ok) {
					let data = await response.json()
					actions.transformDate(data)
				}
			},

			handleChannels: async () => {
				const store = getStore()
				try {
					let response = await fetch(`${store.urlBase}/channels`, {
						method: 'GET',
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.token}`
						}
					})
					if (response.ok) {
						let data = await response.json()
						setStore({
							...store,
							channels: data
						})
						localStorage.setItem("channels", JSON.stringify(data))
					}
				}
				catch (error) {
					console.log(error)
				}
			},

			createChannel: async (name) => {
				const store = getStore()
				const actions = getActions()
				let info = {
					"channel": name
				}
				try {
					let response = await fetch(`${store.urlBase}/createchannel`, {
						method: 'POST',
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.token}`
						},
						body: JSON.stringify(info)
					})
					if (response.ok) {
						actions.handleChannels()
					}
				}
				catch (error) {
					console.log(error)
				}
			},

			handleMessages: async (name) => {
				const store = getStore()
				const actions = getActions()
				try {
					let response = await fetch(`${store.urlBase}/messages/${name}`, {
						method: 'GET',
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.token}`
						}
					})
					if (response.ok) {
						let data = await response.json()
						actions.transformDate(data)
					}
				}
				catch (error) {
					console.log(error)
				}
			},
			handleChannelUsers: async (channelname) => {
				let store = getStore()
				let actions = getActions()
				try {
					let response = await fetch(`${store.urlBase}/user/${channelname}`)
					if (response.ok) {
						let data = await response.json()
						setStore({
							...store,
							channelUsers: data
						})
					}
				} catch (error) {
					console.log(error)
				}
			}

		}
	}
};
export default getState;