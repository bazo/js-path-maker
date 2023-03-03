export type PathParamSpec = Record<string, string | number>;

export class Path<P extends PathParamSpec = PathParamSpec, Q extends PathParamSpec = PathParamSpec> {
	_path: string;
	label: string;

	constructor(path: string, label = "") {
		this._path = path;
		this.label = label;
	}

	toURL(pathParams: P = {} as P, queryParams: Q = {} as Q): string {
		let url = this._path;

		Object.entries(pathParams).forEach(([key, value]) => {
			url = url.replace(`:${key}`, value.toString());
		});

		const params = new URLSearchParams(queryParams as Record<string, string>).toString();

		return params ? `${url}?${params}` : url;
	}

	get path() {
		return this.toString();
	}

	toString(): string {
		return this._path;
	}
}

export default <P extends PathParamSpec = PathParamSpec, Q extends PathParamSpec = PathParamSpec>(path: string, label = "") => {
	return new Path<P, Q>(path, label);
};
