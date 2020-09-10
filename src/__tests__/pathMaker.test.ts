import path from "../";

const paths = {
	HOME: path("/"),
	PROJECTS: path("/projects"),
	PROJECTS_NEW: path("/projects/new"),
	PROJECT: path<{ id: string }>("/projects/:id"),
	LOGIN: path<{}, {code: number, scope: string}>("/login"),
	REGISTER: path("/register"),
	LABELED: path("/register", "Registration"),
};

describe("path maker", () => {
	test('simple path', () => {
		expect(paths.HOME.toString()).toEqual("/")
		expect(paths.HOME.toString()).toEqual(paths.HOME.path)
		expect(paths.HOME.toURL()).toEqual("/")
	})

	test('path with path params', () => {
		expect(paths.PROJECT.toString()).toEqual("/projects/:id")
		expect(paths.PROJECT.toString()).toEqual(paths.PROJECT.path)
		expect(paths.PROJECT.toURL({id: "123"})).toEqual("/projects/123")
	})

	test('path with path query', () => {
		expect(paths.LOGIN.toString()).toEqual("/login")
		expect(paths.LOGIN.toString()).toEqual(paths.LOGIN.path)
		expect(paths.LOGIN.toURL({}, {code: 123, scope: "somescope"})).toEqual("/login?code=123&scope=somescope")
	})

	test('path has label', () => {
		expect(paths.LABELED.label).toEqual("Registration")
	})
});
