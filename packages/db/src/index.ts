import mongoose from 'mongoose';

let isConnected = false;

export async function connectToDatabase(uri?: string) {
	const mongoUri = uri || process.env.MONGODB_URI;
	if (!mongoUri) throw new Error('MONGODB_URI not set');
	if (isConnected) return mongoose.connection;
	mongoose.set('strictQuery', true);
	await mongoose.connect(mongoUri, { dbName: process.env.MONGODB_DB || undefined });
	isConnected = true;
	return mongoose.connection;
}

// Common types
export type LangString = { [lang: string]: string };

// User
export interface IUser extends mongoose.Document {
	email: string;
	name?: string;
	stripeCustomerId?: string;
	stripeConnectId?: string;
	affiliateCode?: string;
	roles: string[];
	createdAt: Date;
	updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
	email: { type: String, required: true, unique: true, index: true },
	name: { type: String },
	stripeCustomerId: { type: String },
	stripeConnectId: { type: String },
	affiliateCode: { type: String, index: true },
	roles: { type: [String], default: [] }
}, { timestamps: true });

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// Product & multi-creator splits
export interface IRevenueSplit {
	userId: string;
	shareBps: number; // basis points
}

export interface IProduct extends mongoose.Document {
	title: LangString;
	description?: LangString;
	priceCents: number;
	currency: string;
	creators: IRevenueSplit[];
	assets: { key: string; kind: 'file'|'image'|'video'; s3Url?: string }[];
	translations?: { [lang: string]: { title?: string; description?: string; pdfKey?: string } };
	bundles?: string[]; // product ids included
	metadata?: Record<string, any>;
	createdAt: Date;
	updatedAt: Date;
}

const ProductSchema = new mongoose.Schema<IProduct>({
	title: { type: Object, required: true },
	description: { type: Object },
	priceCents: { type: Number, required: true, index: true },
	currency: { type: String, required: true, default: 'usd' },
	creators: [{ userId: { type: String, required: true }, shareBps: { type: Number, required: true } }],
	assets: [{ key: String, kind: { type: String, enum: ['file','image','video'] }, s3Url: String }],
	translations: { type: Object },
	bundles: [{ type: String }],
	metadata: { type: Object }
}, { timestamps: true });

export const ProductModel = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

// Orders & watermarking
export interface IOrder extends mongoose.Document {
	buyerId: string;
	items: { productId: string; quantity: number; priceCents: number; currency: string }[];
	amountCents: number;
	currency: string;
	status: 'created'|'paid'|'failed'|'refunded';
	stripeSessionId?: string;
	stripePaymentIntentId?: string;
	createdAt: Date;
	updatedAt: Date;
}

const OrderSchema = new mongoose.Schema<IOrder>({
	buyerId: { type: String, required: true, index: true },
	items: [{ productId: String, quantity: Number, priceCents: Number, currency: String }],
	amountCents: { type: Number, required: true },
	currency: { type: String, required: true },
	status: { type: String, enum: ['created','paid','failed','refunded'], default: 'created', index: true },
	stripeSessionId: { type: String },
	stripePaymentIntentId: { type: String }
}, { timestamps: true });

export const OrderModel = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

// Social graph and gamification
export interface ISocialAction extends mongoose.Document {
	actorId: string;
	targetType: 'product'|'user'|'guild'|'comment';
	targetId: string;
	action: 'like'|'comment'|'follow'|'share'|'affiliate_click';
	commentText?: string;
	createdAt: Date;
}

const SocialActionSchema = new mongoose.Schema<ISocialAction>({
	actorId: { type: String, index: true },
	targetType: { type: String, enum: ['product','user','guild','comment'], index: true },
	targetId: { type: String, index: true },
	action: { type: String, enum: ['like','comment','follow','share','affiliate_click'], index: true },
	commentText: { type: String }
}, { timestamps: { createdAt: true, updatedAt: false } });

export const SocialActionModel = mongoose.models.SocialAction || mongoose.model<ISocialAction>('SocialAction', SocialActionSchema);

export interface IPointsEvent extends mongoose.Document {
	userId: string;
	event: string;
	points: number;
	idempotencyKey: string;
	createdAt: Date;
}

const PointsEventSchema = new mongoose.Schema<IPointsEvent>({
	userId: { type: String, index: true },
	event: { type: String },
	points: { type: Number },
	idempotencyKey: { type: String, unique: true, index: true }
}, { timestamps: { createdAt: true, updatedAt: false } });

export const PointsEventModel = mongoose.models.PointsEvent || mongoose.model<IPointsEvent>('PointsEvent', PointsEventSchema);

// Guilds & communities
export interface IGuild extends mongoose.Document {
	name: string;
	description?: string;
	owners: string[]; // userIds
	members: string[]; // userIds
	treasuryCents: number;
	createdAt: Date;
	updatedAt: Date;
}

const GuildSchema = new mongoose.Schema<IGuild>({
	name: { type: String, required: true },
	description: { type: String },
	owners: [{ type: String }],
	members: [{ type: String }],
	treasuryCents: { type: Number, default: 0 }
}, { timestamps: true });

export const GuildModel = mongoose.models.Guild || mongoose.model<IGuild>('Guild', GuildSchema);

// Auth ledger & watermarking
export interface IWatermark extends mongoose.Document {
	orderId: string;
	buyerId: string;
	assetKey: string;
	watermarkHash: string;
	createdAt: Date;
}

const WatermarkSchema = new mongoose.Schema<IWatermark>({
	orderId: { type: String, index: true },
	buyerId: { type: String, index: true },
	assetKey: { type: String },
	watermarkHash: { type: String, unique: true, index: true }
}, { timestamps: { createdAt: true, updatedAt: false } });

export const WatermarkModel = mongoose.models.Watermark || mongoose.model<IWatermark>('Watermark', WatermarkSchema);

// Pricing rules & experiments
export interface IPricingRule extends mongoose.Document {
	name: string;
	scope: 'global'|'product'|'user'|'guild';
	targetId?: string;
	rule: { type: 'fixed'|'discount'|'dynamic'; percentage?: number; minCents?: number; maxCents?: number };
	priority: number;
	active: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const PricingRuleSchema = new mongoose.Schema<IPricingRule>({
	name: String,
	scope: { type: String, enum: ['global','product','user','guild'], index: true },
	targetId: { type: String },
	rule: { type: Object, required: true },
	priority: { type: Number, default: 0 },
	active: { type: Boolean, default: true }
}, { timestamps: true });

export const PricingRuleModel = mongoose.models.PricingRule || mongoose.model<IPricingRule>('PricingRule', PricingRuleSchema);

// Trend insights connector records
export interface IMarketInsight extends mongoose.Document {
	source: 'twitter'|'reddit'|'news'|'custom';
	key: string;
	value: number;
	metadata?: Record<string, any>;
	observedAt: Date;
}

const MarketInsightSchema = new mongoose.Schema<IMarketInsight>({
	source: { type: String, enum: ['twitter','reddit','news','custom'], index: true },
	key: { type: String, index: true },
	value: { type: Number },
	metadata: { type: Object },
	observedAt: { type: Date, default: () => new Date(), index: true }
}, { timestamps: false });

export const MarketInsightModel = mongoose.models.MarketInsight || mongoose.model<IMarketInsight>('MarketInsight', MarketInsightSchema);

// Affiliate links and payouts
export interface IAffiliateAttribution extends mongoose.Document {
	code: string;
	referrerUserId: string;
	clickCount: number;
	createdAt: Date;
}

const AffiliateAttributionSchema = new mongoose.Schema<IAffiliateAttribution>({
	code: { type: String, index: true },
	referrerUserId: { type: String, index: true },
	clickCount: { type: Number, default: 0 }
}, { timestamps: { createdAt: true, updatedAt: false } });

export const AffiliateAttributionModel = mongoose.models.AffiliateAttribution || mongoose.model<IAffiliateAttribution>('AffiliateAttribution', AffiliateAttributionSchema);

export function ensureIndexes() {
	UserModel.createIndexes().catch(()=>{});
	ProductModel.createIndexes().catch(()=>{});
	OrderModel.createIndexes().catch(()=>{});
	SocialActionModel.createIndexes().catch(()=>{});
	PointsEventModel.createIndexes().catch(()=>{});
	GuildModel.createIndexes().catch(()=>{});
	WatermarkModel.createIndexes().catch(()=>{});
	PricingRuleModel.createIndexes().catch(()=>{});
	MarketInsightModel.createIndexes().catch(()=>{});
	AffiliateAttributionModel.createIndexes().catch(()=>{});
}