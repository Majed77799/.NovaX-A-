import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function Feed() {
	const [items, setItems] = useState<any[]>([]);
	const [cursor, setCursor] = useState<string | null>(null);
	const loadingRef = useRef(false);
	const h = Dimensions.get('window').height;

	async function loadMore() {
		if (loadingRef.current) return;
		loadingRef.current = true;
		const qs = new URLSearchParams();
		if (cursor) qs.set('cursor', cursor);
		const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/feed?${qs}`);
		const data = await res.json();
		setItems(prev => [...prev, ...data.items]);
		setCursor(data.nextCursor ?? null);
		loadingRef.current = false;
	}

	useEffect(() => { loadMore(); }, []);

	async function act(productId: string, type: 'LIKE'|'SAVE'|'SHARE') {
		await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/feed`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId, type }) });
	}

	return (
		<ScrollView pagingEnabled>
			{items.map(it => (
				<View key={it.id} style={{ height: h, justifyContent: 'flex-end', padding: 16 }}>
					<Image source={{ uri: it.coverUrl }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} resizeMode="cover" />
					<View style={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 16, padding: 16 }}>
						<Text style={{ fontSize: 20, fontWeight: '600' }}>{it.name}</Text>
						<Text style={{ opacity: 0.7, marginTop: 4 }}>by {it.creator?.name ?? 'Creator'}</Text>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
							<Text style={{ fontWeight: '700' }}>{(it.priceCents/100).toLocaleString(undefined, { style: 'currency', currency: it.currency?.toUpperCase?.() || 'USD' })}</Text>
							<View style={{ flexDirection: 'row', gap: 12 }}>
								<TouchableOpacity onPress={() => act(it.id, 'LIKE')}><Text>♥</Text></TouchableOpacity>
								<TouchableOpacity onPress={() => act(it.id, 'SAVE')}><Text>💾</Text></TouchableOpacity>
								<TouchableOpacity onPress={() => act(it.id, 'SHARE')}><Text>↗</Text></TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
			))}
			<TouchableOpacity onPress={loadMore} style={{ padding: 16 }}><Text>Load more</Text></TouchableOpacity>
		</ScrollView>
	);
}