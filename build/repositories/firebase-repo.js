"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreRepository = void 0;
const geofire = require("geofire-common");
class FirestoreRepository {
    constructor(collectionName, db) {
        this.database = db;
        this.collection = this.database.collection(collectionName);
    }
    async find() {
        const snapshot = await this.collection.get();
        return snapshot.docs.map(doc => doc.data());
    }
    async findOne(id) {
        const doc = await this.collection.doc(id).get();
        return doc.exists ? doc.data() : null;
    }
    async save(entity) {
        const id = entity.id;
        if (!id) {
            const lat = entity.lat;
            if (lat) {
                entity.geohash = geofire.geohashForLocation([lat, entity.lng]);
            }
            await this.collection.add(entity);
        }
        else {
            const lat = entity.lat;
            if (lat) {
                entity.geohash = geofire.geohashForLocation([lat, entity.lng]);
            }
            await this.collection.doc(id).set(entity);
        }
    }
    async findByField(field, value) {
        const snapshot = await this.collection.where(field, '==', value).get();
        return snapshot.docs.map(doc => doc.data());
    }
    async findByFields(fields) {
        let query = this.collection;
        for (const field in fields) {
            query = query.where(field, '==', fields[field]);
        }
        const snapshot = await query.get();
        return snapshot.docs.map(doc => doc.data());
    }
    async delete(id) {
        await this.collection.doc(id).delete();
    }
    async nearby(lat, lng, radiusInM) {
        const center = [lat, lng];
        const bounds = geofire.geohashQueryBounds(center, radiusInM);
        const promises = [];
        for (const b of bounds) {
            const q = this.collection
                .orderBy('geohash')
                .startAt(b[0])
                .endAt(b[1]);
            promises.push(q.get());
        }
        // Collect all the query results together into a single list
        return Promise.all(promises).then((snapshots) => {
            const matchingDocs = [];
            for (const snap of snapshots) {
                for (const doc of snap.docs) {
                    const lat = doc.get('lat');
                    const lng = doc.get('lng');
                    // We have to filter out a few false positives due to GeoHash
                    // accuracy, but most will match
                    const distanceInKm = geofire.distanceBetween([lat, lng], center);
                    const distanceInM = distanceInKm * 1000;
                    if (distanceInM <= radiusInM) {
                        matchingDocs.push(doc.data());
                    }
                }
            }
            return matchingDocs;
        });
    }
}
exports.FirestoreRepository = FirestoreRepository;
//# sourceMappingURL=firebase-repo.js.map