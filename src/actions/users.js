import Api from "@/apis/Api";

export async function login({ email, password }) {
	const response = await Api.post("/auth-artifex-users", {
		body: {
			email: email,
			password: password,
		},
		fields: "id,email",
		headers: {
			app: "s5_intern_database",
			token: "czVfaW50ZXJuX2RhdGFiYXNlLDE3NDQ5MDI1MTU1NTg6TVhob09USnE=", // Your actual token
		},
	});

	console.log("Auth status: ", response);
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
