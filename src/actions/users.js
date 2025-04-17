import Api from "@/apis/Api";

export async function login() {
	const response = await Api.post("/auth-artifex-users", { // users can be replaced with any name of the collection
		body: {
			username: "john",
			password: "password",
		},
		fields: "id,name,email,role",
	});

	return response;
};


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
