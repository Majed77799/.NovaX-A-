import { NextRequest } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
	const { b64, buyerId } = await req.json().catch(() => ({}));
	if (!b64 || !buyerId) return new Response('Bad Request', { status: 400 });
	const pdfBytes = Buffer.from(b64, 'base64');
	const pdfDoc = await PDFDocument.load(pdfBytes);
	const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
	const pages = pdfDoc.getPages();
	for (const page of pages) {
		const { width, height } = page.getSize();
		const text = `Purchased by ${buyerId}`;
		page.drawText(text, { x: 24, y: 24, size: 10, color: rgb(0.6, 0.6, 0.6), font, opacity: 0.7 });
		page.drawText(text, { x: width/2 - 80, y: height/2, size: 24, color: rgb(0.85, 0.85, 0.85), font, opacity: 0.25, rotate: { type: 'degrees', angle: 30 } as any });
	}
	const out = await pdfDoc.save();
	return Response.json({ b64: Buffer.from(out).toString('base64') });
}