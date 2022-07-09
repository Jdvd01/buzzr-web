import React from 'react';
import { useState, useContext } from 'react';
import { Context } from "../store/appContext";

const Register = () => {
	const { store, actions } = useContext(Context)
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [nombre, setNombre] = useState("")
	const [apellido, setApellido] = useState("")
	const [username, setUsername] = useState("")

	const handleUser = (event) => {
		if (event.target.id == "correo") {
			setEmail(event.target.value)
		}
		else if (event.target.id == "contra") {
			setPassword(event.target.value)
		}
		else if (event.target.id == "nombre") {
			setNombre(event.target.value)
		}
		else if (event.target.id == "apellido") {
			setApellido(event.target.value)
		}
		else if (event.target.id == "username") {
			setUsername(event.target.value)
		}
	}

	return (
		<>
			<div className="btn-group">
				<button type="button" className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
					Sign Up
				</button>
				<div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
					<div className="modal-dialog modal-dialog-centered">
						<div className="modal-content p-3">
							<div className="modal-header">
								<h4 className="modal-title" id="exampleModalLabel">Sign up</h4>
								<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
							</div>
							<form className='form-login-register'>
								<div className="mb-3">
									<label htmlFor="exampleInputEmail1" className="form-label login-title">Email:</label>
									<input
										type="email"
										className="input-login-register"
										id="correo"
										placeholder="Email"
										aria-describedby="emailHelp"
										value={email}
										onChange={handleUser}
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="exampleInputPassword1" className="form-label login-title">Password:</label>
									<input
										type="password"
										className="input-login-register"
										id="contra"
										placeholder="Password"
										value={password}
										onChange={handleUser}
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="exampleInputEmail1" className="form-label login-title">Name:</label>
									<input
										type="text"
										className="input-login-register"
										id="nombre"
										placeholder="First Name"
										aria-describedby="emailHelp"
										value={nombre}
										onChange={handleUser}
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="exampleInputEmail1" className="form-label login-title">Last Name:</label>
									<input
										type="text"
										className="input-login-register"
										id="apellido"
										placeholder="Last Name"
										aria-describedby="emailHelp"
										value={apellido}
										onChange={handleUser}
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="exampleInputEmail1" className="form-label login-title">Username:</label>
									<input
										type="text"
										className="input-login-register"
										id="username"
										placeholder="Username"
										aria-describedby="emailHelp"
										value={username}
										onChange={handleUser}
									/>
								</div>
							</form>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => {
									setEmail("")
									setPassword("")
									setNombre("")
									setApellido("")
									setUsername("")
								}}>Close</button>
								<button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={() => {
									actions.signUp(email, password, nombre, apellido, username)
									setEmail("")
									setPassword("")
									setNombre("")
									setApellido("")
									setUsername("")
								}}>Sign Up</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Register;