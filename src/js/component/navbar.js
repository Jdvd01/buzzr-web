import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router";
import buzzrLogo from "../../assets/buzzr.png"

import CreateChannel from "./createChannel.jsx";

export const Navbar = () => {
	let navegar = useNavigate()
	const { store, actions } = useContext(Context)
	return (
		<>
		{store.token?.length > 0 ? (

		<nav className="navbar navbar-dark bg-dark container d-flex flex-column flex-md-row justify-content-between">
			<Link to="/channelchat/Welcome">
				<img width="150px" height="80px" src={buzzrLogo}/>
			</Link>

			<div className="ml-auto">
				
					<div>
						<CreateChannel />
						<Link
							to={`/profile`}
							className="btn btn-outline-success me-2"
							onClick={() => actions.handleUser()}>
							Profile
						</Link>
						<button
							type="button"
							className="btn btn-outline-danger"
							onClick={() => {
								actions.handleLogout()
								navegar("/")
							}}>
							<i className="fas fa-sign-out-alt"></i>
						</button>
					</div>
				
			</div>
		</nav>
		) : null}
		</>
	);
};
