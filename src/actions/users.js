// src\actions\users.js
import Api from "@/apis/Api";

// login api
export async function login({ email, password }) {
	const response = await Api.post("/auth-artifex-users", {
		body: {
			email: email,
			password: password,
		},
		fields: "id,email",
	});

	console.log("Auth status: ", response);
	return response;
}

// sign up api
export async function signup({ username, email, password }) {
	const response = await Api.post("/artifex-users", {
		body: {
			username,
			email,
			password,
		},
		fields: "id,username,email"
	});

	console.log('User signup response:', response);
	return response;
}

export async function getUsers(search = "", page = "1,1000", sort = "-created_at") {
	const response = await Api.get("/artifex-catalogue", {
		// search: search,
		// page: page,
		// sort: sort || "-created_at",
	});
	console.log('getUsers : ', response);
	return response;
}

export async function saveUser({ body }) {
	const response = await Api.post("/users", {
		body: body,
	});
	return response;
}

export async function updateUser({ id, body }) {
	const response = await Api.put(`/users/${id}`, {
		body: body,
	});
	return response;
}
