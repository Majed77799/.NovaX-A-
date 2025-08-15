export function pdfFromText(text: string): string {
	const header = "%PDF-1.4\n";
	const bodyText = text.replace(/\r?\n/g, "\\n");
	const content = `1 0 obj<<>>endobj\n2 0 obj<<>>endobj\n3 0 obj<</Length 44>>stream\nBT /F1 12 Tf 72 720 Td (${escapePdf(bodyText)}) Tj ET\nendstream endobj\n4 0 obj<</Type /Page /Parent 5 0 R /Contents 3 0 R>>endobj\n5 0 obj<</Type /Pages /Kids [4 0 R] /Count 1>>endobj\n6 0 obj<</Type /Catalog /Pages 5 0 R>>endobj\nxref\n0 7\n0000000000 65535 f \ntrailer<</Size 7 /Root 6 0 R>>\nstartxref\n0\n%%EOF`;
	const pdf = header + content;
	const bytes = new TextEncoder().encode(pdf);
	let binary = '';
	for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
	return btoa(binary);
}

export function escapePdf(s: string) {
	return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}