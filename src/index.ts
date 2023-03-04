export type PathParamSpec = Record<string, string | number>;

type PathChildren<C> = Record<keyof C, Path>;

type KeyOfMap<M extends Map<unknown, unknown>> = M extends Map<infer K, unknown> ? K : never;

function getParentPaths(parent: Path, paths: string[]): string[] {
	paths.push(parent.path);

	if (parent.hasParent()) {
		return getParentPaths(parent.parent!, paths);
	}

	return paths;
}

export class Path<P extends PathParamSpec = PathParamSpec, Q extends PathParamSpec = PathParamSpec> {
	private _path: string;
	label: string;
	private _children: Map<string, Path> = new Map();

	private _parent: Path | undefined = undefined;

	proxyHandler = {
		get(target: Path, name: string) {
			//@ts-ignore
			if (target[name]) {
				//@ts-ignore
				return target[name];
			}

			if (target.hasOwnProperty(`_${name}`)) {
				//@ts-ignore
				return target[name];
			}

			if (target._children.has(name)) {
				return target._children.get(name);
			}

			return name;
		},
	};

	constructor(path: string, label = "") {
		this._path = path;
		this.label = label;

		//@ts-ignore
		// rome-ignore lint/nursery/noConstructorReturn: <explanation>
		return new Proxy(this, this.proxyHandler);
	}

	toURL = (pathParams: P = {} as P, queryParams: Q = {} as Q): string => {
		let url = this._path;

		Object.entries(pathParams).forEach(([key, value]) => {
			url = url.replace(`:${key}`, value.toString());
		});

		const params = new URLSearchParams(queryParams as Record<string, string>).toString();

		return params ? `${url}?${params}` : url;
	};

	get fullPath() {
		if (this._parent !== undefined) {
			return getParentPaths(this._parent, [this._path]).reverse().join("");
		}

		return this.toString();
	}

	get path() {
		return this.toString();
	}

	get children() {
		return this._children;
	}

	get parent() {
		return this._parent;
	}

	hasParent = (): boolean => {
		return this._parent !== undefined;
	};

	hasChildren = (): boolean => {
		return this._children.size > 0;
	};

	toString = (): string => {
		return this._path;
	};

	withChildren = <C>(children: PathChildren<C>): Path & Record<keyof C, Path> => {
		this._children = new Map(
			//@ts-ignore
			Object.entries(children).map(([key, path]: [string, Path]) => {
				path._parent = this as unknown as Path;
				return [key, path];
			}),
		);

		//@ts-ignore
		return new Proxy(this, this.proxyHandler);
	};
}

export default <P extends PathParamSpec = PathParamSpec, Q extends PathParamSpec = PathParamSpec>(path: string, label = "") => {
	return new Path<P, Q>(path, label);
};
