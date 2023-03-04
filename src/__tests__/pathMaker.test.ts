import path, { PathParamSpec } from "../";
import { describe, expect, test } from "vitest";

const paths = {
	HOME: path("/"),
	PROJECTS: path("/projects"),
	PROJECTS_NEW: path("/projects/new"),
	PROJECT: path<{ id: string }>("/projects/:id"),
	LOGIN: path<PathParamSpec, { code: number; scope: string }>("/login"),
	REGISTER: path("/register"),
	LABELED: path("/register", "Registration"),
	WITH_CHILDREN: path("/children", "With children").withChildren({
		CHILD1: path("/child1", "Child1").withChildren({
			SUB_CHILD1: path("/subchild1", "Sub Child1"),
		}),
		CHILD2: path("/child2", "Child2"),
	}),
};

describe("path maker", () => {
	test("simple path", () => {
		expect(paths.HOME.toString()).toEqual("/");
		expect(paths.HOME.toString()).toEqual(paths.HOME.path);
		expect(paths.HOME.toURL()).toEqual("/");
		expect(paths.HOME.path).toEqual("/");
	});

	test("path with path params", () => {
		expect(paths.PROJECT.toString()).toEqual("/projects/:id");
		expect(paths.PROJECT.path).toEqual("/projects/:id");
		expect(paths.PROJECT.toString()).toEqual(paths.PROJECT.path);
		expect(paths.PROJECT.path).toEqual(paths.PROJECT.path);
		//expect(paths.PROJECT.toURL({ id: "123" })).toEqual("/projects/123");
	});

	test("path with path query", () => {
		expect(paths.LOGIN.toString()).toEqual("/login");
		expect(paths.LOGIN.path).toEqual("/login");
		expect(paths.LOGIN.toString()).toEqual(paths.LOGIN.path);
		expect(paths.LOGIN.path).toEqual(paths.LOGIN.path);
		expect(paths.LOGIN.toURL({}, { code: 123, scope: "somescope" })).toEqual("/login?code=123&scope=somescope");
	});

	test("path has label", () => {
		expect(paths.LABELED.label).toEqual("Registration");
	});

	test("path with children", () => {
		expect(paths.WITH_CHILDREN.CHILD1.fullPath).toEqual("/children/child1");
		expect(paths.WITH_CHILDREN.CHILD1.SUB_CHILD1.fullPath).toEqual("/children/child1/subchild1");
	});
});
