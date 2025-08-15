declare module 'etag' {
	export default function etag(entity: string | Buffer, options?: { weak?: boolean }): string;
}