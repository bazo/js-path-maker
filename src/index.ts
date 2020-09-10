interface KeyValuePair {
	[key: string]: string | number;
}

export class Path<P extends KeyValuePair = {}, Q extends KeyValuePair = {}> {
	path: string;
	label: string;

	constructor(path: string, label = "") {
		this.path = path;
		this.label = label;
	}

	toURL(pathParams: P = {} as P, queryParams: Q = {} as Q): string {
		let url = this.path;

		Object.entries(pathParams).forEach(([key, value]) => {
			url = url.replace(`:${key}`, value.toString());
		});

		const params = new URLSearchParams(queryParams as Record<string, string>).toString();

		return params ? `${url}?${params}` : url;
	}

	toString(): string {
		return this.path;
	}
}

export default <P extends KeyValuePair = {}, Q extends KeyValuePair = {}>(path: string, label = "") => {
	return new Path<P, Q>(path, label);
};
