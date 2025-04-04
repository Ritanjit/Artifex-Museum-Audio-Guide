import Api from "@/apis/Api";

export async function authUser({ email, password }) {
	try {
		const response = await Api.post(`/artifex-users`, {
			fields: `id,email,password,created_at`,
			body: { email, password },
		});

		return response;
	} catch (error) {
		console.error("Login failed:", error);
		return { error: "Invalid credentials" };
	}
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
