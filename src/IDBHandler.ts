/* eslint-disable */
export function saveRoomData (data: any) {
	// This works on all devices/browsers, and uses IndexedDBShim as a final fallback
	const indexedDB = window.indexedDB
					|| (window as any).mozIndexedDB
					|| (window as any).webkitIndexedDB
					|| (window as any).msIndexedDB
					|| (window as any).shimIndexedDB;

	// Open (or create) the database
	const open = indexedDB.open("PartyboxDB", 4);

	// Create the schema
	open.onupgradeneeded = () => {
		const db = open.result;
		const store = db.createObjectStore("PartyboxStore", { keyPath: "id" });
		const index = store.createIndex("NameIndex", ["data.roomId", "data.type", "data.admin"]);
	};

	open.onsuccess = () => {
		// Start a new transaction
		const db = open.result;
		const tx = db.transaction("PartyboxStore", "readwrite");
		const store = tx.objectStore("PartyboxStore");

		// Add some data
		store.put({ id: 1, data: { roomId: data.roomId, type: data.type, admin: data.admin } });

		// Close the db when the transaction is done
		tx.oncomplete = () => {
			db.close();
		};
	}
}
